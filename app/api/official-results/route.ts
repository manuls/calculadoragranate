import { NextResponse } from "next/server"
import type { MatchdayUpdate } from "@/lib/types"
import { createClient } from "redis"

// Clave para almacenar los datos en Redis
const REDIS_KEY = "official_results_data"

// Crear y conectar cliente de Redis
async function getRedisClient() {
  const client = createClient({ url: process.env.REDIS_URL })
  client.on("error", (err) => console.error("Redis Client Error", err))
  await client.connect()
  return client
}

// Función para leer los datos de Redis
async function readData() {
  const client = await getRedisClient()
  try {
    const data = await client.get(REDIS_KEY)
    if (data) {
      return JSON.parse(data) as { matchdays: MatchdayUpdate[] }
    }
    return { matchdays: [] }
  } catch (error) {
    console.error("Error al leer de Redis:", error)
    return { matchdays: [] }
  } finally {
    await client.disconnect()
  }
}

// Función para escribir los datos en Redis
async function writeData(data: { matchdays: MatchdayUpdate[] }) {
  const client = await getRedisClient()
  try {
    await client.set(REDIS_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error al escribir en Redis:", error)
    return false
  } finally {
    await client.disconnect()
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
