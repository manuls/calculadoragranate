"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
// Asegurarse de importar el icono TrendingUp
import { AlertCircle, TrendingUp, Percent, Brain, Home, Activity, Shield, Swords, Info } from "lucide-react"
import type { Match, Team } from "@/lib/types"
import { predictMatches } from "@/lib/prediction-service"
import { motion } from "framer-motion"

// Añadir las importaciones necesarias
import { useToast } from "@/hooks/use-toast"

// Modificar la interfaz MatchPredictionsProps para incluir las nuevas props
interface MatchPredictionsProps {
  matches: Match[]
  teams: Team[]
  updateTempResults?: (results: Record<number, { home: string; away: string }>) => void
  onApplyPredictions?: () => void
  setActiveTab?: (tab: string) => void
}

// Modificar la interfaz MatchPrediction para incluir el nuevo factor
export interface MatchPredictionType {
  matchId: number
  homeTeamId: number
  awayTeamId: number
  homeWinProbability: number
  drawProbability: number
  awayWinProbability: number
  predictedHomeGoals: number
  predictedAwayGoals: number
  confidence: number
  // Añadir factores explicativos
  factors: {
    homeAdvantage: number
    homeFormFactor: number
    awayFormFactor: number
    homeAttackStrength: number
    homeDefenseStrength: number
    awayAttackStrength: number
    awayDefenseStrength: number
    standingsFactor: number
    headToHead?: string
  }
}

// Dentro de la función MatchPredictions, añadir el hook useToast y las nuevas props
export default function MatchPredictions({
  matches,
  teams,
  updateTempResults,
  onApplyPredictions,
  setActiveTab,
}: MatchPredictionsProps) {
  const [predictions, setPredictions] = useState<MatchPredictionType[]>([])
  const [activeMatchday, setActiveMatchday] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast() // Añadir el hook useToast

  // Obtener jornadas disponibles (sin resultados)
  const availableMatchdays = Array.from(
    new Set(matches.filter((match) => !match.result && !match.locked).map((match) => match.matchday)),
  ).sort((a, b) => a - b)

  // Generar predicciones al cargar el componente o cuando cambian los partidos
  useEffect(() => {
    if (availableMatchdays.length > 0 && !activeMatchday) {
      setActiveMatchday(availableMatchdays[0])
    }
  }, [availableMatchdays, activeMatchday])

  // Función para enviar evento a Google Analytics
  const sendGAEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
      })
    }
  }

  // Función para generar predicciones
  const generatePredictions = () => {
    setIsLoading(true)

    // Enviar evento a Google Analytics
    sendGAEvent("exec_predictions_ia", "predictions", "Generate AI predictions button clicked")

    // Simular un pequeño retraso para dar sensación de procesamiento
    setTimeout(() => {
      const newPredictions = predictMatches(matches, teams)
      setPredictions(newPredictions)
      setIsLoading(false)
    }, 1000)
  }

  // Obtener el nombre del equipo por ID
  const getTeamName = (teamId: number): string => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Equipo desconocido"
  }

  // Obtener el logo del equipo por ID
  const getTeamLogo = (teamId: number): string | undefined => {
    const team = teams.find((t) => t.id === teamId)
    return team?.logoUrl
  }

  // Filtrar predicciones por jornada activa
  const filteredPredictions = predictions.filter((prediction) => {
    const match = matches.find((m) => m.id === prediction.matchId)
    return match && match.matchday === activeMatchday
  })

  // Formatear probabilidad como porcentaje
  const formatProbability = (prob: number): string => {
    return `${Math.round(prob * 100)}%`
  }

  // Determinar el resultado más probable basado en todos los factores
  const getMostLikelyResult = (prediction: MatchPredictionType): "home" | "draw" | "away" => {
    const { homeWinProbability, drawProbability, awayWinProbability, factors } = prediction

    // Si hay una diferencia significativa en la clasificación (más del 30%), dar prioridad a este factor
    if (Math.abs(factors.standingsFactor) > 0.3) {
      return factors.standingsFactor > 0 ? "home" : "away"
    }

    // Calcular la ventaja total para cada equipo considerando todos los factores
    const homeAdvantageTotal =
      factors.homeAdvantage +
      factors.homeFormFactor +
      (factors.homeAttackStrength - factors.awayDefenseStrength) +
      factors.standingsFactor

    const awayAdvantageTotal =
      factors.awayFormFactor +
      (factors.awayAttackStrength - factors.homeDefenseStrength) -
      factors.homeAdvantage -
      factors.standingsFactor

    // Si hay una ventaja clara para algún equipo
    if (homeAdvantageTotal > awayAdvantageTotal + 0.5) {
      return "home"
    } else if (awayAdvantageTotal > homeAdvantageTotal + 0.5) {
      return "away"
    }

    // Si no hay una ventaja clara, usar las probabilidades calculadas
    if (homeWinProbability > drawProbability && homeWinProbability > awayWinProbability) {
      return "home"
    } else if (awayWinProbability > drawProbability && awayWinProbability > homeWinProbability) {
      return "away"
    } else {
      return "draw"
    }
  }

  // Modificar la función getMostInfluentialFactor para incluir el nuevo factor
  const getMostInfluentialFactor = (prediction: MatchPredictionType): { factor: string; description: string } => {
    const { factors } = prediction

    // Calcular la influencia relativa de cada factor
    const factorInfluence = {
      homeAdvantage: factors.homeAdvantage * 10, // Dar más peso para comparar
      homeForm: factors.homeFormFactor * 5,
      awayForm: factors.awayFormFactor * 5,
      attackDiff: (factors.homeAttackStrength - factors.awayDefenseStrength) * 3,
      defenseDiff: (factors.awayAttackStrength - factors.homeDefenseStrength) * -3, // Negativo porque afecta inversamente
      standingsDiff: factors.standingsFactor * 15, // Dar peso significativo al factor de clasificación
    }

    // Encontrar el factor con mayor influencia
    const entries = Object.entries(factorInfluence)
    const [topFactor] = entries.reduce(
      (max, current) => (Math.abs(current[1]) > Math.abs(max[1]) ? current : max),
      ["none", 0],
    )

    // Generar descripción basada en el factor más influyente
    const homeTeamName = getTeamName(prediction.homeTeamId)
    const awayTeamName = getTeamName(prediction.awayTeamId)

    switch (topFactor) {
      case "homeAdvantage":
        return {
          factor: "Ventaja local",
          description: `${homeTeamName} tiene una fuerte ventaja jugando como local.`,
        }
      case "homeForm":
        return {
          factor: "Forma del local",
          description:
            factors.homeFormFactor > 0
              ? `${homeTeamName} está en buena forma recientemente.`
              : `${homeTeamName} está en mala forma recientemente.`,
        }
      case "awayForm":
        return {
          factor: "Forma del visitante",
          description:
            factors.awayFormFactor > 0
              ? `${awayTeamName} está en buena forma recientemente.`
              : `${awayTeamName} está en mala forma recientemente.`,
        }
      case "attackDiff":
        return {
          factor: "Ataque vs Defensa",
          description:
            factorInfluence.attackDiff > 0
              ? `El ataque de ${homeTeamName} es superior a la defensa de ${awayTeamName}.`
              : `La defensa de ${awayTeamName} es superior al ataque de ${homeTeamName}.`,
        }
      case "defenseDiff":
        return {
          factor: "Defensa vs Ataque",
          description:
            factorInfluence.defenseDiff > 0
              ? `La defensa de ${homeTeamName} es superior al ataque de ${awayTeamName}.`
              : `El ataque de ${awayTeamName} es superior a la defensa de ${homeTeamName}.`,
        }
      case "standingsDiff":
        return {
          factor: "Posición en la tabla",
          description:
            factors.standingsFactor > 0
              ? `${homeTeamName} está mejor posicionado en la clasificación que ${awayTeamName}.`
              : `${awayTeamName} está mejor posicionado en la clasificación que ${homeTeamName}.`,
        }
      default:
        return {
          factor: "Equilibrio",
          description: "Ambos equipos están bastante equilibrados.",
        }
    }
  }

  // Añadir la función para aplicar las predicciones
  const handleApplyPredictions = () => {
    if (predictions.length === 0) {
      toast({
        title: "Error",
        description: "No hay predicciones para aplicar. Genera predicciones primero.",
        variant: "destructive",
      })
      return
    }

    try {
      // Crear un objeto con los resultados predichos
      const predictedResults: Record<number, { home: string; away: string }> = {}

      predictions.forEach((prediction) => {
        predictedResults[prediction.matchId] = {
          home: Math.round(prediction.predictedHomeGoals).toString(),
          away: Math.round(prediction.predictedAwayGoals).toString(),
        }
      })

      console.log("Aplicando predicciones:", predictedResults)

      // Actualizar los resultados temporales
      if (updateTempResults) {
        updateTempResults(predictedResults)
        console.log("Resultados temporales actualizados")
      }

      // Mostrar toast de confirmación
      toast({
        title: "Predicciones aplicadas",
        description: "Se han aplicado las predicciones de la IA a los resultados.",
      })

      // Enviar evento a Google Analytics
      sendGAEvent("apply_predictions", "predictions", "Apply AI predictions button clicked")

      // Cambiar a la pestaña de clasificación
      if (setActiveTab) {
        setActiveTab("standings")
        console.log("Cambiado a pestaña de clasificación")
      }

      // Ejecutar la función de cálculo después de un pequeño retraso
      if (onApplyPredictions) {
        console.log("Llamando a onApplyPredictions")
        // Usar setTimeout para asegurar que los estados se han actualizado
        setTimeout(() => {
          onApplyPredictions()
          console.log("onApplyPredictions ejecutado")
        }, 100)
      }
    } catch (error) {
      console.error("Error al aplicar predicciones:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al aplicar las predicciones.",
        variant: "destructive",
      })
    }
  }

  // En la parte del return, añadir el botón "Aplicar predicciones" junto al botón "Generar predicciones"
  // Buscar la sección donde está el botón "Generar predicciones" y añadir el nuevo botón

  // Modificar la sección:
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Brain className="mr-2 h-5 w-5" />
          Predicciones IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Contenido original de las predicciones */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Predicciones basadas en datos históricos y estadísticas actuales
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generatePredictions} disabled={isLoading} size="sm" className="min-w-[140px]">
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generar predicciones
                  </>
                )}
              </Button>

              {/* Nuevo botón para aplicar predicciones */}
              {predictions.length > 0 && updateTempResults && (
                <Button onClick={handleApplyPredictions} variant="outline" size="sm" className="min-w-[140px]">
                  <Activity className="mr-2 h-4 w-4" />
                  Aplicar predicciones
                </Button>
              )}
            </div>
          </div>

          {predictions.length > 0 && (
            <>
              <Tabs
                defaultValue={activeMatchday?.toString()}
                onValueChange={(value) => setActiveMatchday(Number.parseInt(value))}
                className="w-full"
              >
                <div className="overflow-x-auto -mx-1 px-1">
                  <TabsList className="mb-4 inline-flex h-auto mobile-nav-tabs min-w-full sm:min-w-0">
                    {availableMatchdays.map((matchday) => (
                      <TabsTrigger
                        key={matchday}
                        value={matchday.toString()}
                        className="text-xs sm:text-sm py-1.5 px-3 flex-shrink-0"
                      >
                        J{matchday}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {availableMatchdays.map((matchday) => (
                  <TabsContent key={matchday} value={matchday.toString()} className="mt-0">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {filteredPredictions.length > 0 ? (
                        filteredPredictions.map((prediction) => {
                          const mostLikely = getMostLikelyResult(prediction)

                          return (
                            <motion.div
                              key={prediction.matchId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border rounded-lg p-3 bg-card"
                            >
                              {/* Contenedor principal - mejorado para móviles */}
                              <div className="flex flex-col gap-3">
                                {/* Fila de equipos - mejorada para móviles */}
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center max-w-[40%]">
                                    {getTeamLogo(prediction.homeTeamId) && (
                                      <img
                                        src={getTeamLogo(prediction.homeTeamId) || "/placeholder.svg"}
                                        alt={getTeamName(prediction.homeTeamId)}
                                        className="h-5 w-5 mr-1 flex-shrink-0"
                                      />
                                    )}
                                    <span
                                      className={`font-medium text-sm truncate ${mostLikely === "home" ? "text-primary font-bold" : ""}`}
                                      title={getTeamName(prediction.homeTeamId)}
                                    >
                                      {getTeamName(prediction.homeTeamId)}
                                    </span>
                                  </div>

                                  <span className="mx-1 font-bold text-xs">vs</span>

                                  <div className="flex items-center justify-end max-w-[40%]">
                                    <span
                                      className={`font-medium text-sm truncate ${mostLikely === "away" ? "text-primary font-bold" : ""}`}
                                      title={getTeamName(prediction.awayTeamId)}
                                    >
                                      {getTeamName(prediction.awayTeamId)}
                                    </span>
                                    {getTeamLogo(prediction.awayTeamId) && (
                                      <img
                                        src={getTeamLogo(prediction.awayTeamId) || "/placeholder.svg"}
                                        alt={getTeamName(prediction.awayTeamId)}
                                        className="h-5 w-5 ml-1 flex-shrink-0"
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* Fila de probabilidades - mejorada para móviles */}
                                <div className="flex items-center justify-between gap-1 w-full">
                                  <Badge
                                    variant={mostLikely === "home" ? "default" : "outline"}
                                    className="text-xs whitespace-nowrap flex-1 text-center py-0 h-6"
                                  >
                                    1: {formatProbability(prediction.homeWinProbability)}
                                  </Badge>
                                  <Badge
                                    variant={mostLikely === "draw" ? "default" : "outline"}
                                    className="text-xs whitespace-nowrap flex-1 text-center py-0 h-6"
                                  >
                                    X: {formatProbability(prediction.drawProbability)}
                                  </Badge>
                                  <Badge
                                    variant={mostLikely === "away" ? "default" : "outline"}
                                    className="text-xs whitespace-nowrap flex-1 text-center py-0 h-6"
                                  >
                                    2: {formatProbability(prediction.awayWinProbability)}
                                  </Badge>
                                </div>

                                {/* Fila de resultado y confianza - mejorada para móviles */}
                                <div className="flex justify-between items-center text-sm border-t pt-2">
                                  <div className="text-muted-foreground text-xs">
                                    Resultado más probable:{" "}
                                    <span className="font-medium">
                                      {prediction.predictedHomeGoals} - {prediction.predictedAwayGoals}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Percent className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(prediction.confidence * 100)}%
                                    </span>
                                  </div>
                                </div>

                                {/* Botón de explicación - mejorado para móviles */}
                                {prediction.factors && (
                                  <div className="text-xs">
                                    <button
                                      onClick={() => {
                                        const dialog = document.getElementById(
                                          `explanation-${prediction.matchId}`,
                                        ) as HTMLDialogElement
                                        if (dialog) dialog.showModal()
                                      }}
                                      className="flex items-center text-primary hover:underline text-xs"
                                    >
                                      <Info className="h-3 w-3 mr-1" />
                                      Ver factores de predicción
                                    </button>

                                    <dialog
                                      id={`explanation-${prediction.matchId}`}
                                      className="p-4 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50 w-[90vw] max-w-md m-auto"
                                    >
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                          <h3 className="font-bold text-lg">Factores de predicción</h3>
                                          <button
                                            onClick={() => {
                                              const dialog = document.getElementById(
                                                `explanation-${prediction.matchId}`,
                                              ) as HTMLDialogElement
                                              if (dialog) dialog.close()
                                            }}
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            ✕
                                          </button>
                                        </div>

                                        {/* Mostrar el factor más influyente */}
                                        {(() => {
                                          const { factor, description } = getMostInfluentialFactor(prediction)
                                          return (
                                            <div className="bg-primary/10 p-3 rounded-md">
                                              <div className="font-medium text-sm flex items-center">
                                                <Activity className="h-4 w-4 mr-1 text-primary" />
                                                Factor principal: {factor}
                                              </div>
                                              <p className="text-sm mt-1">{description}</p>
                                            </div>
                                          )
                                        })()}

                                        {/* Mostrar todos los factores en dos columnas: local y visitante */}
                                        <div className="space-y-2 mt-3">
                                          <div className="text-sm font-medium">Todos los factores:</div>

                                          <div className="grid grid-cols-2 gap-2 text-xs">
                                            {/* Columna del equipo local */}
                                            <div className="space-y-2 border-r pr-2">
                                              <div
                                                className="font-medium text-center pb-1 border-b truncate"
                                                title={getTeamName(prediction.homeTeamId)}
                                              >
                                                {getTeamName(prediction.homeTeamId)}
                                              </div>

                                              <div className="flex items-center">
                                                <Home className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Ventaja local:{" "}
                                                </span>
                                                <span className="ml-1 font-medium">
                                                  {(prediction.factors.homeAdvantage * 100).toFixed(0)}%
                                                </span>
                                              </div>

                                              <div className="flex items-center">
                                                <Activity className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Forma:{" "}
                                                </span>
                                                <span
                                                  className={`ml-1 font-medium ${
                                                    prediction.factors.homeFormFactor >= 0
                                                      ? "text-green-600"
                                                      : "text-red-600"
                                                  }`}
                                                >
                                                  {prediction.factors.homeFormFactor >= 0 ? "+" : ""}
                                                  {(prediction.factors.homeFormFactor * 100).toFixed(0)}%
                                                </span>
                                              </div>

                                              <div className="flex items-center">
                                                <Swords className="h-3 w-3 mr-1 text-orange-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Ataque:{" "}
                                                </span>
                                                <span className="ml-1 font-medium">
                                                  {prediction.factors.homeAttackStrength.toFixed(2)}x
                                                </span>
                                              </div>

                                              <div className="flex items-center">
                                                <Shield className="h-3 w-3 mr-1 text-indigo-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Defensa:{" "}
                                                </span>
                                                <span className="ml-1 font-medium">
                                                  {prediction.factors.homeDefenseStrength.toFixed(2)}x
                                                </span>
                                              </div>

                                              {/* Añadir el factor de clasificación */}
                                              <div className="flex items-center">
                                                <TrendingUp className="h-3 w-3 mr-1 text-purple-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Clasificación:{" "}
                                                </span>
                                                <span
                                                  className={`ml-1 font-medium ${
                                                    prediction.factors.standingsFactor >= 0
                                                      ? "text-green-600"
                                                      : "text-red-600"
                                                  }`}
                                                >
                                                  {prediction.factors.standingsFactor >= 0 ? "+" : ""}
                                                  {(prediction.factors.standingsFactor * 100).toFixed(0)}%
                                                </span>
                                              </div>
                                            </div>

                                            {/* Columna del equipo visitante */}
                                            <div className="space-y-2 pl-2">
                                              <div
                                                className="font-medium text-center pb-1 border-b truncate"
                                                title={getTeamName(prediction.awayTeamId)}
                                              >
                                                {getTeamName(prediction.awayTeamId)}
                                              </div>

                                              <div className="flex items-center">
                                                <Activity className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Forma:{" "}
                                                </span>
                                                <span
                                                  className={`ml-1 font-medium ${
                                                    prediction.factors.awayFormFactor >= 0
                                                      ? "text-green-600"
                                                      : "text-red-600"
                                                  }`}
                                                >
                                                  {prediction.factors.awayFormFactor >= 0 ? "+" : ""}
                                                  {(prediction.factors.awayFormFactor * 100).toFixed(0)}%
                                                </span>
                                              </div>

                                              <div className="flex items-center">
                                                <Swords className="h-3 w-3 mr-1 text-orange-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Ataque:{" "}
                                                </span>
                                                <span className="ml-1 font-medium">
                                                  {prediction.factors.awayAttackStrength.toFixed(2)}x
                                                </span>
                                              </div>

                                              <div className="flex items-center">
                                                <Shield className="h-3 w-3 mr-1 text-indigo-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Defensa:{" "}
                                                </span>
                                                <span className="ml-1 font-medium">
                                                  {prediction.factors.awayDefenseStrength.toFixed(2)}x
                                                </span>
                                              </div>

                                              {/* Añadir el factor de clasificación inverso para el equipo visitante */}
                                              <div className="flex items-center">
                                                <TrendingUp className="h-3 w-3 mr-1 text-purple-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                  Clasificación:{" "}
                                                </span>
                                                <span
                                                  className={`ml-1 font-medium ${
                                                    prediction.factors.standingsFactor <= 0
                                                      ? "text-green-600"
                                                      : "text-red-600"
                                                  }`}
                                                >
                                                  {prediction.factors.standingsFactor <= 0 ? "+" : ""}
                                                  {(prediction.factors.standingsFactor * -100).toFixed(0)}%
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Historial directo oculto temporalmente */}
                                          {/*{prediction.factors.headToHead && (
                                            <div className="mt-2 pt-2 border-t">
                                              <div className="text-sm font-medium">Historial directo:</div>
                                              <p className="text-xs mt-1">{prediction.factors.headToHead}</p>
                                            </div>
                                          )}*/}
                                        </div>
                                      </div>
                                    </dialog>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )
                        })
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            No hay partidos disponibles para predecir en esta jornada
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                <p>
                  <strong>Nota:</strong> Estas predicciones son orientativas y se basan en un análisis estadístico de
                  datos históricos. Los resultados reales pueden variar.
                </p>
              </div>
            </>
          )}

          {predictions.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">
                Haz clic en "Generar predicciones" para analizar los próximos partidos
              </p>
              <p className="text-xs text-muted-foreground max-w-md">
                El sistema utilizará datos históricos, estadísticas actuales y un modelo de aprendizaje para predecir
                los resultados más probables
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
