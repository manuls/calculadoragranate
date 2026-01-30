import type { Team, Match, TeamStats } from "./types"
// Añadir importación para la nueva API
import { fetchHistoricalMatches } from "./api-historical"

// Modificar la interfaz MatchPrediction para incluir los factores explicativos
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
  // Añadir factores explicativos
  factors: {
    homeAdvantage: number
    homeFormFactor: number
    awayFormFactor: number
    homeAttackStrength: number
    homeDefenseStrength: number
    awayAttackStrength: number
    awayDefenseStrength: number
    headToHead?: string
    standingsFactor: number
  }
}

// Actualizar la interfaz historicalMatch para incluir matchday
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

// Modificar la variable historicalData para que sea mutable
let historicalData: HistoricalMatch[] = [
  // Datos de ejemplo (ahora podrán actualizarse dinámicamente)
  {
    id: 1,
    date: "2023-08-20",
    homeTeamId: 1,
    awayTeamId: 2,
    homeGoals: 2,
    awayGoals: 1,
    season: "2023-2024",
    matchday: 1,
  },
  {
    id: 2,
    date: "2023-08-27",
    homeTeamId: 3,
    awayTeamId: 1,
    homeGoals: 0,
    awayGoals: 2,
    season: "2023-2024",
    matchday: 2,
  },
  // ... Otros datos históricos
]

// Añadir función para actualizar los datos históricos
export function updateHistoricalData(newData: HistoricalMatch[]) {
  if (!newData || !Array.isArray(newData)) return false

  try {
    // Podemos reemplazar todos los datos o fusionarlos con los existentes
    // Aquí elegimos reemplazarlos para evitar duplicados
    historicalData = newData

    // Guardar en localStorage para persistencia
    if (typeof window !== "undefined") {
      localStorage.setItem("historical_match_data", JSON.stringify(historicalData))
    }

    return true
  } catch (error) {
    console.error("Error al actualizar datos históricos:", error)
    return false
  }
}

// Modificar la función loadHistoricalData para usar la nueva API
export function loadHistoricalData() {
  return new Promise<boolean>((resolve) => {
    fetchHistoricalMatches()
      .then((response) => {
        if (response.success && response.data && response.data.matches) {
          historicalData = response.data.matches
          resolve(true)
        } else {
          // Si no hay datos en la API, intentar cargar desde localStorage
          if (typeof window !== "undefined") {
            try {
              const savedData = localStorage.getItem("historical_match_data")
              if (savedData) {
                historicalData = JSON.parse(savedData)
                resolve(true)
                return
              }
            } catch (error) {
              console.error("Error al cargar datos históricos desde localStorage:", error)
            }
          }
          resolve(false)
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos históricos:", error)
        resolve(false)
      })
  })
}

// Añadir función para convertir resultados oficiales en datos históricos
export function convertOfficialToHistorical(fixtures: Match[], includeAll = false): HistoricalMatch[] {
  const today = new Date()
  const currentSeason = `${today.getFullYear()}-${today.getFullYear() + 1}`

  return fixtures
    .filter((match) => match.result && (includeAll || match.locked || match.result.isOfficial))
    .map((match, index) => ({
      id: 1000 + index, // IDs únicos para evitar conflictos
      date: today.toISOString().split("T")[0], // Fecha actual como aproximación
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeGoals: match.result!.homeGoals,
      awayGoals: match.result!.awayGoals,
      season: currentSeason,
      matchday: match.matchday,
    }))
}

// Añadir la nueva constante para el peso del factor de clasificación
const LEAGUE_AVG_HOME_GOALS = 1.5 // Promedio de goles en casa en la liga
const LEAGUE_AVG_AWAY_GOALS = 1.0 // Promedio de goles fuera en la liga
const FORM_WEIGHT = 0.2 // Peso de la forma reciente
const HOME_ADVANTAGE = 0.2 // Ventaja de jugar en casa (reducido de 0.3 a 0.2)
const STANDINGS_FACTOR_WEIGHT = 0.02 // Peso por cada punto de diferencia en la clasificación

// Modificar la función calculateTeamStats para utilizar también los datos históricos
function calculateTeamStats(teams: Team[], fixtures: Match[]): Map<number, TeamStats> {
  const teamStats = new Map<number, TeamStats>()

  // Cargar datos históricos guardados si existen
  loadHistoricalData()

  for (const team of teams) {
    // Obtener los últimos partidos oficiales del equipo de los fixtures actuales
    const officialMatches = fixtures
      .filter(
        (match) =>
          (match.homeTeamId === team.id || match.awayTeamId === team.id) &&
          match.result &&
          (match.locked || match.result.isOfficial),
      )
      .sort((a, b) => b.matchday - a.matchday)

    // Convertir partidos oficiales a formato histórico
    const officialHistorical = officialMatches.map((match, index) => ({
      id: 2000 + index,
      date: new Date().toISOString().split("T")[0], // Fecha actual como aproximación
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeGoals: match.result!.homeGoals,
      awayGoals: match.result!.awayGoals,
      season: "2023-2024", // Temporada actual
      matchday: match.matchday,
    }))

    // Combinar con datos históricos y ordenar por fecha (o matchday si existen)
    const combinedMatches = [...historicalData, ...officialHistorical]
      .filter((match) => match.homeTeamId === team.id || match.awayTeamId === team.id)
      .sort((a, b) => {
        // Si ambos tienen matchday, ordenar por jornada
        if (a.matchday && b.matchday) return b.matchday - a.matchday
        // Si no, ordenar por fecha
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      .slice(0, 10) // Tomar los 10 partidos más recientes para mejor análisis

    // Calcular el factor forma basado en los resultados recientes
    const form = combinedMatches
      .map((match) => {
        const isHome = match.homeTeamId === team.id
        const teamGoals = isHome ? match.homeGoals : match.awayGoals
        const opponentGoals = isHome ? match.awayGoals : match.homeGoals

        if (teamGoals > opponentGoals) return 1 // Victoria
        if (teamGoals === opponentGoals) return 0 // Empate
        return -1 // Derrota
      })
      .slice(0, 5) // Tomar solo los 5 más recientes para la forma

    // Si no hay suficientes partidos, rellenar con valores neutros
    while (form.length < 5) {
      form.push(0)
    }

    // Calcular estadísticas de ataque y defensa basadas en los datos históricos
    let homeGoalsScored = 0
    let homeGoalsConceded = 0
    let awayGoalsScored = 0
    let awayGoalsConceded = 0
    let homeMatches = 0
    let awayMatches = 0

    // Analizar partidos para calcular estadísticas de ataque/defensa
    combinedMatches.forEach((match) => {
      if (match.homeTeamId === team.id) {
        homeGoalsScored += match.homeGoals
        homeGoalsConceded += match.awayGoals
        homeMatches++
      } else {
        awayGoalsScored += match.awayGoals
        awayGoalsConceded += match.homeGoals
        awayMatches++
      }
    })

    // Calcular promedios (con valores por defecto si no hay suficientes datos)
    const avgHomeGoalsScored = homeMatches > 0 ? homeGoalsScored / homeMatches : 1.0
    const avgHomeGoalsConceded = homeMatches > 0 ? homeGoalsConceded / homeMatches : 1.0
    const avgAwayGoalsScored = awayMatches > 0 ? awayGoalsScored / awayMatches : 0.7
    const avgAwayGoalsConceded = awayMatches > 0 ? awayGoalsConceded / awayMatches : 1.3

    // Calcular fuerzas relativas comparadas con la media de la liga
    const homeAttackStrength = avgHomeGoalsScored / LEAGUE_AVG_HOME_GOALS
    const homeDefenseStrength = LEAGUE_AVG_AWAY_GOALS / (avgHomeGoalsConceded || 0.5)
    const awayAttackStrength = avgAwayGoalsScored / LEAGUE_AVG_AWAY_GOALS
    const awayDefenseStrength = LEAGUE_AVG_HOME_GOALS / (avgAwayGoalsConceded || 0.5)

    // Separar forma en casa y fuera
    const homeForm = form
      .filter((_, i) => i < combinedMatches.length && combinedMatches[i].homeTeamId === team.id)
      .slice(0, 3)

    const awayForm = form
      .filter((_, i) => i < combinedMatches.length && combinedMatches[i].awayTeamId === team.id)
      .slice(0, 3)

    teamStats.set(team.id, {
      id: team.id,
      homeAttackStrength,
      homeDefenseStrength,
      awayAttackStrength,
      awayDefenseStrength,
      form,
      homeForm,
      awayForm,
    })
  }

  return teamStats
}

// Función auxiliar para obtener un resumen de enfrentamientos directos
function getHeadToHeadSummary(teamAId: number, teamBId: number, historicalData: HistoricalMatch[]): string {
  const matches = historicalData.filter(
    (match) =>
      (match.homeTeamId === teamAId && match.awayTeamId === teamBId) ||
      (match.homeTeamId === teamBId && match.awayTeamId === teamAId),
  )

  const teamAWins = matches.filter(
    (match) =>
      (match.homeTeamId === teamAId && match.homeGoals > match.awayGoals) ||
      (match.homeTeamId === teamBId && match.awayGoals > match.homeGoals),
  ).length

  const teamBWins = matches.length - teamAWins

  return `Team A Wins: ${teamAWins}, Team B Wins: ${teamBWins}, Matches Played: ${matches.length}`
}

// Modificar la función predictMatch para dar más peso al factor de clasificación
export function predictMatch(match: Match, teamStats: Map<number, TeamStats>, currentTeams: Team[]): MatchPrediction {
  const homeTeam = currentTeams.find((team) => team.id === match.homeTeamId)
  const awayTeam = currentTeams.find((team) => team.id === match.awayTeamId)

  if (!homeTeam || !awayTeam) {
    return {
      matchId: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeWinProbability: 0.33,
      drawProbability: 0.34,
      awayWinProbability: 0.33,
      predictedHomeGoals: 1,
      predictedAwayGoals: 1,
      confidence: 0.1,
      factors: {
        homeAdvantage: HOME_ADVANTAGE,
        homeFormFactor: 0,
        awayFormFactor: 0,
        homeAttackStrength: 1,
        homeDefenseStrength: 1,
        awayAttackStrength: 1,
        awayDefenseStrength: 1,
        standingsFactor: 0,
      },
    }
  }

  const homeStats = teamStats.get(homeTeam.id)
  const awayStats = teamStats.get(awayTeam.id)

  if (!homeStats || !awayStats) {
    return {
      matchId: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeWinProbability: 0.33,
      drawProbability: 0.34,
      awayWinProbability: 0.33,
      predictedHomeGoals: 1,
      predictedAwayGoals: 1,
      confidence: 0.1,
      factors: {
        homeAdvantage: HOME_ADVANTAGE,
        homeFormFactor: 0,
        awayFormFactor: 0,
        homeAttackStrength: 1,
        homeDefenseStrength: 1,
        awayAttackStrength: 1,
        awayDefenseStrength: 1,
        standingsFactor: 0,
      },
    }
  }

  // Calcular factores de forma
  const homeFormFactor = homeStats.form.reduce((sum, result) => sum + result, 0) / homeStats.form.length || 0
  const awayFormFactor = awayStats.form.reduce((sum, result) => sum + result, 0) / awayStats.form.length || 0

  // Calcular y aplicar el factor de clasificación con mayor peso
  // Aumentamos el peso para que tenga más influencia
  const pointsDifference = homeTeam.points - awayTeam.points
  // Aumentar el peso del factor de clasificación para que tenga más impacto
  const standingsFactor = pointsDifference * STANDINGS_FACTOR_WEIGHT * 2

  // Calcular predicción de goles teniendo en cuenta todos los factores
  let predictedHomeGoals = LEAGUE_AVG_HOME_GOALS * homeStats.homeAttackStrength * awayStats.awayDefenseStrength
  let predictedAwayGoals = LEAGUE_AVG_AWAY_GOALS * awayStats.awayAttackStrength * homeStats.homeDefenseStrength

  // Ajustar por forma reciente
  predictedHomeGoals += homeFormFactor * FORM_WEIGHT
  predictedAwayGoals += awayFormFactor * FORM_WEIGHT

  // Ajustar por ventaja de jugar en casa
  predictedHomeGoals += HOME_ADVANTAGE

  // Aplicar el factor de clasificación a los goles predichos con mayor impacto
  if (standingsFactor > 0) {
    // Si el equipo local está mejor clasificado
    predictedHomeGoals += standingsFactor * 1.5
    predictedAwayGoals = Math.max(0.1, predictedAwayGoals - standingsFactor * 0.5)
  } else if (standingsFactor < 0) {
    // Si el equipo visitante está mejor clasificado
    predictedAwayGoals += Math.abs(standingsFactor) * 1.5
    predictedHomeGoals = Math.max(0.1, predictedHomeGoals - Math.abs(standingsFactor) * 0.5)
  }

  // Asegurarse de que los goles predichos no sean negativos
  predictedHomeGoals = Math.max(0.1, predictedHomeGoals)
  predictedAwayGoals = Math.max(0.1, predictedAwayGoals)

  // Calcular probabilidades usando distribución de Poisson
  let homeWinProbability = poissonProbability(predictedHomeGoals, predictedAwayGoals)
  let drawProbability = poissonDraw(predictedHomeGoals, predictedAwayGoals)
  let awayWinProbability = poissonProbability(predictedAwayGoals, predictedHomeGoals)

  // Normalizar las probabilidades para que sumen 1
  const totalProbability = homeWinProbability + drawProbability + awayWinProbability
  homeWinProbability = homeWinProbability / totalProbability
  drawProbability = drawProbability / totalProbability
  awayWinProbability = awayWinProbability / totalProbability

  // Ajustar las probabilidades según la diferencia en la clasificación
  // Si hay una gran diferencia de puntos (más de 10), dar mucho más peso a este factor
  if (Math.abs(pointsDifference) > 10) {
    const standingsBoost = 0.2 // Aumentado a 20% boost
    if (pointsDifference > 0) {
      // Local mejor clasificado
      homeWinProbability = Math.min(0.95, homeWinProbability + standingsBoost)
      awayWinProbability = Math.max(0.05, awayWinProbability - standingsBoost)
      drawProbability = Math.max(0.05, 1 - homeWinProbability - awayWinProbability)
    } else {
      // Visitante mejor clasificado
      awayWinProbability = Math.min(0.95, awayWinProbability + standingsBoost)
      homeWinProbability = Math.max(0.05, homeWinProbability - standingsBoost)
      drawProbability = Math.max(0.05, 1 - homeWinProbability - awayWinProbability)
    }
  }

  // Calcular confianza basada en la cantidad de datos disponibles
  const dataPoints = historicalData.filter(
    (match) =>
      match.homeTeamId === homeTeam.id ||
      match.awayTeamId === homeTeam.id ||
      match.homeTeamId === awayTeam.id ||
      match.awayTeamId === awayTeam.id,
  ).length

  const confidence = Math.min(0.9, dataPoints / 20) // Máximo 0.9 de confianza

  return {
    matchId: match.id,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeWinProbability,
    drawProbability,
    awayWinProbability,
    predictedHomeGoals: Math.round(predictedHomeGoals * 10) / 10, // Redondear a 1 decimal
    predictedAwayGoals: Math.round(predictedAwayGoals * 10) / 10,
    confidence,
    // Añadir los factores que influyeron en la predicción
    factors: {
      homeAdvantage: HOME_ADVANTAGE,
      homeFormFactor: homeFormFactor,
      awayFormFactor: awayFormFactor,
      homeAttackStrength: homeStats.homeAttackStrength,
      homeDefenseStrength: homeStats.homeDefenseStrength,
      awayAttackStrength: awayStats.awayAttackStrength,
      awayDefenseStrength: awayStats.awayDefenseStrength,
      standingsFactor: standingsFactor, // Añadir el nuevo factor
      // Añadir información de enfrentamientos directos si está disponible
      headToHead: getHeadToHeadSummary(homeTeam.id, awayTeam.id, historicalData),
    },
  }
}

// Actualizar la función predictMatches para pasar los fixtures
export function predictMatches(matches: Match[], teams: Team[]): MatchPrediction[] {
  const teamStats = calculateTeamStats(teams, matches)
  return matches
    .filter((match) => !match.result) // Solo predecir partidos sin resultado
    .map((match) => predictMatch(match, teamStats, teams))
}

// Funciones auxiliares para cálculos de probabilidad
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

function poisson(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k)
}

// Fix the poissonProbability function to correctly calculate win probabilities
function poissonProbability(goalsTeamA: number, goalsTeamB: number): number {
  let probability = 0

  // Sumar probabilidades para todos los casos donde TeamA > TeamB
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j < i; j++) {
      probability += poisson(goalsTeamA, i) * poisson(goalsTeamB, j)
    }
  }

  return probability
}

function poissonDraw(goalsTeamA: number, goalsTeamB: number): number {
  let probability = 0

  // Sumar probabilidades para todos los casos donde TeamA = TeamB
  for (let i = 0; i <= 10; i++) {
    probability += poisson(goalsTeamA, i) * poisson(goalsTeamB, i)
  }

  return probability
}
