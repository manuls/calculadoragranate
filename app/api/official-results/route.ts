import { NextResponse } from "next/server"
import type { MatchdayUpdate } from "@/lib/types"
import { Redis } from "@upstash/redis"

// Clave para almacenar los datos en Redis
const REDIS_KEY = "official_results_data"

// Crear cliente de Redis (usa las variables de entorno de Vercel automáticamente)
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

// Función para leer los datos de Redis
async function readData() {
  try {
    const data = await redis.get(REDIS_KEY)
    if (data) {
      return data as { matchdays: MatchdayUpdate[] }
    }
    return { matchdays: [] }
  } catch (error) {
    console.error("Error al leer de Redis:", error)
    return { matchdays: [] }
  }
}

// Función para escribir los datos en Redis
async function writeData(data: { matchdays: MatchdayUpdate[] }) {
  try {
    await redis.set(REDIS_KEY, data)
    return true
  } catch (error) {
    console.error("Error al escribir en Redis:", error)
    return false
  }
}

// GET: Obtener resultados oficiales
export async function GET() {
  try {
    const data = await readData()
    console.log("API GET: Datos leídos de Redis:", data)

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error al leer resultados oficiales:", error)
    return NextResponse.json({ success: false, error: "Error al leer los datos" }, { status: 500 })
  }
}

// POST: Guardar resultados oficiales
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MatchdayUpdate

    // Validar los datos recibidos
    if (!body.matchday || !Array.isArray(body.matches)) {
      return NextResponse.json({ success: false, error: "Datos inválidos" }, { status: 400 })
    }

    // Leer los datos actuales
    const data = await readData()

    // Buscar si ya existe esta jornada
    const matchdayIndex = data.matchdays.findIndex((m: MatchdayUpdate) => m.matchday === body.matchday)

    if (matchdayIndex >= 0) {
      // Actualizar la jornada existente
      data.matchdays[matchdayIndex] = body
    } else {
      // Agregar nueva jornada
      data.matchdays.push(body)
    }

    // Guardar los datos actualizados en Redis
    const writeSuccess = await writeData(data)

    if (!writeSuccess) {
      throw new Error("No se pudo escribir en Redis")
    }

    console.log("API POST: Datos guardados en Redis:", data)

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
