import type { Match } from "./types"

export type FormResult = {
  match: Match & { result: NonNullable<Match["result"]> }
  outcome: "V" | "E" | "D"
}

export function getTeamForm(matches: Match[]): Map<number, FormResult[]> {
  const form = new Map<number, FormResult[]>()
  const officialMatches = [...new Map(matches.map((match) => [match.id, match])).values()]
    .filter((match): match is FormResult["match"] => Boolean(match.result && (match.locked || match.result.isOfficial)))
    .sort((a, b) => b.matchday - a.matchday || (b.date ?? "").localeCompare(a.date ?? "") || b.id - a.id)

  for (const match of officialMatches) {
    for (const teamId of [match.homeTeamId, match.awayTeamId]) {
      const recent = form.get(teamId) ?? []
      if (recent.length === 5) continue
      const difference = (match.result.homeGoals - match.result.awayGoals) * (teamId === match.homeTeamId ? 1 : -1)
      recent.push({ match, outcome: difference > 0 ? "V" : difference < 0 ? "D" : "E" })
      form.set(teamId, recent)
    }
  }

  return form
}
