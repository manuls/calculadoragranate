import type { Competition, FixedScore, HistoricalSeason, ModelInput, Objective, Simulation, TeamStrength } from "./model-types";

export const MODEL_VERSION = "granate-poisson-1.2";
export const PONTEVEDRA_ID = 3;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export function prepareModel(competition: Competition, history: HistoricalSeason[]): ModelInput {
  const startYear = Number(competition.season.slice(0, 4));
  const usable = history.filter((season) => Number(season.season.slice(0, 4)) < startYear);
  let weightedHome = 0, weightedAway = 0, totalWeight = 0;
  for (const season of usable) {
    const weight = 0.8 ** (startYear - 1 - Number(season.season.slice(0, 4))) * (season.group === 1 ? 1 : 0.8);
    const administrative = new Set(season.teams.filter((team) => team.administrativeNote).map((team) => team.id));
    for (const match of season.matches) {
      if (administrative.has(match.homeId) || administrative.has(match.awayId)) continue;
      weightedHome += match.homeGoals * weight;
      weightedAway += match.awayGoals * weight;
      totalWeight += weight;
    }
  }
  if (!totalWeight) throw new Error("No hay históricos suficientes para estimar el modelo.");
  const homeMean = weightedHome / totalWeight;
  const awayMean = weightedAway / totalWeight;
  const mean = (homeMean + awayMean) / 2;
  const previousYear = usable.filter((season) => Number(season.season.slice(0, 4)) === startYear - 1);
  const priors = competition.teams.map((team): TeamStrength => {
    const previous = previousYear.flatMap((season) => season.teams).find((candidate) => candidate.id === team.sourceId && !candidate.administrativeNote);
    return { teamId: team.id, attack: previous ? clamp(1 + 0.35 * (previous.goalsFor / previous.played / mean - 1), 0.6, 1.6) : 1, defense: previous ? clamp(1 + 0.35 * (previous.goalsAgainst / previous.played / mean - 1), 0.6, 1.6) : 1, uncertainty: 0.24 / Math.sqrt(1 + team.played / 8) };
  });
  let strengths = priors.map((prior) => ({ ...prior }));
  const played = competition.matches.filter((match) => match.homeGoals !== null && match.awayGoals !== null);
  const lastRound = Math.max(0, ...played.map((match) => match.round));
  for (let iteration = 0; iteration < 6; iteration++) {
    const byId = new Map(strengths.map((strength) => [strength.teamId, strength]));
    strengths = priors.map((prior) => {
      let attack = prior.attack * 8, defense = prior.defense * 8, weight = 8;
      for (const match of played) {
        if (match.homeId !== prior.teamId && match.awayId !== prior.teamId) continue;
        const home = match.homeId === prior.teamId;
        const opponent = byId.get(home ? match.awayId : match.homeId)!;
        const w = 0.96 ** (lastRound - match.round);
        attack += w * (home ? match.homeGoals! : match.awayGoals!) / ((home ? homeMean : awayMean) * opponent.defense);
        defense += w * (home ? match.awayGoals! : match.homeGoals!) / ((home ? awayMean : homeMean) * opponent.attack);
        weight += w;
      }
      return { ...prior, attack: clamp(attack / weight, 0.4, 2.2), defense: clamp(defense / weight, 0.4, 2.2) };
    });
  }
  return { competition, strengths, homeMean, awayMean };
}

function randomGenerator(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function modelSeed(competition: Competition) {
  const key = `${MODEL_VERSION}:${competition.season}:${competition.matches.map((match) => `${match.id}:${match.homeGoals}:${match.awayGoals}`).join("|")}`;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) hash = Math.imul(hash ^ key.charCodeAt(i), 16777619);
  return hash >>> 0;
}

function poisson(mean: number, random: () => number) {
  const limit = Math.exp(-clamp(mean, 0.08, 6));
  let product = 1, count = 0;
  do { count++; product *= random(); } while (product > limit);
  return count - 1;
}

function quantile(sorted: number[], q: number) {
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * q))];
}

export function simulate(input: ModelInput, iterations = 10000, fixedScores: FixedScore[] = [], seed = modelSeed(input.competition)): Simulation {
  if (!Number.isInteger(iterations) || iterations < 100 || iterations > 30000) throw new Error("Número de simulaciones fuera de rango.");
  const { competition, strengths, homeMean, awayMean } = input;
  const teams = competition.teams;
  const n = teams.length;
  const index = new Map(teams.map((team, i) => [team.id, i]));
  const selectedIndex = index.get(PONTEVEDRA_ID);
  if (n !== 20 || selectedIndex === undefined || competition.matches.length !== 380) throw new Error("La simulación necesita el grupo completo.");
  const pendingIds = new Set(competition.matches.filter((match) => match.homeGoals === null).map((match) => match.id));
  if (fixedScores.length > 380 || new Set(fixedScores.map((score) => score.matchId)).size !== fixedScores.length
    || fixedScores.some((score) => !pendingIds.has(score.matchId) || !Number.isInteger(score.homeGoals) || !Number.isInteger(score.awayGoals) || score.homeGoals < 0 || score.awayGoals < 0 || score.homeGoals > 15 || score.awayGoals > 15)) throw new Error("Los escenarios solo admiten hasta 380 partidos pendientes con marcadores de 0 a 15.");
  const fixed = new Map(fixedScores.map((score) => [score.matchId, score]));
  const strengthMap = new Map(strengths.map((strength) => [strength.teamId, strength]));
  const ratings = teams.map((team) => strengthMap.get(team.id)!);
  const schedule = competition.matches.map((match) => ({ ...match, home: index.get(match.homeId)!, away: index.get(match.awayId)! }));
  const random = randomGenerator(seed);
  const pointSamples: number[][] = teams.map(() => []);
  const successes = teams.map(() => ({ survival: 0, playoff: 0, champion: 0, topFive: 0 }));
  const selectedOutcomes: { points: number; rank: number }[] = [];
  const cuts: Record<Objective, number[]> = { survival: [], playoff: [], champion: [] };
  let unresolvedRuns = 0;

  for (let simulation = 0; simulation < iterations; simulation++) {
    const points = teams.map((team) => team.pointsAdjustment);
    const goalsFor = new Array<number>(n).fill(0);
    const goalsAgainst = new Array<number>(n).fill(0);
    const mutualPoints = new Int16Array(n * n);
    const mutualDifference = new Int16Array(n * n);
    const tieKeys = teams.map(() => random());
    const uncertainRatings = ratings.map((rating) => {
      const z1 = Math.sqrt(-2 * Math.log(Math.max(1e-10, random()))) * Math.cos(2 * Math.PI * random());
      const z2 = Math.sqrt(-2 * Math.log(Math.max(1e-10, random()))) * Math.cos(2 * Math.PI * random());
      const sigma = rating.uncertainty;
      return { attack: rating.attack * Math.exp(sigma * z1 - sigma * sigma / 2), defense: rating.defense * Math.exp(sigma * z2 - sigma * sigma / 2) };
    });
    for (const match of schedule) {
      const h = match.home, a = match.away;
      let hg = match.homeGoals, ag = match.awayGoals;
      if (hg === null || ag === null) {
        hg = poisson(homeMean * uncertainRatings[h].attack * uncertainRatings[a].defense, random);
        ag = poisson(awayMean * uncertainRatings[a].attack * uncertainRatings[h].defense, random);
        const imposed = fixed.get(match.id);
        // Se consumen los mismos aleatorios aunque haya resultado fijado para comparar escenarios.
        if (imposed) { hg = imposed.homeGoals; ag = imposed.awayGoals; }
      }
      goalsFor[h] += hg; goalsAgainst[h] += ag;
      goalsFor[a] += ag; goalsAgainst[a] += hg;
      const hp = hg > ag ? 3 : hg === ag ? 1 : 0;
      const ap = ag > hg ? 3 : hg === ag ? 1 : 0;
      points[h] += hp; points[a] += ap;
      mutualPoints[h * n + a] += hp; mutualPoints[a * n + h] += ap;
      mutualDifference[h * n + a] += hg - ag; mutualDifference[a * n + h] += ag - hg;
    }
    let unresolved = false;
    function resolveTie(group: number[]): number[] {
      if (group.length < 2) return group;
      const criteria: ((i: number) => number)[] = [];
      if (group.length > 2) criteria.push((i) => group.reduce((sum, other) => sum + mutualPoints[i * n + other], 0));
      criteria.push((i) => group.reduce((sum, other) => sum + mutualDifference[i * n + other], 0));
      criteria.push((i) => goalsFor[i] - goalsAgainst[i], (i) => goalsFor[i]);
      for (const criterion of criteria) {
        const buckets = new Map<number, number[]>();
        for (const i of group) { const value = criterion(i); buckets.set(value, [...(buckets.get(value) ?? []), i]); }
        if (buckets.size > 1) return [...buckets.entries()].sort((a, b) => b[0] - a[0]).flatMap(([, subgroup]) => resolveTie(subgroup));
      }
      // Sin datos futuros de juego limpio: desempate aleatorio explícito, nunca por nombre.
      unresolved = true;
      return [...group].sort((a, b) => tieKeys[a] - tieKeys[b]);
    }
    const byPoints = new Map<number, number[]>();
    for (let i = 0; i < n; i++) byPoints.set(points[i], [...(byPoints.get(points[i]) ?? []), i]);
    const order = [...byPoints.entries()].sort((a, b) => b[0] - a[0]).flatMap(([, group]) => resolveTie(group));
    if (unresolved) unresolvedRuns++;
    order.forEach((teamIndex, rank) => {
      successes[teamIndex].survival += Number(rank < 15);
      successes[teamIndex].playoff += Number(rank >= 1 && rank <= 4);
      successes[teamIndex].champion += Number(rank === 0);
      successes[teamIndex].topFive += Number(rank <= 4);
      pointSamples[teamIndex].push(points[teamIndex]);
    });
    selectedOutcomes.push({ points: points[selectedIndex], rank: order.indexOf(selectedIndex) + 1 });
    cuts.survival.push(points[order[14]]);
    cuts.playoff.push(points[order[4]]);
    cuts.champion.push(points[order[0]]);
  }
  const probabilities = teams.map((team, i) => {
    const sorted = pointSamples[i].sort((a, b) => a - b);
    return { teamId: team.id, survival: successes[i].survival / iterations * 100, playoff: successes[i].playoff / iterations * 100, champion: successes[i].champion / iterations * 100, topFive: successes[i].topFive / iterations * 100, expectedPoints: sorted.reduce((a, b) => a + b, 0) / iterations, lowPoints: quantile(sorted, 0.1), highPoints: quantile(sorted, 0.9) };
  });
  const targets = {} as Simulation["targets"];
  for (const objective of ["survival", "playoff", "champion"] as const) {
    const rankLimit = objective === "survival" ? 15 : objective === "playoff" ? 5 : 1;
    const sortedCuts = cuts[objective].sort((a, b) => a - b);
    let chosen: { points: number; probability: number; sampleSize: number } | null = null;
    const maxPoints = teams[selectedIndex].points + (38 - teams[selectedIndex].played) * 3;
    for (let p = teams[selectedIndex].points; p <= maxPoints; p++) {
      const sample = selectedOutcomes.filter((row) => row.points === p);
      if (sample.length < Math.max(100, iterations * 0.01)) continue;
      const successful = sample.filter((row) => row.rank <= rankLimit).length;
      const probability = successful / sample.length;
      // Límite inferior de Wilson al 95% para evitar objetivos basados en pocas simulaciones.
      const z = 1.96, count = sample.length;
      const lower = (probability + z * z / (2 * count) - z * Math.sqrt(probability * (1 - probability) / count + z * z / (4 * count * count))) / (1 + z * z / count);
      if (lower >= 0.9) { chosen = { points: p, probability: probability * 100, sampleSize: count }; break; }
    }
    targets[objective] = { points: chosen?.points ?? null, probability: chosen?.probability ?? null, sampleSize: chosen?.sampleSize ?? 0, cutLow: quantile(sortedCuts, 0.1), cutMedian: quantile(sortedCuts, 0.5), cutHigh: quantile(sortedCuts, 0.9) };
  }
  return { version: MODEL_VERSION, iterations, seed, probabilities, targets, unresolvedTieRate: unresolvedRuns / iterations * 100, fixedScores };
}
