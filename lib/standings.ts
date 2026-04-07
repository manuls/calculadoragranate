import type { Match, Team } from "./types"

type MiniTableStats = {
  points: number
  goalDifference: number
  goalsFor: number
}

function getGoalDifference(team: Team) {
  return team.goalsFor - team.goalsAgainst
}

function compareOverall(a: Team, b: Team) {
  return (
    getGoalDifference(b) - getGoalDifference(a) ||
    b.goalsFor - a.goalsFor ||
    (a.initialPosition ?? Number.MAX_SAFE_INTEGER) - (b.initialPosition ?? Number.MAX_SAFE_INTEGER) ||
    a.name.localeCompare(b.name)
  )
}

function getMiniTableStats(teams: Team[], seasonMatches: Match[]) {
  const teamIds = new Set(teams.map((team) => team.id))
  const scheduledMatches = seasonMatches.filter(
    (match) => teamIds.has(match.homeTeamId) && teamIds.has(match.awayTeamId),
  )
  const completedMatches = scheduledMatches.filter((match) => match.result)

  const allMutualMatchesCompleted = scheduledMatches.length > 0 && completedMatches.length === scheduledMatches.length
  const stats = new Map<number, MiniTableStats>(
    teams.map((team) => [
      team.id,
      {
        points: 0,
        goalDifference: 0,
        goalsFor: 0,
      },
    ]),
  )

  completedMatches.forEach((match) => {
    if (!match.result) return

    const homeStats = stats.get(match.homeTeamId)
    const awayStats = stats.get(match.awayTeamId)
    if (!homeStats || !awayStats) return

    homeStats.goalsFor += match.result.homeGoals
    awayStats.goalsFor += match.result.awayGoals
    homeStats.goalDifference += match.result.homeGoals - match.result.awayGoals
    awayStats.goalDifference += match.result.awayGoals - match.result.homeGoals

    if (match.result.homeGoals > match.result.awayGoals) {
      homeStats.points += 3
    } else if (match.result.homeGoals < match.result.awayGoals) {
      awayStats.points += 3
    } else {
      homeStats.points += 1
      awayStats.points += 1
    }
  })

  return {
    allMutualMatchesCompleted,
    stats,
  }
}

function sortTieGroup(teams: Team[], seasonMatches: Match[]) {
  if (teams.length <= 1) return teams

  const { allMutualMatchesCompleted, stats } = getMiniTableStats(teams, seasonMatches)
  if (!allMutualMatchesCompleted) {
    return [...teams].sort(compareOverall)
  }

  return [...teams].sort((a, b) => {
    const aStats = stats.get(a.id)
    const bStats = stats.get(b.id)

    return (
      (bStats?.points ?? 0) - (aStats?.points ?? 0) ||
      (bStats?.goalDifference ?? 0) - (aStats?.goalDifference ?? 0) ||
      (bStats?.goalsFor ?? 0) - (aStats?.goalsFor ?? 0) ||
      compareOverall(a, b)
    )
  })
}

export function sortTeamsByRules(teams: Team[], seasonMatches: Match[]) {
  const byPoints = new Map<number, Team[]>()

  teams.forEach((team) => {
    const teamsOnSamePoints = byPoints.get(team.points) ?? []
    teamsOnSamePoints.push(team)
    byPoints.set(team.points, teamsOnSamePoints)
  })

  return [...byPoints.entries()]
    .sort((a, b) => b[0] - a[0])
    .flatMap(([, tiedTeams]) => sortTieGroup(tiedTeams, seasonMatches))
}

export function calculateStandings(baseTeams: Team[], pendingFixtures: Match[], playedMatches: Match[] = []) {
  const calculatedTeams = structuredClone(baseTeams)

  pendingFixtures.forEach((match) => {
    if (!match.result) return

    const homeTeam = calculatedTeams.find((team) => team.id === match.homeTeamId)
    const awayTeam = calculatedTeams.find((team) => team.id === match.awayTeamId)

    if (!homeTeam || !awayTeam) return

    homeTeam.played += 1
    awayTeam.played += 1

    homeTeam.goalsFor += match.result.homeGoals
    homeTeam.goalsAgainst += match.result.awayGoals
    awayTeam.goalsFor += match.result.awayGoals
    awayTeam.goalsAgainst += match.result.homeGoals

    if (match.result.homeGoals > match.result.awayGoals) {
      homeTeam.won += 1
      homeTeam.points += 3
      awayTeam.lost += 1
      return
    }

    if (match.result.homeGoals < match.result.awayGoals) {
      awayTeam.won += 1
      awayTeam.points += 3
      homeTeam.lost += 1
      return
    }

    homeTeam.drawn += 1
    awayTeam.drawn += 1
    homeTeam.points += 1
    awayTeam.points += 1
  })

  return sortTeamsByRules(calculatedTeams, [...playedMatches, ...pendingFixtures])
}
