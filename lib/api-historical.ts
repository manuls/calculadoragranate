import type { ApiResponse, HistoricalMatch } from "./types"

// Función para obtener datos históricos del backend
export async function fetchHistoricalMatches(): Promise<ApiResponse<any>> {
  try {
    // Primero intentamos cargar desde localStorage para tener una respuesta rápida
    const localData = localStorage.getItem("historical_match_data")
    let localParsedData = null

    if (localData) {
      try {
        localParsedData = JSON.parse(localData)
        console.log("Datos históricos pre-cargados desde localStorage:", localParsedData)
      } catch (e) {
        console.error("Error al parsear datos históricos locales:", e)
      }
    }

    // Luego intentamos obtener los datos más actualizados de la API
    const response = await fetch("/api/historical-matches")

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Error en la respuesta de la API de datos históricos:", errorData)

      // Si tenemos datos locales, los devolvemos como respaldo
      if (localParsedData) {
        console.log("Devolviendo datos históricos locales como respaldo")
        return {
          success: true,
          data: localParsedData,
        }
      }

      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Datos históricos obtenidos de la API:", data)

    // Si la API devuelve datos válidos, actualizamos localStorage
    if (data.success && data.data && data.data.matches) {
      localStorage.setItem("historical_match_data", JSON.stringify(data.data.matches))
      console.log("Datos históricos de la API guardados en localStorage")
    }

    return data
  } catch (error) {
    console.error("Error fetching historical matches:", error)

    // Intentar cargar desde localStorage como último recurso
    try {
      const localData = localStorage.getItem("historical_match_data")
      if (localData) {
        const parsedData = JSON.parse(localData)
        console.log("Datos históricos cargados desde localStorage como último recurso:", parsedData)
        return {
          success: true,
          data: { matches: parsedData },
        }
      }
    } catch (localError) {
      console.error("Error al cargar datos históricos desde localStorage:", localError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para enviar datos históricos al backend
export async function submitHistoricalMatches(matches: HistoricalMatch[]): Promise<ApiResponse<any>> {
  try {
    // Validar que hay partidos para guardar
    if (!matches || matches.length === 0) {
      return {
        success: false,
        error: "No hay partidos históricos para guardar",
      }
    }

    const response = await fetch("/api/historical-matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matches),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    const data = await response.json()

    // Guardar también en localStorage como respaldo
    if (data.success && data.data) {
      try {
        localStorage.setItem("historical_match_data", JSON.stringify(matches))
      } catch (e) {
        console.error("Error al guardar datos históricos en localStorage:", e)
      }
    }

    return data
  } catch (error) {
    console.error("Error submitting historical matches:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
