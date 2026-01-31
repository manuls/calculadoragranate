import { NextResponse } from "next/server"
import { createClient } from "redis"
import { getFixturesByRound, getCurrentRound } from "@/lib/api-football"
import { initialFixtures } from "@/lib/data"
import type { MatchdayUpdate } from "@/lib/types"

const REDIS_KEY = "official_results_data"

// Verificar que la request viene de Vercel Cron
function isValidCronRequest(request: Request): boolean {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  // Si hay un CRON_SECRET configurado, verificarlo
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`
  }

  // En desarrollo, permitir sin autenticación
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Verificar header de Vercel Cron
  const vercelCronHeader = request.headers.get("x-vercel-cron")
  return vercelCronHeader === "true"
}

// Encontrar el ID del partido en nuestros fixtures basándose en los equipos
function findMatchId(
  homeTeamId: number,
  awayTeamId: number,
  matchday: number
): number | null {
  const match = initialFixtures.find(
    (f) =>
      f.matchday === matchday &&
      f.homeTeamId === homeTeamId &&
      f.awayTeamId === awayTeamId
  )
  return match?.id ?? null
}

async function getRedisClient() {
  const client = createClient({ url: process.env.REDIS_URL })
  client.on("error", (err) => console.error("Redis Client Error", err))
  await client.connect()
  return client
}

async function readData(): Promise<{ matchdays: MatchdayUpdate[] }> {
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

async function writeData(data: { matchdays: MatchdayUpdate[] }): Promise<boolean> {
  const client = await getRedisClient()
  try {
    await client.set(REDIS_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error writing to Redis:", error)
    return false
  } finally {
    await client.disconnect()
  }
}

export async function GET(request: Request) {
  console.log("Cron job iniciado: update-results")

  // Verificar autenticación
  if (!isValidCronRequest(request)) {
    console.error("Unauthorized cron request")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Obtener la jornada actual de la API
    let currentRound = await getCurrentRound()

    // Si no se puede obtener, usar un parámetro de query o calcular
    if (!currentRound) {
      const url = new URL(request.url)
      const roundParam = url.searchParams.get("round")
      if (roundParam) {
        currentRound = parseInt(roundParam, 10)
      } else {
        // Calcular jornada aproximada basándose en la fecha
        // La J22 empezó aproximadamente en enero 2026
        const now = new Date()
        const seasonStart = new Date("2026-01-20") // Fecha aproximada J22
        const weeksSinceStart = Math.floor(
          (now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
        )
        currentRound = Math.min(38, Math.max(22, 22 + weeksSinceStart))
      }
    }

    console.log(`Obteniendo resultados para la jornada ${currentRound}`)

    // Obtener resultados de la API
    const apiResult = await getFixturesByRound(currentRound)

    if (!apiResult.success || !apiResult.data) {
      console.error("Error obteniendo datos de API-Football:", apiResult.error)
      return NextResponse.json(
        {
          success: false,
          error: apiResult.error || "No se pudieron obtener los resultados",
        },
        { status: 500 }
      )
    }

    if (apiResult.data.length === 0) {
      console.log("No hay partidos terminados para esta jornada")
      return NextResponse.json({
        success: true,
        message: "No hay partidos terminados para actualizar",
        matchday: currentRound,
      })
    }

    // Convertir resultados al formato de nuestra aplicación
    const matches = apiResult.data
      .map((fixture) => {
        const matchId = findMatchId(
          fixture.homeTeamId,
          fixture.awayTeamId,
          currentRound
        )

        if (!matchId) {
          console.warn(
            `No se encontró el partido: ${fixture.homeTeamId} vs ${fixture.awayTeamId}`
          )
          return null
        }

        return {
          id: matchId,
          result: {
            homeGoals: fixture.homeGoals,
            awayGoals: fixture.awayGoals,
            isOfficial: true,
          },
          locked: true,
        }
      })
      .filter((m) => m !== null)

    if (matches.length === 0) {
      console.log("No se pudieron mapear los partidos")
      return NextResponse.json({
        success: true,
        message: "No se pudieron mapear los partidos a nuestro sistema",
        matchday: currentRound,
      })
    }

    // Leer datos actuales de Redis
    const currentData = await readData()

    // Crear o actualizar la jornada
    const matchdayUpdate: MatchdayUpdate = {
      matchday: currentRound,
      matches: matches as MatchdayUpdate["matches"],
    }

    // Buscar si ya existe esta jornada
    const existingIndex = currentData.matchdays.findIndex(
      (m) => m.matchday === currentRound
    )

    if (existingIndex >= 0) {
      currentData.matchdays[existingIndex] = matchdayUpdate
    } else {
      currentData.matchdays.push(matchdayUpdate)
    }

    // Guardar en Redis
    const saved = await writeData(currentData)

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Error guardando en Redis" },
        { status: 500 }
      )
    }

    console.log(
      `Actualización completada: ${matches.length} partidos de la jornada ${currentRound}`
    )

    return NextResponse.json({
      success: true,
      matchday: currentRound,
      matchesUpdated: matches.length,
      matches: matches,
    })
  } catch (error) {
    console.error("Error en cron update-results:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    )
  }
}
