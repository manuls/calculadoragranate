import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Ruta al archivo JSON donde almacenaremos los datos
const dataFilePath = path.join(process.cwd(), "data", "historical-matches.json")

// Función para leer los datos del archivo
async function readDataFile() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error al leer el archivo de datos históricos:", error)
    return { matches: [] }
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
    console.error("Error al escribir en el archivo de datos históricos:", error)
    return false
  }
}

// GET: Obtener datos históricos
export async function GET() {
  try {
    // Leer los datos del archivo
    const data = await readDataFile()

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error al leer datos históricos:", error)
    return NextResponse.json({ success: false, error: "Error al leer los datos" }, { status: 500 })
  }
}

// POST: Guardar datos históricos
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos recibidos
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "Datos inválidos" }, { status: 400 })
    }

    // Leer los datos actuales
    const data = await readDataFile()

    // Actualizar los datos
    data.matches = body

    // Guardar los datos actualizados en el archivo
    const writeSuccess = await writeDataFile(data)

    if (!writeSuccess) {
      throw new Error("No se pudo escribir en el archivo de datos")
    }

    // Devolver los datos actualizados junto con la confirmación de éxito
    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
