export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface MatchdayUpdate {
  matchday: number
  matches: Array<{
    id: number
    result: {
      homeGoals: number
      awayGoals: number
      isOfficial: boolean
    }
    locked: boolean
  }>
}

export interface Team {
  id: number
  name: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  logoUrl?: string
}

export interface Match {
  id: number
  matchday: number
  homeTeamId: number
  awayTeamId: number
  result: {
    homeGoals: number
    awayGoals: number
    isOfficial?: boolean
  } | null
  locked?: boolean
}

export interface ScenarioConfig {
  type: "promotion" | "relegation" | "points" | "position"
  teamId: number
  targetPoints?: number
  targetPosition?: number
}

export interface ScenarioResult {
  possible: boolean
  message: string
  pointsNeeded?: number
  currentGap?: number
  requiredResults: Array<{
    matchId: number
    homeTeamId: number
    awayTeamId: number
    requiredResult: {
      homeGoals: number
      awayGoals: number
    }
  }>
}

