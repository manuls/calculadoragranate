"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StandingsTable from "./standings-table"
import MatchFixtures from "./match-fixtures"
import type { Team, Match } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { RotateCcw, Calculator } from "lucide-react"
import { fetchOfficialResults } from "@/lib/api"

// Asegurarnos de que el componente principal use los mismos datos
import { initialTeams, initialFixtures } from "@/lib/data"

// Clave para localStorage
const STORAGE_KEY = "official_results_data"

// Funcion de prediccion
function predictResult(homeTeam: Team, awayTeam: Team): { homeGoals: number; awayGoals: number } {
  const homeStrength = (homeTeam.goalsFor / homeTeam.played) * (1 - awayTeam.goalsAgainst / (awayTeam.played * 3))
  const awayStrength = (awayTeam.goalsFor / awayTeam.played) * (1 - homeTeam.goalsAgainst / (homeTeam.played * 3))

  return {
    homeGoals: Math.round(homeStrength * 1.5), // Factor de ventaja local
    awayGoals: Math.round(awayStrength),
  }
}

export default function StandingsCalculator() {
  // Estado inicial con los equipos de la Segunda RFEF Grupo 1
  const [teams, setTeams] = useState<Team[]>(initialTeams)

  // Actualizar la definición de fixtures para usar initialFixtures
  const [fixtures, setFixtures] = useState<Match[]>(initialFixtures)

  const [activeTab, setActiveTab] = useState("standings")
  const [isCalculating, setIsCalculating] = useState(false)
  const [lastCalculated, setLastCalculated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado para los resultados temporales
  const [tempResults, setTempResults] = useState<Record<number, { home: string; away: string }>>({})

  // Estado para mensajes de error o exito
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  const { toast } = useToast()

  // Función para calcular la clasificación basada en los fixtures actuales
  const calculateStandings = (fixturesList: Match[]) => {
    console.log("Calculando clasificación con", fixturesList.length, "partidos")

    // Crear una copia profunda de los equipos iniciales
    const calculatedTeams = JSON.parse(JSON.stringify(initialTeams)) as Team[]

    // Contar cuántos partidos tienen resultados
    const matchesWithResults = fixturesList.filter((match) => match.result).length
    console.log(`Partidos con resultados: ${matchesWithResults}`)

    // Procesar todos los partidos con resultados
    fixturesList.forEach((match) => {
      if (match.result) {
        const homeTeam = calculatedTeams.find((team) => team.id === match.homeTeamId)
        const awayTeam = calculatedTeams.find((team) => team.id === match.awayTeamId)

        if (homeTeam && awayTeam) {
          // Actualizar partidos jugados
          homeTeam.played += 1
          awayTeam.played += 1

          // Actualizar goles
          homeTeam.goalsFor += match.result.homeGoals
          homeTeam.goalsAgainst += match.result.awayGoals
          awayTeam.goalsFor += match.result.awayGoals
          awayTeam.goalsAgainst += match.result.homeGoals

          // Actualizar resultados y puntos
          if (match.result.homeGoals > match.result.awayGoals) {
            // Victoria local
            homeTeam.won += 1
            homeTeam.points += 3
            awayTeam.lost += 1
          } else if (match.result.homeGoals < match.result.awayGoals) {
            // Victoria visitante
            awayTeam.won += 1
            awayTeam.points += 3
            homeTeam.lost += 1
          } else {
            // Empate
            homeTeam.drawn += 1
            homeTeam.points += 1
            awayTeam.drawn += 1
            awayTeam.points += 1
          }
        }
      }
    })

    // Ordenar equipos por puntos (y diferencia de goles en caso de empate)
    calculatedTeams.sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points
      }
      const aDiff = a.goalsFor - a.goalsAgainst
      const bDiff = b.goalsFor - b.goalsAgainst
      return bDiff - aDiff
    })

    return calculatedTeams
  }

  // Cargar resultados oficiales al iniciar
  useEffect(() => {
    const loadOfficialResults = async () => {
      setIsLoading(true)
      try {
        console.log("Cargando resultados oficiales...")

        // Intentar cargar desde la API
        const response = await fetchOfficialResults()

        if (response.success && response.data && response.data.matchdays) {
          console.log("Datos cargados desde API:", response.data)

          // Crear una copia de los fixtures iniciales
          const updatedFixtures = [...initialFixtures]
          const updatedTempResults: Record<number, { home: string; away: string }> = {}

          // Aplicar los resultados oficiales a los fixtures
          response.data.matchdays.forEach((matchdayData: any) => {
            matchdayData.matches.forEach((officialMatch: any) => {
              const matchIndex = updatedFixtures.findIndex((m) => m.id === officialMatch.id)
              if (matchIndex >= 0) {
                updatedFixtures[matchIndex] = {
                  ...updatedFixtures[matchIndex],
                  result: officialMatch.result,
                  locked: officialMatch.locked,
                }

                if (officialMatch.locked && officialMatch.result) {
                  updatedTempResults[officialMatch.id] = {
                    home: officialMatch.result.homeGoals.toString(),
                    away: officialMatch.result.awayGoals.toString(),
                  }
                }
              }
            })
          })

          // Actualizar los fixtures y tempResults
          setFixtures(updatedFixtures)
          setTempResults(updatedTempResults)

          // Calcular la clasificación con los fixtures actualizados
          const calculatedTeams = calculateStandings(updatedFixtures)
          setTeams(calculatedTeams)
          setLastCalculated(new Date())

          console.log("Clasificación calculada con éxito")
        } else {
          // Si la API falla, intentar cargar desde localStorage
          console.log("No se pudieron cargar datos desde la API, intentando localStorage")
          const localData = localStorage.getItem(STORAGE_KEY)

          if (localData) {
            try {
              const parsedData = JSON.parse(localData)
              console.log("Datos cargados desde localStorage:", parsedData)

              // Crear una copia de los fixtures iniciales
              const updatedFixtures = [...initialFixtures]
              const updatedTempResults: Record<number, { home: string; away: string }> = {}

              // Aplicar los resultados oficiales a los fixtures
              parsedData.matchdays.forEach((matchdayData: any) => {
                matchdayData.matches.forEach((officialMatch: any) => {
                  const matchIndex = updatedFixtures.findIndex((m) => m.id === officialMatch.id)
                  if (matchIndex >= 0) {
                    updatedFixtures[matchIndex] = {
                      ...updatedFixtures[matchIndex],
                      result: officialMatch.result,
                      locked: officialMatch.locked,
                    }

                    if (officialMatch.locked && officialMatch.result) {
                      updatedTempResults[officialMatch.id] = {
                        home: officialMatch.result.homeGoals.toString(),
                        away: officialMatch.result.awayGoals.toString(),
                      }
                    }
                  }
                })
              })

              // Actualizar los fixtures y tempResults
              setFixtures(updatedFixtures)
              setTempResults(updatedTempResults)

              // Calcular la clasificación con los fixtures actualizados
              const calculatedTeams = calculateStandings(updatedFixtures)
              setTeams(calculatedTeams)
              setLastCalculated(new Date())

              console.log("Clasificación calculada con éxito desde localStorage")
            } catch (e) {
              console.error("Error al parsear datos locales:", e)
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar resultados oficiales:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOfficialResults()
  }, [])

  // Añadir una función para cargar el estado desde la URL al iniciar
  // Añadir este useEffect después del useEffect que carga los resultados oficiales

  // Cargar el estado desde la URL al iniciar
  useEffect(() => {
    if (!isLoading) {
      loadStateFromUrl()
    }
  }, [isLoading])

  // Funcion para actualizar el resultado temporal de un partido
  const updateTempResult = (matchId: number, team: "home" | "away", value: string) => {
    // No permitir actualizar partidos bloqueados
    const match = fixtures.find((m) => m.id === matchId)
    if (match && match.locked) return

    setTempResults((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value,
      },
    }))
  }

  // Función para enviar evento a Google Analytics
  const sendGAEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
      })
    }
  }

  // Añadir una función para generar una URL compartible con el estado actual
  // Añadir esta función después de la función sendGAEvent

  // Función para generar una URL compartible con el estado actual
  const generateShareableUrl = () => {
    // Crear un objeto con el estado actual que queremos compartir
    const shareState = {
      results: tempResults,
      timestamp: new Date().toISOString(),
    }

    // Convertir a JSON y codificar para URL
    const stateParam = encodeURIComponent(JSON.stringify(shareState))

    // Crear la URL con el parámetro de estado
    const baseUrl = typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""
    return `${baseUrl}?state=${stateParam}`
  }

  // Añadir una función para cargar el estado desde la URL
  // Añadir esta función después de la función generateShareableUrl

  // Función para cargar el estado desde la URL
  const loadStateFromUrl = () => {
    if (typeof window === "undefined") return

    const urlParams = new URLSearchParams(window.location.search)
    const stateParam = urlParams.get("state")

    if (stateParam) {
      try {
        const shareState = JSON.parse(decodeURIComponent(stateParam))

        // Validar que el estado tiene el formato esperado
        if (shareState && shareState.results) {
          setTempResults(shareState.results)

          // Calcular la clasificación con los resultados cargados
          setTimeout(() => calculateNewStandings(), 500)

          toast({
            title: "Predicción cargada",
            description: "Se ha cargado una predicción compartida",
          })
        }
      } catch (error) {
        console.error("Error al cargar el estado desde la URL:", error)
      }
    }
  }

  // Funcion calculateNewStandings
  const calculateNewStandings = () => {
    setIsCalculating(true)

    // Enviar evento a Google Analytics
    sendGAEvent("calculate", "standings", "Calcular clasificación")

    // Simulamos un pequeño retraso para mostrar el estado de carga
    setTimeout(() => {
      // Actualizar los fixtures con los resultados temporales
      const updatedFixtures = fixtures.map((match) => {
        // Si el partido está bloqueado, mantener su resultado actual
        if (match.locked) return match

        const result = tempResults[match.id]
        if (result && result.home !== undefined && result.away !== undefined) {
          const homeGoals = Number.parseInt(result.home)
          const awayGoals = Number.parseInt(result.away)

          if (!isNaN(homeGoals) && !isNaN(awayGoals) && homeGoals >= 0 && awayGoals >= 0) {
            return { ...match, result: { homeGoals, awayGoals } }
          }
        }
        return { ...match, result: null } // Reiniciar el resultado si no hay cambios validos
      })

      // Calcular la clasificación con los fixtures actualizados
      const calculatedTeams = calculateStandings(updatedFixtures)

      setTeams(calculatedTeams)
      setFixtures(updatedFixtures)
      setLastCalculated(new Date())
      setIsCalculating(false)
      setActiveTab("standings")

      toast({
        title: "Éxito",
        description: "Clasificación calculada correctamente",
      })
    }, 500)
  }

  // Funcion resetSimulation
  const resetSimulation = () => {
    // Enviar evento a Google Analytics
    sendGAEvent("reset", "standings", "Reiniciar clasificación")

    // Crear una copia de los fixtures para mantener los partidos bloqueados
    const resetFixtures = fixtures.map((match) => {
      // Si el partido está bloqueado, mantener su estado y resultado
      if (match.locked) return match
      // Si no está bloqueado, reiniciar su resultado
      return { ...match, result: null }
    })

    // Crear un nuevo objeto tempResults que solo contenga los partidos bloqueados
    const resetTempResults: Record<number, { home: string; away: string }> = {}
    fixtures.forEach((match) => {
      if (match.locked && match.result) {
        resetTempResults[match.id] = {
          home: match.result.homeGoals.toString(),
          away: match.result.awayGoals.toString(),
        }
      }
    })

    setFixtures(resetFixtures)
    setTempResults(resetTempResults)
    setMessage(null)

    // Calcular la clasificación con los fixtures reseteados
    const calculatedTeams = calculateStandings(resetFixtures)
    setTeams(calculatedTeams)
    setLastCalculated(new Date())

    toast({
      title: "Reinicio",
      description: "Resultados y clasificación reiniciados (manteniendo resultados oficiales)",
    })
  }

  // Return con las pestanas
  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3">Cargando resultados oficiales...</span>
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="p-3 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="order-2 lg:order-1">
                  <StandingsTable teams={teams} resetSimulation={resetSimulation} lastCalculated={lastCalculated} />
                </div>
                <div className="order-1 lg:order-2">
                  <MatchFixtures
                    fixtures={fixtures}
                    teams={teams}
                    tempResults={tempResults}
                    updateTempResult={updateTempResult}
                  />
                  <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                    <Button
                      onClick={calculateNewStandings}
                      className="btn-primary w-full sm:w-auto"
                      disabled={isCalculating}
                      size="sm"
                      className="h-9 sm:h-10"
                    >
                      {isCalculating ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          Calculando...
                        </>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Calcular Clasificación
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetSimulation}
                      variant="outline"
                      className="hover:bg-primary/10 w-full sm:w-auto"
                      size="sm"
                      className="h-9 sm:h-10"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reiniciar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </>
  )
}

