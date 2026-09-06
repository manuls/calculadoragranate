import { unstable_cache } from "next/cache";
import baseline from "./granate-baseline";
import type { Competition, CompetitionMatch, CompetitionTeam } from "./model-types";
import { latestSavedCompetition } from "./prediction-archive";
import { withStoredResults } from "./official-results";
import { fetchAsGranateFallback } from "./as-granate-fallback";

const sourceUrl = baseline.sourceUrl;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const plain = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const sourceId = (logo: string) => {
  const imageId = logo.match(/\/([^/]+)\.png$/)?.[1] ?? "";
  // Los identificadores de algunos escudos no coinciden con data-ideq de la tabla.
  return ({ "359b": "359", "6b": "72", "13l": "104" } as Record<string, string>)[imageId] ?? imageId;
};

export function granateBaseline(): Competition {
  return {
    season: baseline.season, capturedAt: baseline.capturedAt, sourceUrl, source: "BDFutbol · Calculadora Granate", availability: "saved",
    teams: baseline.initialTeams.map((team) => ({ ...team, sourceId: sourceId(team.logoUrl), position: team.initialPosition, pointsAdjustment: team.points - (3 * team.won + team.drawn) })),
    matches: [...baseline.playedMatches, ...baseline.initialFixtures].map((match) => ({ id: match.id, round: match.matchday, homeId: match.homeTeamId, awayId: match.awayTeamId, date: null, homeGoals: match.result?.homeGoals ?? null, awayGoals: match.result?.awayGoals ?? null })),
  };
}

export function parseGranateCompetition(tableHtml: string, resultsHtml: string): Competition {
  const knownTeams = new Map(baseline.initialTeams.map((team) => [sourceId(team.logoUrl), team]));
  const table = tableHtml.match(/<table\b[^>]*id="classific"[^>]*>([\s\S]*?)<\/table>/)?.[1];
  if (!table || !tableHtml.includes("2026-27")) throw new Error("Clasificación de temporada inesperada.");
  const sourceNameToId = new Map<string, number>();
  const teams: CompetitionTeam[] = [...table.matchAll(/<tr data-ideq="([^"]+)">([\s\S]*?)<\/tr>/g)].map((row) => {
    const cells = [...row[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => plain(cell[1]));
    const known = knownTeams.get(row[1]);
    if (!known || cells.length < 11) throw new Error("Equipo o estructura desconocidos.");
    sourceNameToId.set(normalize(cells[3]), known.id);
    const points = Number(cells[4].match(/^-?\d+/)?.[0]);
    const won = Number(cells[6]);
    const drawn = Number(cells[7]);
    return { id: known.id, sourceId: row[1], name: known.name, position: Number(cells[1]), points, played: Number(cells[5]), won, drawn, lost: Number(cells[8]), goalsFor: Number(cells[9]), goalsAgainst: Number(cells[10]), pointsAdjustment: points - 3 * won - drawn };
  });
  const sourceTeams = new Map([...resultsHtml.matchAll(/SE\[(\d+)\]="\d+\|([^"]+)";/g)].map((entry) => [Number(entry[1]), sourceNameToId.get(normalize(plain(entry[2])))]));
  const matches: CompetitionMatch[] = [...resultsHtml.matchAll(/SP\[(\d+)\]\.push\((\{[^;]+\})\);/g)].map((entry) => {
    const value = JSON.parse(entry[2]) as Record<string, string>;
    const homeId = sourceTeams.get(Number(value.a1));
    const awayId = sourceTeams.get(Number(value.a2));
    if (homeId === undefined || awayId === undefined) throw new Error("Partido sin equipo conocido.");
    const parts = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/.exec(value.d);
    return { id: Number(value.id), round: Number(entry[1]), homeId, awayId, date: parts ? `${parts[3]}-${parts[2]}-${parts[1]}` : null, homeGoals: Number(value.g1) >= 0 ? Number(value.g1) : null, awayGoals: Number(value.g2) >= 0 ? Number(value.g2) : null };
  });
  if (teams.length !== 20 || new Set(teams.map((team) => team.id)).size !== 20 || matches.length !== 380
    || new Set(matches.map((match) => match.id)).size !== 380
    || new Set(matches.map((match) => `${match.homeId}:${match.awayId}`)).size !== 380) throw new Error("Calendario incompleto o duplicado.");
  for (const team of teams) {
    const played = matches.filter((match) => (match.homeId === team.id || match.awayId === team.id) && match.homeGoals !== null && match.awayGoals !== null);
    const goalsFor = played.reduce((sum, match) => sum + (match.homeId === team.id ? match.homeGoals! : match.awayGoals!), 0);
    const goalsAgainst = played.reduce((sum, match) => sum + (match.homeId === team.id ? match.awayGoals! : match.homeGoals!), 0);
    const won = played.filter((match) => match.homeId === team.id ? match.homeGoals! > match.awayGoals! : match.awayGoals! > match.homeGoals!).length;
    const drawn = played.filter((match) => match.homeGoals === match.awayGoals).length;
    if (played.length !== team.played || goalsFor !== team.goalsFor || goalsAgainst !== team.goalsAgainst || won !== team.won || drawn !== team.drawn || played.length - won - drawn !== team.lost || !Number.isFinite(team.points)) throw new Error("La clasificación y los resultados no corresponden a la misma actualización.");
  }
  return { season: baseline.season, capturedAt: new Date().toISOString(), sourceUrl, source: "BDFutbol · Calculadora Granate", availability: "source", teams: teams.sort((a, b) => a.position - b.position), matches };
}

async function fetchSource(url: string) {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000), headers: { "User-Agent": "Mozilla/5.0 (compatible; CalculadoraGranate/1.0)" } });
  if (!response.ok) throw new Error("BDFutbol no disponible.");
  return response.text();
}

const getSourceCompetition = unstable_cache(async (): Promise<Competition> => {
  try {
    const [table, results] = await Promise.all([fetchSource(sourceUrl), fetchSource(`${sourceUrl}?tab=results`)]);
    return parseGranateCompetition(table, results);
  } catch (error) {
    console.warn("No se ha actualizado BDFutbol:", error instanceof Error ? error.message : "fallo de consulta");
    const saved = await latestSavedCompetition(baseline.season) ?? granateBaseline();
    try { return await fetchAsGranateFallback(saved); }
    catch (fallbackError) { console.warn("No se ha actualizado AS:", fallbackError instanceof Error ? fallbackError.message : "fallo de consulta"); return saved; }
  }
}, ["forecast-granate-complete-season-v4"], { revalidate: 3600, tags: ["forecast-source"] });

export const getGranateCompetition = unstable_cache(async () => withStoredResults(await getSourceCompetition()), ["calculadora-shared-competition-v1"], { revalidate: 3600, tags: ["forecast-source"] });
