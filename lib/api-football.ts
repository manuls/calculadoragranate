// Cliente para API-Football v3
// Documentación: https://www.api-football.com/documentation-v3

const API_BASE_URL = "https://v3.football.api-sports.io"
const LEAGUE_ID = 435 // Primera RFEF Grupo 1

interface ApiFootballFixture {
  fixture: {
    id: number
    date: string
    status: {
      short: string
      long: string
    }
  }
  league: {
    id: number
    round: string
  }
  teams: {
    home: {
      id: number
      name: string
    }
    away: {
      id: number
      name: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
}

interface ApiFootballResponse {
  response: ApiFootballFixture[]
  errors: Record<string, string>
}

// Mapeo de nombres de equipos de API-Football a nuestros IDs locales
// Los nombres pueden variar ligeramente, así que usamos coincidencia parcial
const TEAM_NAME_MAPPING: Record<string, number> = {
  // Nombre en API-Football (o parte del nombre) -> Nuestro ID
  "Tenerife": 1,
  "Celta B": 2,
  "Celta Fortuna": 2,
  "Celta Vigo B": 2,
  "Pontevedra": 3,
  "Bilbao Athletic": 4,
  "Athletic Club B": 4,
  "Athletic Bilbao B": 4,
  "Racing Ferrol": 5,
  "Racing de Ferrol": 5,
  "Real Madrid Castilla": 6,
  "Real Madrid B": 6,
  "Castilla": 6,
  "Lugo": 7,
  "Zamora": 8,
  "Aviles": 9,
  "Avilés": 9,
  "Real Aviles": 9,
  "Barakaldo": 10,
  "Merida": 11,
  "Mérida": 11,
  "Unionistas": 12,
  "Unionistas de Salamanca": 12,
  "Arenas": 13,
  "Arenas Club": 13,
  "Ponferradina": 14,
  "Ourense": 15,
  "Talavera": 16,
  "Talavera de la Reina": 16,
  "Cacereno": 17,
  "Cacereño": 17,
  "Arenteiro": 18,
  "Osasuna B": 19,
  "Osasuna Promesas": 19,
  "CA Osasuna B": 19,
  "Guadalajara": 20,
}

// Función para encontrar el ID local de un equipo por su nombre
function findLocalTeamId(apiTeamName: string): number | null {
  // Primero intentar coincidencia exacta
  if (TEAM_NAME_MAPPING[apiTeamName]) {
    return TEAM_NAME_MAPPING[apiTeamName]
  }

  // Luego intentar coincidencia parcial
  const normalizedName = apiTeamName.toLowerCase()
  for (const [key, id] of Object.entries(TEAM_NAME_MAPPING)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return id
    }
  }

  console.warn(`No se encontró mapeo para el equipo: ${apiTeamName}`)
  return null
}

// Extraer número de jornada del string "Regular Season - X"
function extractRoundNumber(roundString: string): number | null {
  const match = roundString.match(/Regular Season - (\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

// Obtener partidos de una jornada específica
export async function getFixturesByRound(
  round: number,
  season: number = 2025
): Promise<{
  success: boolean
  data?: Array<{
    homeTeamId: number
    awayTeamId: number
    homeGoals: number
    awayGoals: number
    isFinished: boolean
  }>
  error?: string
}> {
  const apiKey = process.env.API_FOOTBALL_KEY

  if (!apiKey) {
    return { success: false, error: "API_FOOTBALL_KEY no configurada" }
  }

  try {
    const url = `${API_BASE_URL}/fixtures?league=${LEAGUE_ID}&season=${season}&round=Regular Season - ${round}`

    console.log(`Fetching fixtures from API-Football: ${url}`)

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    })

    if (!response.ok) {
      return { success: false, error: `Error HTTP: ${response.status}` }
    }

    const data: ApiFootballResponse = await response.json()

    if (data.errors && Object.keys(data.errors).length > 0) {
      return { success: false, error: JSON.stringify(data.errors) }
    }

    const fixtures = data.response
      .filter((fixture) => {
        // Solo partidos terminados (FT = Full Time)
        return fixture.fixture.status.short === "FT"
      })
      .map((fixture) => {
        const homeTeamId = findLocalTeamId(fixture.teams.home.name)
        const awayTeamId = findLocalTeamId(fixture.teams.away.name)

        return {
          homeTeamId,
          awayTeamId,
          homeGoals: fixture.goals.home ?? 0,
          awayGoals: fixture.goals.away ?? 0,
          isFinished: true,
          apiHomeTeam: fixture.teams.home.name,
          apiAwayTeam: fixture.teams.away.name,
        }
      })
      .filter((f) => f.homeTeamId !== null && f.awayTeamId !== null) as Array<{
      homeTeamId: number
      awayTeamId: number
      homeGoals: number
      awayGoals: number
      isFinished: boolean
    }>

    console.log(`Encontrados ${fixtures.length} partidos terminados para la jornada ${round}`)

    return { success: true, data: fixtures }
  } catch (error) {
    console.error("Error fetching from API-Football:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Obtener la jornada actual basándose en los partidos más recientes
export async function getCurrentRound(season: number = 2025): Promise<number | null> {
  const apiKey = process.env.API_FOOTBALL_KEY

  if (!apiKey) {
    return null
  }

  try {
    // Obtener los partidos más recientes
    const url = `${API_BASE_URL}/fixtures?league=${LEAGUE_ID}&season=${season}&last=10`

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    })

    if (!response.ok) {
      return null
    }

    const data: ApiFootballResponse = await response.json()

    if (data.response.length === 0) {
      return null
    }

    // Encontrar la jornada más alta entre los partidos recientes
    let maxRound = 0
    for (const fixture of data.response) {
      const round = extractRoundNumber(fixture.league.round)
      if (round && round > maxRound) {
        maxRound = round
      }
    }

    return maxRound > 0 ? maxRound : null
  } catch (error) {
    console.error("Error getting current round:", error)
    return null
  }
}
