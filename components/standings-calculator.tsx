"use client"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import StandingsTable from "./standings-table"
import MatchFixtures from "./match-fixtures"
import type { Team, Match } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
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
import { initialTeams as savedTeams, initialFixtures as savedFixtures, playedMatches as savedMatches } from "@/lib/data"
import { calculateStandings, sortTeamsByRules } from "@/lib/standings"

import type { ForecastReport } from "@/lib/forecasts/forecast-service"
import { ForecastSummary } from "./forecast-summary"
import { loadScenario, saveScenario } from "@/lib/forecasts/scenario-storage"

export default function StandingsCalculator({ report }: { report?: ForecastReport } = {}) {
  const initialTeams = useMemo(() => report ? report.input.competition.teams.map((team) => ({ ...team, logoUrl: savedTeams.find((t) => t.id === team.id)?.logoUrl, initialPosition: team.position, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: team.pointsAdjustment })) : savedTeams, [report])
  const initialFixtures: Match[] = useMemo(() => report ? report.input.competition.matches.map((match) => ({ id: match.id, matchday: match.round, homeTeamId: match.homeId, awayTeamId: match.awayId, locked: match.homeGoals !== null, result: match.homeGoals === null ? null : { homeGoals: match.homeGoals, awayGoals: match.awayGoals!, isOfficial: true } })) : savedFixtures, [report])
  const playedMatches = report ? [] : savedMatches
  const baseStandings = report ? report.input.competition.teams.map((team) => ({ ...team, logoUrl: savedTeams.find((t) => t.id === team.id)?.logoUrl, initialPosition: team.position })) : sortTeamsByRules(initialTeams, [...playedMatches, ...initialFixtures])

  // Estado inicial con los equipos de la Primera RFEF Grupo 1
  const [teams, setTeams] = useState<Team[]>(baseStandings)

  // Clasificación base (ordenada por puntos) para comparar cambios de posición
  const [initialStandings, setInitialStandings] = useState<Team[]>(baseStandings)

  // Actualizar la definición de fixtures para usar initialFixtures
  const [fixtures, setFixtures] = useState<Match[]>(initialFixtures)

  const [activeTab, setActiveTab] = useState("standings")
  const [isLoading, setIsLoading] = useState(!report)
  const hasInitializedRef = useRef(false)

  // Estado para los resultados temporales
  const [tempResults, setTempResults] = useState<Record<number, { home: string; away: string }>>(() => Object.fromEntries(initialFixtures.filter((m) => m.locked && m.result).map((m) => [m.id, { home: String(m.result!.homeGoals), away: String(m.result!.awayGoals) }])))

  const { toast } = useToast()

  // Función para aplicar resultados oficiales a los fixtures
  const applyOfficialResults = useCallback(
    (data: any) => {
      if (!data || !data.matchdays || data.matchdays.length === 0) {
        console.log("No hay datos de resultados oficiales para aplicar")
        return { updatedFixtures: [...initialFixtures], updatedTempResults: {}, hasLockedMatches: false }
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

  // Función para calcular la clasificación con resultados oficiales
  // NOTA: initialStandings NO se actualiza aquí - siempre mantiene la clasificación
  // de la jornada anterior (initialTeams) para poder mostrar los cambios de posición
  const calculateInitialStandings = useCallback(() => {
    console.log("Calculando clasificación con resultados oficiales")

    // Verificar cuántos partidos tienen resultados
    const matchesWithResults = fixtures.filter((m) => m.result && m.locked).length
    console.log(`Hay ${matchesWithResults} partidos con resultados oficiales`)

    if (matchesWithResults === 0) {
      console.log("No hay partidos con resultados oficiales")
      return
    }

    // Filtrar solo los partidos con resultados oficiales (bloqueados)
    const officialFixtures = fixtures.filter((m) => m.result && m.locked)

    // Calcular la clasificación con los partidos oficiales
          const calculatedTeams = calculateStandings(initialTeams, officialFixtures, playedMatches)

    console.log(
      "Clasificación con resultados oficiales:",
      calculatedTeams.map((t) => `${t.name}: ${t.points} pts`).join(", "),
    )

    // Actualizar initialStandings con la clasificación oficial (tras resultados oficiales)
    // para que las flechas comparen contra la jornada oficial, no la base
    setInitialStandings(calculatedTeams)
    setTeams(calculatedTeams)
  }, [fixtures])

  // Cargar resultados oficiales al iniciar
  useEffect(() => {
    const loadOfficialResults = async () => {
      if (report) return;
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

  // Efecto para calcular la clasificación inicial solo una vez tras la carga
  useEffect(() => {
    if (!isLoading && !hasInitializedRef.current) {
      hasInitializedRef.current = true

      // Verificar si hay partidos bloqueados
      const hasLockedMatches = fixtures.some((match) => match.locked && match.result)

      if (hasLockedMatches && !report) {
        console.log("Carga inicial completada, calculando clasificación con resultados oficiales...")
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

    const newTempResults = {
      ...tempResults,
      [matchId]: {
        ...tempResults[matchId],
        [team]: value,
      },
    }

    setTempResults(newTempResults)

    // Recalcular clasificación automáticamente
    const updatedFixtures = fixtures.map((m) => {
      if (m.locked) return m
      const r = newTempResults[m.id]
      if (r && r.home !== '' && r.away !== '') {
        const homeGoals = Number.parseInt(r.home)
        const awayGoals = Number.parseInt(r.away)
        if (!isNaN(homeGoals) && !isNaN(awayGoals) && homeGoals >= 0 && awayGoals >= 0) {
          return { ...m, result: { homeGoals, awayGoals } }
        }
      }
      return { ...m, result: null }
    })

    const calculatedTeams = calculateStandings(initialTeams, updatedFixtures, playedMatches)
    setTeams(calculatedTeams)
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
      const calculatedTeams = calculateStandings(initialTeams, updatedFixtures, playedMatches)
      console.log("Clasificación calculada:", calculatedTeams.map((t) => `${t.name}: ${t.points}pts`).join(", "))

      // Actualizar el estado
      setFixtures(updatedFixtures)
      setTeams(calculatedTeams)

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
    const results = { ...tempResults }
    let restored = false
    if (report) for (const score of loadScenario(report.input.competition)) {
      results[score.matchId] = { home: String(score.homeGoals), away: String(score.awayGoals) }
      restored = true
    }
    try {
      const value = new URLSearchParams(window.location.search).get("state")
      const shared = value ? JSON.parse(value) : null
      if (shared?.results) for (const match of fixtures) {
        const score = shared.results[match.id]
        if (match.locked || !score || ![Number(score.home), Number(score.away)].every((v) => Number.isInteger(v) && v >= 0 && v <= 15)) continue
        results[match.id] = { home: String(score.home), away: String(score.away) }; restored = true
      }
    } catch { /* Ignorar enlaces de escenario incompatibles. */ }
    if (restored) { setTempResults(results); applyPredictionsAndCalculate(results) }
  }

  // Funcion calculateNewStandings
  const calculateNewStandings = () => {
    console.log("calculateNewStandings llamado")
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
      const calculatedTeams = calculateStandings(initialTeams, updatedFixtures, playedMatches)
      console.log("Clasificación calculada:", calculatedTeams.map((t) => `${t.name}: ${t.points}pts`).join(", "))

      // Actualizar el estado
      setTeams(calculatedTeams)
      setFixtures(updatedFixtures)

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
    }
  }

  // Funcion resetSimulation
  const resetSimulation = () => {
    if (report) saveScenario(report.input.competition, [])
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
    // Calcular la clasificación con los fixtures reseteados
    const calculatedTeams = calculateStandings(initialTeams, resetFixtures, playedMatches)
    setTeams(calculatedTeams)

    toast({
      title: "Reinicio",
      description: "Resultados y clasificación reiniciados (manteniendo resultados oficiales)",
    })
  }

  // Return con las pestanas
  return (
    <>
      <div className="mx-auto max-w-[1480px]">
        {report && <ForecastSummary report={report} results={tempResults} />}
        <Tabs defaultValue="standings" value={activeTab} onValueChange={handleTabChange}>
            <div className="mb-4 rounded-xl border bg-card p-1 shadow-sm sm:mb-6 sm:w-fit">
              <TabsList className="tabs-list grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0 sm:w-[520px]">
                <TabsTrigger value="standings" className="min-h-10 rounded-lg px-3 text-xs shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm">
                  Clasificación
                </TabsTrigger>
                <TabsTrigger value="predictions_ai" className="min-h-10 rounded-lg px-3 text-xs shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm">
                  Predicciones IA
                </TabsTrigger>
                <TabsTrigger value="team_objectives" className="min-h-10 rounded-lg px-3 text-xs shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm">
                  Objetivos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="standings" className="mt-0">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <div className="order-2 lg:order-1">
                  <StandingsTable teams={teams} initialStandings={initialStandings} className="standings-table" />
                </div>
                <div className="order-1 lg:order-2">
                  <MatchFixtures
                    fixtures={fixtures}
                    teams={teams}
                    tempResults={tempResults}
                    updateTempResult={updateTempResult}
                    onReset={resetSimulation}
                    className="match-fixtures"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="predictions_ai" className="mt-0 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
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

            <TabsContent value="team_objectives" className="mt-0 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
              <TeamPredictions teams={teams} fixtures={fixtures} />
            </TabsContent>
        </Tabs>
      </div>
      <TutorialGuide />
      <Toaster />
    </>
  )
}
