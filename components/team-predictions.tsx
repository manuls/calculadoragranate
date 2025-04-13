"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
// Añadir un nuevo import para el icono de "Zona Tranquila"
import { Trophy, TrendingUp, TrendingDown, AlertTriangle, BarChart2, Shield } from "lucide-react"
import { motion } from "framer-motion"
import type { Team, Match } from "@/lib/types"

interface TeamPredictionsProps {
  teams: Team[]
  fixtures: Match[]
}

export default function TeamPredictions({ teams, fixtures }: TeamPredictionsProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("")
  // Actualizar la interfaz de predicciones para incluir la zona tranquila
  const [predictions, setPredictions] = useState<{
    directPromotion: number
    playoffPromotion: number
    zonaTranquila: number
    playoutRelegation: number
    relegation: number
    averagePosition: number
    maxPoints: number
    minPoints: number
  } | null>(null)

  // Función para enviar evento a Google Analytics
  const sendGAEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
      })
    }
  }

  // Manejar cambio de equipo seleccionado
  const handleTeamChange = (value: string) => {
    setSelectedTeamId(value)

    // Enviar evento a Google Analytics
    if (value) {
      const teamName = teams.find((t) => t.id === Number.parseInt(value))?.name || "Unknown team"
      sendGAEvent("select_team_predictions", "predictions", `Team selected: ${teamName}`)
    }
  }

  // Calcular predicciones cuando cambia el equipo seleccionado
  useEffect(() => {
    if (!selectedTeamId) {
      setPredictions(null)
      return
    }

    const teamId = Number.parseInt(selectedTeamId)
    calculatePredictions(teamId)
  }, [selectedTeamId, teams, fixtures])

  // Actualizar la función calculatePredictions para incluir la zona tranquila
  const calculatePredictions = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    // Obtener partidos restantes del equipo
    const remainingMatches = fixtures.filter(
      (match) => (match.homeTeamId === teamId || match.awayTeamId === teamId) && !match.result && !match.locked,
    )

    // Calcular puntos máximos posibles (ganando todos los partidos restantes)
    const maxPossiblePoints = team.points + remainingMatches.length * 3

    // Calcular puntos mínimos posibles (perdiendo todos los partidos restantes)
    const minPossiblePoints = team.points

    // Realizar simulaciones para calcular probabilidades
    const simulations = 1000
    let directPromotionCount = 0
    let playoffPromotionCount = 0
    let zonaTranquilaCount = 0
    let playoutRelegationCount = 0
    let relegationCount = 0
    let positionSum = 0

    for (let i = 0; i < simulations; i++) {
      const simulatedTable = simulateRemainingMatches()
      const position = simulatedTable.findIndex((t) => t.id === teamId) + 1

      positionSum += position

      if (position === 1) directPromotionCount++
      if (position >= 2 && position <= 5) playoffPromotionCount++
      if (position >= 6 && position <= 12) zonaTranquilaCount++
      if (position === 13) playoutRelegationCount++
      if (position >= 14) relegationCount++
    }

    setPredictions({
      directPromotion: (directPromotionCount / simulations) * 100,
      playoffPromotion: ((directPromotionCount + playoffPromotionCount) / simulations) * 100,
      zonaTranquila: (zonaTranquilaCount / simulations) * 100,
      playoutRelegation: (playoutRelegationCount / simulations) * 100,
      relegation: (relegationCount / simulations) * 100,
      averagePosition: positionSum / simulations,
      maxPoints: maxPossiblePoints,
      minPoints: minPossiblePoints,
    })
  }

  // Función para simular los resultados de los partidos restantes
  const simulateRemainingMatches = () => {
    // Crear una copia profunda de los equipos
    const simulatedTeams = JSON.parse(JSON.stringify(teams))

    // Obtener partidos sin resultados
    const remainingMatches = fixtures.filter((match) => !match.result && !match.locked)

    // Simular resultados para cada partido
    remainingMatches.forEach((match) => {
      const homeTeam = simulatedTeams.find((t: Team) => t.id === match.homeTeamId)
      const awayTeam = simulatedTeams.find((t: Team) => t.id === match.awayTeamId)

      if (!homeTeam || !awayTeam) return

      // Calcular probabilidades basadas en la fuerza relativa de los equipos
      const homeStrength = homeTeam.points / homeTeam.played
      const awayStrength = awayTeam.points / awayTeam.played
      const totalStrength = homeStrength + awayStrength

      // Añadir ventaja local
      const homeWinProb = homeStrength / totalStrength + 0.1
      const drawProb = 0.25
      const awayWinProb = 1 - homeWinProb - drawProb

      // Generar resultado aleatorio basado en probabilidades
      const random = Math.random()

      // Actualizar estadísticas según el resultado
      if (random < homeWinProb) {
        // Victoria local
        homeTeam.played++
        awayTeam.played++
        homeTeam.won++
        awayTeam.lost++
        homeTeam.points += 3

        // Goles (simplificado)
        homeTeam.goalsFor += 2
        homeTeam.goalsAgainst += 1
        awayTeam.goalsFor += 1
        awayTeam.goalsAgainst += 2
      } else if (random < homeWinProb + drawProb) {
        // Empate
        homeTeam.played++
        awayTeam.played++
        homeTeam.drawn++
        awayTeam.drawn++
        homeTeam.points += 1
        awayTeam.points += 1

        // Goles (simplificado)
        homeTeam.goalsFor += 1
        homeTeam.goalsAgainst += 1
        awayTeam.goalsFor += 1
        awayTeam.goalsAgainst += 1
      } else {
        // Victoria visitante
        homeTeam.played++
        awayTeam.played++
        homeTeam.lost++
        awayTeam.won++
        homeTeam.points += 3

        // Goles (simplificado)
        homeTeam.goalsFor += 1
        homeTeam.goalsAgainst += 2
        awayTeam.goalsFor += 2
        awayTeam.goalsAgainst += 1
      }
    })

    // Ordenar equipos por puntos y diferencia de goles
    return simulatedTeams.sort((a: Team, b: Team) => {
      if (a.points !== b.points) {
        return b.points - a.points
      }
      const aDiff = a.goalsFor - a.goalsAgainst
      const bDiff = b.goalsFor - b.goalsAgainst
      return bDiff - aDiff
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          <span className="sm:inline">Objetivos del Equipo</span>
          <span className="inline sm:hidden">Objetivos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecciona un equipo</label>
          <Select value={selectedTeamId} onValueChange={handleTeamChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un equipo" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {predictions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Ascenso directo</span>
                  </div>
                  <span className="font-bold">{predictions.directPromotion.toFixed(1)}%</span>
                </div>
                <Progress
                  value={predictions.directPromotion}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Playoff de ascenso</span>
                  </div>
                  <span className="font-bold">{predictions.playoffPromotion.toFixed(1)}%</span>
                </div>
                <Progress
                  value={predictions.playoffPromotion}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="font-medium">Zona tranquila</span>
                  </div>
                  <span className="font-bold">{predictions.zonaTranquila.toFixed(1)}%</span>
                </div>
                <Progress
                  value={predictions.zonaTranquila}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-purple-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="font-medium">Play out de descenso</span>
                  </div>
                  <span className="font-bold">{predictions.playoutRelegation.toFixed(1)}%</span>
                </div>
                <Progress
                  value={predictions.playoutRelegation}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                    <span className="font-medium">Descenso</span>
                  </div>
                  <span className="font-bold">{predictions.relegation.toFixed(1)}%</span>
                </div>
                <Progress value={predictions.relegation} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Posición media</div>
                <div className="text-2xl font-bold">{predictions.averagePosition.toFixed(1)}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Puntos mínimos</div>
                <div className="text-2xl font-bold">{predictions.minPoints}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Puntos máximos</div>
                <div className="text-2xl font-bold">{predictions.maxPoints}</div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground pt-4 border-t">
              <p>
                <strong>Nota:</strong> Estas predicciones se basan en simulaciones estadísticas y pueden variar. Se han
                realizado 1000 simulaciones de los partidos restantes para calcular las probabilidades.
              </p>
            </div>
          </motion.div>
        )}

        {!predictions && selectedTeamId && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p>Calculando predicciones...</p>
          </div>
        )}

        {!selectedTeamId && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecciona un equipo para ver sus predicciones</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
