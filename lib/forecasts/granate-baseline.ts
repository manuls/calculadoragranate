import { initialTeams, initialFixtures, playedMatches } from "@/lib/data";
export default {
  season: "2026-27",
  capturedAt: "2026-09-04T16:39:48.760Z",
  sourceUrl: "https://www.bdfutbol.com/es/t/t2026-271rf1.html",
  initialTeams: initialTeams.map((team) => ({ ...team, logoUrl: team.logoUrl ?? "", initialPosition: team.initialPosition ?? 20 })),
  initialFixtures,
  playedMatches,
};
