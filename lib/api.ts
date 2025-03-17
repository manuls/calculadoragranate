import type { ApiResponse, MatchdayUpdate } from "./types"

// Función para obtener resultados oficiales del backend
export async function fetchOfficialResults(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch("/api/official-results")

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching official results:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Modificar la función submitOfficialResults para que actualice la clasificación

export async function submitOfficialResults(matchdayData: MatchdayUpdate): Promise<ApiResponse<any>> {
  const STORAGE_KEY = "clasificacion"
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data))
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

