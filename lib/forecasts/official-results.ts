import { createClient } from "redis";
import { OFFICIAL_RESULTS_REDIS_KEY } from "@/lib/constants";
import { calculateStandings } from "@/lib/standings";
import type { MatchdayUpdate } from "@/lib/types";
import type { Competition } from "./model-types";

// Resultados introducidos en la calculadora: completan marcadores aún ausentes en la fuente.
export async function withStoredResults(competition: Competition): Promise<Competition> {
  if (!process.env.REDIS_URL) return competition;
  const client = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 2500, reconnectStrategy: false } });
  client.on("error", () => {});
  try {
    await client.connect();
    const stored = await Promise.race([client.get(OFFICIAL_RESULTS_REDIS_KEY), new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Tiempo de lectura agotado")), 2500))]);
    if (!stored) return competition;
    const data = JSON.parse(stored) as { matchdays: MatchdayUpdate[] };
    const matches = competition.matches.map((match) => ({ ...match }));
    let changed = false;
    for (const day of data.matchdays ?? []) for (const result of day.matches ?? []) {
      if (!result.locked || !result.result || ![result.result.homeGoals, result.result.awayGoals].every((v) => Number.isInteger(v) && v >= 0 && v <= 15)) continue;
      const match = matches.find((m) => m.id === result.id && m.round === day.matchday && m.homeGoals === null);
      if (!match) continue;
      match.homeGoals = result.result.homeGoals;
      match.awayGoals = result.result.awayGoals;
      changed = true;
    }
    if (!changed) return competition;
    const zeroTeams = competition.teams.map((team) => ({ ...team, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: team.pointsAdjustment, initialPosition: team.position }));
    const table = calculateStandings(zeroTeams, matches.map((m) => ({ id: m.id, matchday: m.round, homeTeamId: m.homeId, awayTeamId: m.awayId, result: m.homeGoals === null ? null : { homeGoals: m.homeGoals, awayGoals: m.awayGoals! } })));
    return { ...competition, matches, teams: table.map((team, index) => ({ ...competition.teams.find((t) => t.id === team.id)!, ...team, position: index + 1 })), source: `${competition.source} + resultados guardados` };
  } catch { return competition; }
  finally { if (client.isOpen) client.destroy(); }
}

export function officialMatchdays(competition: Competition): MatchdayUpdate[] {
  const days = new Map<number, MatchdayUpdate>();
  for (const match of competition.matches) {
    if (match.homeGoals === null || match.awayGoals === null) continue;
    const day = days.get(match.round) ?? { matchday: match.round, matches: [] };
    day.matches.push({ id: match.id, result: { homeGoals: match.homeGoals, awayGoals: match.awayGoals, isOfficial: true }, locked: true });
    days.set(match.round, day);
  }
  return [...days.values()].sort((a, b) => a.matchday - b.matchday);
}
