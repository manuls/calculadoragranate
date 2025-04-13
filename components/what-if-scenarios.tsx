"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle, TrendingUp, Award } from "lucide-react"
import type { Team, Match, ScenarioConfig, ScenarioResult } from "@/lib/types"
import { motion } from "framer-motion"

interface WhatIfScenariosProps {
  teams: Team[]
  fixtures: Match[]
  calculateScenario: (scenario: ScenarioConfig) => ScenarioResult
}

export default function WhatIfScenarios({ teams, fixtures, calculateScenario }: WhatIfScenariosProps) {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [scenarioType, setScenarioType] = useState<"promotion" | "relegation" | "points" | "position">("promotion")
  const [targetPoints, setTargetPoints] = useState<number>(0)
  const [targetPosition, setTargetPosition] = useState<number>(1)
  const [result, setResult] = useState<ScenarioResult | null>(null)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

  const handleCalculate = () => {
    if (!selectedTeam) return

    setIsCalculating(true)

    // Configuracion del escenario
    const config: ScenarioConfig = {
      type: scenarioType,
      teamId: selectedTeam,
    }

    if (scenarioType === "points") {
      config.targetPoints = targetPoints
    }

    if (scenarioType === "position") {
      config.targetPosition = targetPosition
    }

    // Calcular el escenario
    const scenarioResult = calculateScenario(config)

    // Actualizar el estado con el resultado
    setResult(scenarioResult)
    setIsCalculating(false)
  }

  // Obtener el nombre del equipo por ID
  const getTeamName = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Equipo desconocido"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          Que pasaria si
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-select">Selecciona un equipo</Label>
            <Select value={selectedTeam?.toString() || ""} onValueChange={(value) => setSelectedTeam(Number(value))}>
              <SelectTrigger id="team-select">
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

          <div className="space-y-2">
            <Label htmlFor="scenario-type">Tipo de escenario</Label>
            <Select value={scenarioType} onValueChange={(value) => setScenarioType(value as any)}>
              <SelectTrigger id="scenario-type">
                <SelectValue placeholder="Selecciona un escenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotion">Que necesita para ascender</SelectItem>
                <SelectItem value="relegation">Que necesita para evitar el descenso</SelectItem>
                <SelectItem value="points">Como llegar a X puntos</SelectItem>
                <SelectItem value="position">Como llegar a la posicion X</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scenarioType === "points" && (
            <div className="space-y-2">
              <Label htmlFor="target-points">Puntos objetivo</Label>
              <Input
                id="target-points"
                type="number"
                min="0"
                value={targetPoints}
                onChange={(e) => setTargetPoints(Number(e.target.value))}
              />
            </div>
          )}

          {scenarioType === "position" && (
            <div className="space-y-2">
              <Label htmlFor="target-position">Posicion objetivo</Label>
              <Input
                id="target-position"
                type="number"
                min="1"
                max={teams.length}
                value={targetPosition}
                onChange={(e) => setTargetPosition(Number(e.target.value))}
              />
            </div>
          )}

          <Button onClick={handleCalculate} disabled={!selectedTeam || isCalculating} className="w-full">
            Calcular escenario
          </Button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 p-4 border rounded-md bg-muted/20"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                {result.possible ? (
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <Award className="mr-2 h-5 w-5 text-amber-500" />
                )}
                Resultado del escenario
              </h3>
              <p className="mb-4">{result.message}</p>

              {result.pointsNeeded && (
                <p className="mb-2">
                  <span className="font-medium">Puntos necesarios:</span> {result.pointsNeeded}
                </p>
              )}

              {result.currentGap !== undefined && (
                <p className="mb-2">
                  <span className="font-medium">Diferencia actual:</span> {result.currentGap} puntos
                </p>
              )}

              {result.requiredResults.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Resultados necesarios:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.requiredResults.map((match) => (
                      <div
                        key={match.matchId}
                        className="p-2 bg-background rounded border flex justify-between items-center"
                      >
                        <span>{getTeamName(match.homeTeamId)}</span>
                        <span className="font-bold mx-2">
                          {match.requiredResult.homeGoals} - {match.requiredResult.awayGoals}
                        </span>
                        <span>{getTeamName(match.awayTeamId)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
