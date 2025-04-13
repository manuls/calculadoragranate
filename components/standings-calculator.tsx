"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StandingsTable from "./standings-table"
import MatchFixtures from "./match-fixtures"
import type { Team, Match } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { RotateCcw, Calculator } from "lucide-react"
import { fetchOfficialResults } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Importar componentes con carga diferida
import dynamic from "next/dynamic"

// Importar el componente TutorialGuide al principio del archivo
import TutorialGuide from "./tutorial-guide"

const MatchPredictions = dynamic(() => import("./match-predictions"), {
  loading: () => <div className="animate-pulse h-[300px] bg-muted rounded-md"></div>,
  ssr: false,
})

const TeamPredictions = dynamic(() => import("./team-predictions"), {
  loading: () => <div className="animate-pulse h-[300px] bg-muted rounded-md"></div>,
  ssr: false,
})

// Asegurarnos de que el componente principal use los mismos datos
import { initialTeams, initialFixtures } from "@/lib/data"

// Clave para localStorage
const STORAGE_KEY = "official_results_data"

export default function StandingsCalculator() {
  // Estado inicial con los equipos de la Segunda RFEF Grupo 1
  const [teams, setTeams] = useState<Team[]>(initialTeams)

  // Nuevo estado para mantener la clasificación inicial basada solo en resultados oficiales
  const [initialStandings, setInitialStandings] = useState<Team[]>([])

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

  // Definir calculateStandings como useCallback para evitar recreaciones innecesarias
  const calculateStandings = useCallback(
    (fixturesList: Match[]) => {
      console.log("Calculando clasificación con", fixturesList.length, "partidos")

      // Mostrar los partidos con resultados para depuración
      const matchesWithResults = fixturesList.filter((m) => m.result)
      console.log("Partidos con resultados:", matchesWithResults.length)
      matchesWithResults.forEach((m) => {
        console.log(
          `Partido ${m.id}: ${m.homeTeamId} vs ${m.awayTeamId} = ${m.result?.homeGoals}-${m.result?.awayGoals} (locked: ${m.locked})`,
        )
      })

      // Crear una copia profunda de los equipos iniciales
      const calculatedTeams = JSON.parse(JSON.stringify(initialTeams)) as Team[]

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
    },
    [initialTeams],
  )

  // Función para aplicar resultados oficiales a los fixtures
  const applyOfficialResults = useCallback(
    (data: any) => {
      if (!data || !data.matchdays || data.matchdays.length === 0) {
        console.log("No hay datos de resultados oficiales para aplicar")
        return { updatedFixtures: [...initialFixtures], hasLockedMatches: false }
      }

      console.log("Aplicando resultados oficiales:", data)

      // Crear una copia fresca de los fixtures iniciales
      const updatedFixtures = JSON.parse(JSON.stringify(initialFixtures)) as Match[]
      const updatedTempResults: Record<number, { home: string; away: string }> = {}
      let hasLockedMatches = false

      // Para cada jornada en los datos oficiales
      data.matchdays.forEach((matchdayData: any) => {
        console.log(`Procesando jornada ${matchdayData.matchday} con ${matchdayData.matches?.length || 0} partidos`)

        // Para cada partido en la jornada
        if (Array.isArray(matchdayData.matches)) {
          matchdayData.matches.forEach((officialMatch: any) => {
            // Encontrar el partido correspondiente en los fixtures
            const matchIndex = updatedFixtures.findIndex((m) => m.id === officialMatch.id)

            if (matchIndex >= 0) {
              console.log(
                `Actualizando partido ${officialMatch.id} con resultado ${officialMatch.result?.homeGoals}-${officialMatch.result?.awayGoals} (locked: ${officialMatch.locked})`,
              )

              // Actualizar el resultado y el estado de bloqueo
              updatedFixtures[matchIndex] = {
                ...updatedFixtures[matchIndex],
                result: officialMatch.result,
                locked: officialMatch.locked,
              }

              // Actualizar también los resultados temporales para la visualización
              if (officialMatch.locked && officialMatch.result) {
                hasLockedMatches = true
                updatedTempResults[officialMatch.id] = {
                  home: officialMatch.result.homeGoals.toString(),
                  away: officialMatch.result.awayGoals.toString(),
                }
              }
            } else {
              console.warn(`No se encontró el partido con ID ${officialMatch.id} en los fixtures`)
            }
          })
        }
      })

      console.log(
        `Resultados aplicados. Hay ${hasLockedMatches ? "partidos bloqueados" : "NO hay partidos bloqueados"}`,
      )
      console.log("Fixtures actualizados:", updatedFixtures.filter((m) => m.result).length, "partidos con resultados")

      return { updatedFixtures, updatedTempResults, hasLockedMatches }
    },
    [initialFixtures],
  )

  // Función para calcular la clasificación inicial
  const calculateInitialStandings = useCallback(() => {
    console.log("Calculando clasificación inicial con fixtures actualizados")

    // Verificar cuántos partidos tienen resultados
    const matchesWithResults = fixtures.filter((m) => m.result && m.locked).length
    console.log(`Hay ${matchesWithResults} partidos con resultados oficiales para calcular la clasificación inicial`)

    if (matchesWithResults === 0) {
      console.log("No hay partidos con resultados oficiales, no se calcula la clasificación inicial")
      return
    }

    // Filtrar solo los partidos con resultados oficiales (bloqueados)
    const officialFixtures = fixtures.filter((m) => m.result && m.locked)

    // Calcular la clasificación con solo los partidos oficiales
    const calculatedInitialTeams = calculateStandings(officialFixtures)

    console.log(
      "Clasificación inicial calculada:",
      calculatedInitialTeams.map((t) => `${t.name}: ${t.points} pts`).join(", "),
    )

    // Guardar la clasificación inicial
    setInitialStandings(calculatedInitialTeams)

    // Si no hay clasificación actual, también establecerla
    if (teams.every((t) => t.played === initialTeams.find((it) => it.id === t.id)?.played)) {
      console.log("Estableciendo clasificación actual igual a la inicial")
      setTeams(calculatedInitialTeams)
      setLastCalculated(new Date())
    }
  }, [fixtures, calculateStandings, teams, initialTeams])

  // Cargar resultados oficiales al iniciar
  useEffect(() => {
    const loadOfficialResults = async () => {
      setIsLoading(true)
      try {
        console.log("Cargando resultados oficiales...")

        // Intentar cargar desde la API
        const response = await fetchOfficialResults()
        console.log("Respuesta de la API:", response)

        if (response.success && response.data) {
          console.log("Datos cargados correctamente:", response.data)

          // Aplicar los resultados oficiales a los fixtures
          const { updatedFixtures, updatedTempResults, hasLockedMatches } = applyOfficialResults(response.data)

          // Actualizar el estado con los fixtures y tempResults actualizados
          setFixtures(updatedFixtures)
          setTempResults(updatedTempResults)

          // Si hay partidos bloqueados, calcular la clasificación inicial
          if (hasLockedMatches) {
            console.log("Hay partidos bloqueados, calculando clasificación inicial...")

            // Importante: Necesitamos asegurarnos de que los fixtures se han actualizado
            // antes de calcular la clasificación, por lo que usamos un efecto separado
            // que se ejecutará cuando fixtures cambie
          } else {
            console.log("No hay partidos bloqueados, no se calcula clasificación inicial")
          }
        } else {
          console.log("No se pudieron cargar datos o no hay datos disponibles")
        }
      } catch (error) {
        console.error("Error al cargar resultados oficiales:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOfficialResults()
  }, [applyOfficialResults])

  // Efecto para calcular la clasificación inicial cuando los fixtures se han actualizado
  useEffect(() => {
    if (!isLoading) {
      // Verificar si hay partidos bloqueados
      const hasLockedMatches = fixtures.some((match) => match.locked && match.result)

      if (hasLockedMatches) {
        console.log("Fixtures actualizados y hay partidos bloqueados, calculando clasificación inicial...")
        calculateInitialStandings()
      }

      // También intentamos cargar el estado desde la URL
      loadStateFromUrl()
    }
  }, [fixtures, isLoading, calculateInitialStandings])

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

  // Función para actualizar los resultados temporales desde las predicciones
  const updateTempResultsFromPredictions = (predictedResults: Record<number, { home: string; away: string }>) => {
    console.log("updateTempResultsFromPredictions llamado con:", predictedResults)

    try {
      // Crear una copia de los resultados temporales actuales
      const newTempResults = { ...tempResults }

      // Filtrar solo los partidos que no están bloqueados
      fixtures.forEach((match) => {
        if (!match.locked && predictedResults[match.id]) {
          newTempResults[match.id] = predictedResults[match.id]
        }
      })

      console.log("Nuevos resultados temporales:", newTempResults)

      // Actualizar el estado de tempResults
      setTempResults(newTempResults)

      // Aplicar los resultados a los fixtures y calcular la clasificación
      applyPredictionsAndCalculate(newTempResults)
    } catch (error) {
      console.error("Error al actualizar resultados temporales:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al aplicar las predicciones",
        variant: "destructive",
      })
    }
  }

  // Nueva función para aplicar predicciones y calcular clasificación
  const applyPredictionsAndCalculate = (results: Record<number, { home: string; away: string }>) => {
    console.log("applyPredictionsAndCalculate llamado con:", results)

    setIsCalculating(true)

    try {
      // Crear una copia de los fixtures
      const updatedFixtures = [...fixtures]

      // Actualizar los fixtures con los resultados
      updatedFixtures.forEach((match) => {
        // Si el partido está bloqueado, mantener su resultado actual
        if (match.locked) return

        const result = results[match.id]
        if (result && result.home !== undefined && result.away !== undefined) {
          const homeGoals = Number.parseInt(result.home)
          const awayGoals = Number.parseInt(result.away)

          if (!isNaN(homeGoals) && !isNaN(awayGoals) && homeGoals >= 0 && awayGoals >= 0) {
            match.result = { homeGoals, awayGoals }
          } else {
            match.result = null
          }
        } else {
          match.result = null
        }
      })

      console.log(
        "Fixtures actualizados para cálculo:",
        updatedFixtures.filter((m) => m.result).length,
        "partidos con resultados",
      )

      // Calcular la clasificación con los fixtures actualizados
      const calculatedTeams = calculateStandings(updatedFixtures)
      console.log("Clasificación calculada:", calculatedTeams.map((t) => `${t.name}: ${t.points}pts`).join(", "))

      // Actualizar el estado
      setFixtures(updatedFixtures)
      setTeams(calculatedTeams)
      setLastCalculated(new Date())

      // Cambiar a la pestaña de clasificación
      setActiveTab("standings")

      toast({
        title: "Éxito",
        description: "Predicciones aplicadas y clasificación calculada correctamente",
      })
    } catch (error) {
      console.error("Error al aplicar predicciones y calcular clasificación:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al calcular la clasificación",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
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

  // Función para manejar el cambio de pestaña con eventos de GA
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Enviar eventos de GA según la pestaña seleccionada
    if (value === "predictions_ai") {
      sendGAEvent("predictions_ia", "navigation", "Predicciones IA tab clicked")
    } else if (value === "team_objectives") {
      sendGAEvent("team_objectives", "navigation", "Objetivos del Equipo tab clicked")
    }
  }

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
    console.log("calculateNewStandings llamado")
    setIsCalculating(true)

    // Enviar evento a Google Analytics
    sendGAEvent("calculate", "standings", "Calcular clasificación")

    try {
      console.log("Calculando nueva clasificación con resultados temporales:", tempResults)

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

      console.log(
        "Fixtures actualizados para cálculo:",
        updatedFixtures.filter((m) => m.result).length,
        "partidos con resultados",
      )

      // Calcular la clasificación con los fixtures actualizados
      const calculatedTeams = calculateStandings(updatedFixtures)
      console.log("Clasificación calculada:", calculatedTeams.map((t) => `${t.name}: ${t.points}pts`).join(", "))

      // Actualizar el estado
      setTeams(calculatedTeams)
      setFixtures(updatedFixtures)
      setLastCalculated(new Date())

      toast({
        title: "Éxito",
        description: "Clasificación calculada correctamente",
      })
    } catch (error) {
      console.error("Error al calcular clasificación:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al calcular la clasificación",
        variant: "destructive",
      })
    } finally {
      // Asegurarnos de que siempre se restablezca el estado de cálculo
      setIsCalculating(false)
    }
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
              <div className="mb-6">
                <Tabs defaultValue="standings" value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="mb-4 tabs-list w-full grid grid-cols-3 gap-1">
                    <TabsTrigger
                      value="standings"
                      className="px-1 sm:px-3 py-2 text-xs sm:text-sm whitespace-normal h-auto"
                    >
                      Clasificación
                    </TabsTrigger>
                    <TabsTrigger
                      value="predictions_ai"
                      className="px-1 sm:px-3 py-2 text-xs sm:text-sm whitespace-normal h-auto"
                    >
                      Predicciones IA
                    </TabsTrigger>
                    <TabsTrigger
                      value="team_objectives"
                      className="px-1 sm:px-3 py-2 text-xs sm:text-sm whitespace-normal h-auto"
                    >
                      Objetivos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="standings">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div className="order-2 lg:order-1">
                        <StandingsTable
                          teams={teams}
                          initialStandings={initialStandings}
                          resetSimulation={resetSimulation}
                          lastCalculated={lastCalculated}
                          className="standings-table"
                        />
                      </div>
                      <div className="order-1 lg:order-2">
                        <MatchFixtures
                          fixtures={fixtures}
                          teams={teams}
                          tempResults={tempResults}
                          updateTempResult={updateTempResult}
                          className="match-fixtures"
                        />
                        <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 mobile-action-buttons">
                          <Button
                            onClick={calculateNewStandings}
                            className="btn-primary w-full sm:w-auto h-9 sm:h-10"
                            disabled={isCalculating}
                            size="sm"
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
                            className="hover:bg-primary/10 w-full sm:w-auto h-9 sm:h-10"
                            size="sm"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reiniciar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="predictions_ai">
                    <MatchPredictions
                      matches={fixtures}
                      teams={teams}
                      updateTempResults={updateTempResultsFromPredictions}
                      onApplyPredictions={() => {
                        console.log("onApplyPredictions llamado desde MatchPredictions")
                        // No necesitamos hacer nada aquí, ya que updateTempResultsFromPredictions
                        // se encarga de todo el proceso
                      }}
                      setActiveTab={setActiveTab}
                    />
                  </TabsContent>

                  <TabsContent value="team_objectives">
                    <TeamPredictions teams={teams} fixtures={fixtures} />
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <TutorialGuide />
      <Toaster />
    </>
  )
}
