import type { ApiResponse, MatchdayUpdate } from "./types"

// Función para obtener resultados oficiales del backend
export async function fetchOfficialResults(): Promise<ApiResponse<any>> {
  try {
    // Primero intentamos cargar desde localStorage para tener una respuesta rápida
    const localData = localStorage.getItem("official_results_data")
    let localParsedData = null

    if (localData) {
      try {
        localParsedData = JSON.parse(localData)
        console.log("Datos pre-cargados desde localStorage:", localParsedData)
      } catch (e) {
        console.error("Error al parsear datos locales:", e)
      }
    }

    // Luego intentamos obtener los datos más actualizados de la API
    const response = await fetch("/api/official-results")

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Error en la respuesta de la API:", errorData)

      // Si tenemos datos locales, los devolvemos como respaldo
      if (localParsedData) {
        console.log("Devolviendo datos locales como respaldo")
        return {
          success: true,
          data: localParsedData,
        }
      }

      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Datos obtenidos de la API:", data)

    // Si la API devuelve datos válidos, actualizamos localStorage
    if (data.success && data.data && data.data.matchdays) {
      localStorage.setItem("official_results_data", JSON.stringify(data.data))
      console.log("Datos de la API guardados en localStorage")
    }

    return data
  } catch (error) {
    console.error("Error fetching official results:", error)

    // Intentar cargar desde localStorage como último recurso
    try {
      const localData = localStorage.getItem("official_results_data")
      if (localData) {
        const parsedData = JSON.parse(localData)
        console.log("Datos cargados desde localStorage como último recurso:", parsedData)
        return {
          success: true,
          data: parsedData,
        }
      }
    } catch (localError) {
      console.error("Error al cargar desde localStorage:", localError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Modificar la función submitOfficialResults para que actualice la clasificación
export async function submitOfficialResults(matchdayData: MatchdayUpdate): Promise<ApiResponse<any>> {
  const STORAGE_KEY = "official_results_data"
  try {
    // Validar que hay partidos para guardar
    if (!matchdayData.matches || matchdayData.matches.length === 0) {
      return {
        success: false,
        error: "No hay partidos para guardar",
      }
    }

    const response = await fetch("/api/official-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchdayData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    const data = await response.json()

    // Guardar también en localStorage como respaldo
    if (data.success && data.data) {
      try {
        // Obtener datos actuales de localStorage
        const localDataStr = localStorage.getItem(STORAGE_KEY)
        let localData = { matchdays: [] }

        if (localDataStr) {
          localData = JSON.parse(localDataStr)
        }

        // Actualizar o añadir la jornada
        const matchdayIndex = localData.matchdays.findIndex((m: any) => m.matchday === matchdayData.matchday)

        if (matchdayIndex >= 0) {
          localData.matchdays[matchdayIndex] = matchdayData
        } else {
          localData.matchdays.push(matchdayData)
        }

        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localData))
      } catch (e) {
        console.error("Error al guardar en localStorage:", e)
      }
    }

    return data
  } catch (error) {
    console.error("Error submitting official results:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
