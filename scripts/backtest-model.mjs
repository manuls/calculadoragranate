import { readFile } from "node:fs/promises";
import ts from "typescript";

// Carga el modelo real sin duplicar sus ecuaciones en el análisis retrospectivo.
const modelSource = await readFile(new URL("../lib/forecasts/model.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(modelSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { prepareModel, predictFixture, simulate, MODEL_PARAMETERS } =
  await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const { seasons } = JSON.parse(await readFile(new URL("../lib/forecasts/historical-seasons.json", import.meta.url), "utf8"));

const rounds = [2, 5, 10, 20, 30];
const iterations = Number(process.argv[2] ?? 800);
if (!Number.isInteger(iterations) || iterations < 100 || iterations > 30000) throw new Error("Indica de 100 a 30 000 simulaciones.");
const heldOut = seasons.filter((season) => Number(season.season.slice(0, 4)) >= 2022
  && !season.teams.some((team) => team.administrativeNote || team.pointsAdjustment));
const candidates = [8, 16, 24].map((priorMatches) => ({ ...MODEL_PARAMETERS, priorMatches }));
const categories = ["survival", "playoff", "champion"];
const baselineBrier = { survival: 0.75 * 0.25, playoff: 0.2 * 0.8, champion: 0.05 * 0.95 };

function snapshot(season, round) {
  const ids = [...season.teams.map((team) => team.id)].sort((a, b) => Number(a) - Number(b));
  const bySource = new Map(ids.map((id, index) => [id, index + 1]));
  const played = season.matches.filter((match) => match.round <= round);
  const teams = season.teams.map((team) => {
    const games = played.filter((match) => match.homeId === team.id || match.awayId === team.id);
    let won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0;
    for (const match of games) {
      const forGoals = match.homeId === team.id ? match.homeGoals : match.awayGoals;
      const againstGoals = match.homeId === team.id ? match.awayGoals : match.homeGoals;
      goalsFor += forGoals; goalsAgainst += againstGoals;
      if (forGoals > againstGoals) won++;
      else if (forGoals === againstGoals) drawn++;
      else lost++;
    }
    return { id: bySource.get(team.id), sourceId: team.id, name: team.name, position: 0,
      played: games.length, won, drawn, lost, goalsFor, goalsAgainst, points: 3 * won + drawn, pointsAdjustment: 0 };
  });
  const matches = season.matches.map((match) => ({
    id: match.id, round: match.round, homeId: bySource.get(match.homeId), awayId: bySource.get(match.awayId),
    date: match.date ?? null, homeGoals: match.round <= round ? match.homeGoals : null,
    awayGoals: match.round <= round ? match.awayGoals : null,
  }));
  return { competition: { season: season.season, capturedAt: season.capturedAt, sourceUrl: season.sourceUrl,
    source: "Histórico", availability: "saved", teams, matches }, bySource };
}

function evaluate(parameters, selection) {
  const totals = Object.fromEntries(categories.map((category) => [category, { brier: 0, count: 0 }]));
  const moments = Object.fromEntries(categories.map((category) => [category, { cross: 0, square: 0 }]));
  let matchBrier = 0, matchCount = 0, matchCross = 0, matchSquare = 0;
  for (const season of selection) for (const round of rounds) {
    const { competition, bySource } = snapshot(season, round);
    const input = prepareModel(competition, seasons, parameters);
    const forecast = simulate(input, iterations);
    const finalPositions = new Map(season.teams.map((team) => [bySource.get(team.id), team.position]));
    for (const row of forecast.probabilities) {
      const position = finalPositions.get(row.teamId);
      const actual = { survival: Number(position <= 15), playoff: Number(position >= 2 && position <= 5), champion: Number(position === 1) };
      for (const category of categories) {
        const score = (row[category] / 100 - actual[category]) ** 2;
        totals[category].brier += score;
        totals[category].count++;
        const deviation = row[category] / 100 - ({ survival: 0.75, playoff: 0.2, champion: 0.05 })[category];
        moments[category].cross += deviation * (actual[category] - ({ survival: 0.75, playoff: 0.2, champion: 0.05 })[category]);
        moments[category].square += deviation ** 2;
      }
    }
    for (const historicalMatch of season.matches.filter((match) => match.round === round + 1)) {
      const match = competition.matches.find((item) => item.id === historicalMatch.id);
      const result = predictFixture(input, match);
      const actual = historicalMatch.homeGoals > historicalMatch.awayGoals ? 0 :
        historicalMatch.homeGoals === historicalMatch.awayGoals ? 1 : 2;
      matchBrier += [result.homeWin, result.draw, result.awayWin]
        .reduce((sum, probability, index) => sum + (probability - Number(index === actual)) ** 2, 0) / 3;
      for (const [index, probability] of [result.homeWin, result.draw, result.awayWin].entries()) {
        const deviation = probability - matchBaseRates[index];
        matchCross += deviation * (Number(index === actual) - matchBaseRates[index]) / 3;
        matchSquare += deviation ** 2 / 3;
      }
      matchCount++;
    }
  }
  const byCategory = Object.fromEntries(categories.map((category) =>
    [category, totals[category].brier / totals[category].count]));
  const relativeBrier = categories.reduce((sum, category) => sum + byCategory[category] / baselineBrier[category], 0) / 3;
  return { relativeBrier, byCategory, moments, matchBrier: matchBrier / matchCount,
    matchMoments: { cross: matchCross, square: matchSquare },
    snapshots: selection.length * rounds.length, teamForecasts: totals.survival.count, matchForecasts: matchCount };
}

function calibratedRelativeBrier(result, strength) {
  return categories.reduce((sum, category) => {
    const { cross, square } = result.moments[category];
    const brier = baselineBrier[category] +
      (strength ** 2 * square - 2 * strength * cross) / result.teamForecasts;
    return sum + brier / baselineBrier[category];
  }, 0) / categories.length;
}

const training = heldOut.filter((season) => Number(season.season.slice(0, 4)) < 2025);
const validation = heldOut.filter((season) => Number(season.season.slice(0, 4)) === 2025);
const trainingNextMatches = training.flatMap((season) => season.matches.filter((match) => rounds.includes(match.round - 1)));
const resultIndex = (match) => match.homeGoals > match.awayGoals ? 0 : match.homeGoals === match.awayGoals ? 1 : 2;
const matchBaseRates = [0, 1, 2].map((index) => trainingNextMatches.filter((match) => resultIndex(match) === index).length / trainingNextMatches.length);
const constantMatchBrier = (selection) => {
  const matches = selection.flatMap((season) => season.matches.filter((match) => rounds.includes(match.round - 1)));
  return matches.reduce((sum, match) => sum + matchBaseRates.reduce((total, probability, index) =>
    total + (probability - Number(resultIndex(match) === index)) ** 2, 0) / 3, 0) / matches.length;
};
const trainResults = candidates.map((candidate) => ({
  priorMatches: candidate.priorMatches, training: evaluate(candidate, training),
}));
const selected = [...trainResults].sort((a, b) => a.training.relativeBrier - b.training.relativeBrier)[0];
const validationResults = [MODEL_PARAMETERS.priorMatches, selected.priorMatches]
  .filter((value, index, values) => values.indexOf(value) === index)
  .map((priorMatches) => ({ priorMatches, validation: evaluate({ ...MODEL_PARAMETERS, priorMatches }, validation) }));
const incumbent = validationResults.find((entry) => entry.priorMatches === MODEL_PARAMETERS.priorMatches);
const challenger = validationResults.find((entry) => entry.priorMatches === selected.priorMatches);
const productionPriorMatches = challenger && challenger.validation.relativeBrier < incumbent.validation.relativeBrier - 0.005
  ? challenger.priorMatches : MODEL_PARAMETERS.priorMatches;
const trainingIncumbent = trainResults.find((entry) => entry.priorMatches === MODEL_PARAMETERS.priorMatches);
const calibrationStrengths = [0.75, 1, 1.25].map((strength) => ({ strength,
  training: calibratedRelativeBrier(trainingIncumbent.training, strength),
  validation: calibratedRelativeBrier(incumbent.validation, strength) }));
const matchStrengths = [0, 0.25, 0.5, 0.75, 1].map((strength) => ({ strength,
  training: constantMatchBrier(training) +
    (strength ** 2 * trainingIncumbent.training.matchMoments.square - 2 * strength * trainingIncumbent.training.matchMoments.cross) / trainingIncumbent.training.matchForecasts,
  validation: constantMatchBrier(validation) +
    (strength ** 2 * incumbent.validation.matchMoments.square - 2 * strength * incumbent.validation.matchMoments.cross) / incumbent.validation.matchForecasts,
}));
console.log(JSON.stringify({
  method: "Predicción retrospectiva por jornada; temporadas 2022–25 para elegir parámetros y 2025–26 reservada para comprobarlos.",
  rounds, iterations, trainingSeasons: training.map((season) => `${season.season} G${season.group}`),
  validationSeasons: validation.map((season) => `${season.season} G${season.group}`),
  reference: { categories, brier: baselineBrier, matchBaseRates,
    trainingMatchBrier: constantMatchBrier(training), validationMatchBrier: constantMatchBrier(validation) },
  trainResults, selectedPriorMatches: selected.priorMatches, validationResults, productionPriorMatches,
  calibrationStrengths, matchStrengths,
}, null, 2));
