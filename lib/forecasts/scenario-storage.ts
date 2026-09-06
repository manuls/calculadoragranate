import type { Competition, FixedScore } from "./model-types";
const KEY = "calculadora-granate-scenario-v1";
export function saveScenario(competition: Competition, scores: FixedScore[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ season: competition.season, scores: scores.map((score) => {
      const match = competition.matches.find((m) => m.id === score.matchId)!;
      return { ...score, round: match.round, homeId: match.homeId, awayId: match.awayId };
    }) }));
    return true;
  } catch { return false; }
}
export function loadScenario(competition: Competition): FixedScore[] {
  try {
    const data = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    if (data?.season !== competition.season || !Array.isArray(data.scores) || data.scores.length > 380) return [];
    const scores: FixedScore[] = [];
    for (const score of data.scores) {
      const match = competition.matches.find((m) => m.round === score.round && m.homeId === score.homeId && m.awayId === score.awayId && m.homeGoals === null);
      if (!match || scores.some((s) => s.matchId === match.id) || ![score.homeGoals, score.awayGoals].every((v) => Number.isInteger(v) && v >= 0 && v <= 15)) continue;
      scores.push({ matchId: match.id, homeGoals: score.homeGoals, awayGoals: score.awayGoals });
    }
    return scores;
  } catch { return []; }
}
