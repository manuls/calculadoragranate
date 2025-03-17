import { NextResponse } from "next/server"
import type { MatchdayUpdate } from "@/lib/types"

// Variable global para almacenar los datos en memoria del servidor
// Nota: Esto se reiniciará con cada despliegue o reinicio del servidor
const officialResultsData = { matchdays: [] }

// GET: Obtener resultados oficiales
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: officialResultsData,
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

    // Buscar si ya existe esta jornada
    const matchdayIndex = officialResultsData.matchdays.findIndex((m: any) => m.matchday === body.matchday)

    if (matchdayIndex >= 0) {
      // Actualizar la jornada existente
      officialResultsData.matchdays[matchdayIndex] = body
    } else {
      // Agregar nueva jornada
      officialResultsData.matchdays.push(body)
    }

    // Devolver los datos actualizados junto con la confirmación de éxito
    return NextResponse.json({
      success: true,
      data: officialResultsData, // Devolver los datos actualizados
    })
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

