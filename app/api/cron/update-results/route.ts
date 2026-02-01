import { NextResponse } from "next/server"
import { createClient } from "redis"
import { scrapeMatchday } from "@/lib/bdfutbol-scraper"
import { initialFixtures } from "@/lib/data"
import type { MatchdayUpdate } from "@/lib/types"

const REDIS_KEY = "official_results_data"

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

    // Si no se especifica, calcular la jornada actual
    // Por ahora usamos un valor fijo, pero se puede mejorar
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
 * Ajustar según el calendario real de la temporada
 */
function getCurrentMatchday(): number {
  // Fechas aproximadas de cada jornada (actualizar según calendario oficial)
  const matchdayDates: Record<number, string> = {
    21: "2026-01-25",
    22: "2026-02-01",
    23: "2026-02-08",
    24: "2026-02-15",
    25: "2026-02-22",
    26: "2026-03-01",
    27: "2026-03-08",
    28: "2026-03-15",
    29: "2026-03-22",
    30: "2026-03-29",
    31: "2026-04-05",
    32: "2026-04-12",
    33: "2026-04-19",
    34: "2026-04-26",
    35: "2026-05-03",
    36: "2026-05-10",
    37: "2026-05-17",
    38: "2026-05-24",
  }

  const today = new Date()

  // Encontrar la jornada más reciente que ya se jugó
  let currentMatchday = 21 // Default
  for (const [matchday, dateStr] of Object.entries(matchdayDates)) {
    const matchdayDate = new Date(dateStr)
    if (today >= matchdayDate) {
      currentMatchday = parseInt(matchday, 10)
    }
  }

  return currentMatchday
}
