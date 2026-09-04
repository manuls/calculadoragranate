import { NextResponse } from "next/server"
import { createClient } from "redis"
import { scrapeMatchday } from "@/lib/bdfutbol-scraper"
import { initialFixtures } from "@/lib/data"
import type { MatchdayUpdate } from "@/lib/types"
import { OFFICIAL_RESULTS_REDIS_KEY } from "@/lib/constants"

const REDIS_KEY = OFFICIAL_RESULTS_REDIS_KEY

// Verificar autorización del cron job
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization")

  // Vercel Cron envía un header especial
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true
  }

  // También permitir el header de Vercel Cron
  const vercelCronHeader = request.headers.get("x-vercel-cron")
  if (vercelCronHeader) {
    return true
  }

  return false
}

async function getRedisClient() {
  const client = createClient({ url: process.env.REDIS_URL })
  client.on("error", (err) => console.error("Redis Client Error", err))
  await client.connect()
  return client
}

async function readData() {
  const client = await getRedisClient()
  try {
    const data = await client.get(REDIS_KEY)
    if (data) {
      return JSON.parse(data) as { matchdays: MatchdayUpdate[] }
    }
    return { matchdays: [] }
  } finally {
    await client.disconnect()
  }
}

async function writeData(data: { matchdays: MatchdayUpdate[] }) {
  const client = await getRedisClient()
  try {
    await client.set(REDIS_KEY, JSON.stringify(data))
    return true
  } finally {
    await client.disconnect()
  }
}

export async function GET(request: Request) {
  try {
    // Verificar autorización
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Obtener el parámetro de jornada (opcional)
    const { searchParams } = new URL(request.url)
    const matchdayParam = searchParams.get("matchday")

    // Si no se especifica, usar la última jornada cuya fecha oficial ya llegó.
    const matchday = matchdayParam ? parseInt(matchdayParam, 10) : getCurrentMatchday()

    console.log(`[CRON] Scraping matchday ${matchday}...`)

    // Hacer scraping de BDFutbol
    const scrapedData = await scrapeMatchday(matchday)

    if (scrapedData.matches.length === 0) {
      console.log(`[CRON] No matches found for matchday ${matchday}`)
      return NextResponse.json({
        success: true,
        message: `No matches found for matchday ${matchday}`,
        matchday,
      })
    }

    // Verificar que todos los equipos fueron mapeados
    const unmappedTeams = scrapedData.matches.filter(
      (m) => m.homeTeamId === null || m.awayTeamId === null
    )

    if (unmappedTeams.length > 0) {
      console.warn(
        `[CRON] Warning: Some teams could not be mapped:`,
        unmappedTeams.map((m) => `${m.homeTeam} vs ${m.awayTeam}`)
      )
    }

    // Encontrar los fixtures de esta jornada
    const matchdayFixtures = initialFixtures.filter((f) => f.matchday === matchday)

    // Convertir al formato de nuestra app, mapeando por equipos
    const matchResults = scrapedData.matches
      .filter((m) => m.homeTeamId !== null && m.awayTeamId !== null)
      .map((m) => {
        // Encontrar el fixture correspondiente
        const fixture = matchdayFixtures.find(
          (f) => f.homeTeamId === m.homeTeamId && f.awayTeamId === m.awayTeamId
        )

        if (!fixture) {
          console.warn(
            `[CRON] No fixture found for ${m.homeTeam} vs ${m.awayTeam}`
          )
          return null
        }

        return {
          id: fixture.id,
          result: {
            homeGoals: m.homeGoals,
            awayGoals: m.awayGoals,
            isOfficial: true,
          },
          locked: true,
        }
      })
      .filter((m) => m !== null)

    const matchdayUpdate: MatchdayUpdate = {
      matchday,
      matches: matchResults as MatchdayUpdate["matches"],
    }

    // Leer datos actuales de Redis
    const data = await readData()

    // Buscar si ya existe esta jornada
    const existingIndex = data.matchdays.findIndex(
      (m) => m.matchday === matchday
    )

    if (existingIndex >= 0) {
      // Actualizar jornada existente
      data.matchdays[existingIndex] = matchdayUpdate
      console.log(`[CRON] Updated existing matchday ${matchday}`)
    } else {
      // Agregar nueva jornada
      data.matchdays.push(matchdayUpdate)
      console.log(`[CRON] Added new matchday ${matchday}`)
    }

    // Guardar en Redis
    await writeData(data)

    const savedCount = matchdayUpdate.matches.length
    console.log(
      `[CRON] Successfully saved ${savedCount} matches for matchday ${matchday}`
    )

    return NextResponse.json({
      success: true,
      matchday,
      matchesProcessed: savedCount,
      unmappedTeams: unmappedTeams.length,
      scrapedAt: scrapedData.scrapedAt,
    })
  } catch (error) {
    console.error("[CRON] Error updating results:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * Calcula la jornada actual basándose en la fecha
 * Fechas oficiales del calendario RFEF 2026/27 (Grupo 1).
 */
function getCurrentMatchday(): number {
  const matchdayDates: Record<number, string> = {
    1: "2026-08-30",
    2: "2026-09-06",
    3: "2026-09-13",
    4: "2026-09-20",
    5: "2026-09-27",
    6: "2026-10-04",
    7: "2026-10-11",
    8: "2026-10-18",
    9: "2026-10-25",
    10: "2026-11-01",
    11: "2026-11-08",
    12: "2026-11-15",
    13: "2026-11-22",
    14: "2026-11-29",
    15: "2026-12-06",
    16: "2026-12-13",
    17: "2026-12-20",
    18: "2027-01-03",
    19: "2027-01-10",
    20: "2027-01-17",
    21: "2027-01-24",
    22: "2027-01-31",
    23: "2027-02-06",
    24: "2027-02-14",
    25: "2027-02-21",
    26: "2027-02-28",
    27: "2027-03-07",
    28: "2027-03-14",
    29: "2027-03-21",
    30: "2027-03-28",
    31: "2027-04-04",
    32: "2027-04-11",
    33: "2027-04-18",
    34: "2027-04-25",
    35: "2027-05-02",
    36: "2027-05-09",
    37: "2027-05-16",
    38: "2027-05-23",
  }

  const today = new Date()

  // Encontrar la jornada más reciente que ya se jugó
  let currentMatchday = 1
  for (const [matchday, dateStr] of Object.entries(matchdayDates)) {
    const matchdayDate = new Date(dateStr)
    if (today >= matchdayDate) {
      currentMatchday = parseInt(matchday, 10)
    }
  }

  return currentMatchday
}
