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
  initialPosition?: number // Nueva propiedad opcional para la posición inicial
}

export interface Match {
  id: number
  matchday: number
  homeTeamId: number
  awayTeamId: number
  result: {
    homeGoals: number
    isOfficial?: boolean
    awayGoals: number
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

export interface HistoricalMatch {
  id: number
  date: string
  homeTeamId: number
  awayTeamId: number
  homeGoals: number
  awayGoals: number
  season: string
  matchday?: number // Añadir jornada opcional
}

export interface TeamStats {
  id: number
  homeAttackStrength: number
  homeDefenseStrength: number
  awayAttackStrength: number
  awayDefenseStrength: number
  form: number[]
  homeForm: number[]
  awayForm: number[]
}

export interface MatchPrediction {
  matchId: number
  homeTeamId: number
  awayTeamId: number
  homeWinProbability: number
  drawProbability: number
  awayWinProbability: number
  predictedHomeGoals: number
  predictedAwayGoals: number
  confidence: number
}
