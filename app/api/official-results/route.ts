import { NextResponse } from "next/server"
import type { MatchdayUpdate } from "@/lib/types"
import { promises as fs } from "fs"
import path from "path"

// Ruta al archivo JSON donde almacenaremos los datos
const dataFilePath = path.join(process.cwd(), "data", "official-results-data.json")

// Función para leer los datos del archivo
async function readDataFile() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // Si el archivo no existe o hay un error al leerlo, intentar leer el archivo de respaldo
    try {
      const backupPath = path.join(process.cwd(), "data", "official-results.json")
      const backupData = await fs.readFile(backupPath, "utf8")
      return JSON.parse(backupData)
    } catch (backupError) {
      console.error("Error al leer el archivo de datos y el respaldo:", backupError)
      return { matchdays: [] }
    }
  }
}

// Función para escribir los datos en el archivo
async function writeDataFile(data: any) {
  try {
    // Asegurarse de que el directorio existe
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error al escribir en el archivo de datos:", error)
    return false
  }
}

// GET: Obtener resultados oficiales
export async function GET() {
  try {
    // Leer los datos del archivo
    const data = await readDataFile()

    console.log("API GET: Datos leídos del archivo:", data)

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
    const data = await readDataFile()

    // Buscar si ya existe esta jornada
    const matchdayIndex = data.matchdays.findIndex((m: any) => m.matchday === body.matchday)

    if (matchdayIndex >= 0) {
      // Actualizar la jornada existente
      data.matchdays[matchdayIndex] = body
    } else {
      // Agregar nueva jornada
      data.matchdays.push(body)
    }

    // Guardar los datos actualizados en el archivo
    const writeSuccess = await writeDataFile(data)

    if (!writeSuccess) {
      throw new Error("No se pudo escribir en el archivo de datos")
    }

    // Devolver los datos actualizados junto con la confirmación de éxito
    return NextResponse.json({
      success: true,
      data: data, // Devolver los datos actualizados
    })
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
