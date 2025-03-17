"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import type { Match, Team } from "@/lib/types"

interface MatchFixturesProps {
  fixtures: Match[]
  teams: Team[]
  tempResults: Record<number, { home: string; away: string }>
  updateTempResult: (matchId: number, team: "home" | "away", value: string) => void
}

export default function MatchFixtures({ fixtures, teams, tempResults, updateTempResult }: MatchFixturesProps) {
  const [activeTab, setActiveTab] = useState("20")
  const [showTopTeamsOnly, setShowTopTeamsOnly] = useState(false)
  const [highlightedTeamId, setHighlightedTeamId] = useState<number | null>(null)

  // Obtener el nombre del equipo por ID
  const getTeamName = (teamId: number, abbreviated = false) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return "Equipo desconocido"

    // Si se solicita abreviado y el nombre es largo, abreviarlo
    if (abbreviated && team.name.length > 12) {
      const words = team.name.split(" ")
      if (words.length > 1) {
        // Si tiene más de una palabra, usar iniciales o abreviar
        if (words.length > 2) {
          return words.map((word) => word[0]).join("")
        } else {
          return words[0].substring(0, 3) + ". " + words[1].substring(0, 3) + "."
        }
      }
      return team.name.substring(0, 10) + "..."
    }

    return team.name
  }

  // Filtrar partidos para mostrar solo los de Pontevedra CF y CD Numancia
  const filterTopTeams = (match: Match) => {
    if (!showTopTeamsOnly) return true
    const topTeamIds = [1, 2] // IDs de Pontevedra CF y CD Numancia
    return topTeamIds.includes(match.homeTeamId) || topTeamIds.includes(match.awayTeamId)
  }

  // Agrupar partidos por jornada
  const matchdayGroups = fixtures.reduce(
    (groups, match) => {
      if (filterTopTeams(match)) {
        const matchday = match.matchday.toString()
        if (!groups[matchday]) {
          groups[matchday] = []
        }
        groups[matchday].push(match)
      }
      return groups
    },
    {} as Record<string, Match[]>,
  )

  // Detectar automáticamente la primera jornada disponible
  useEffect(() => {
    if (Object.keys(matchdayGroups).length > 0 && !matchdayGroups[activeTab]) {
      setActiveTab(Object.keys(matchdayGroups)[0])
    }
  }, [matchdayGroups, activeTab])

  // Función para resaltar un equipo al hacer hover
  const handleTeamHover = (teamId: number) => {
    setHighlightedTeamId(teamId)
  }

  const handleTeamLeave = () => {
    setHighlightedTeamId(null)
  }

  // Verificar si un partido tiene resultados
  const hasResult = (matchId: number) => {
    return tempResults[matchId]?.home !== undefined && tempResults[matchId]?.away !== undefined
  }

  // Verificar si una jornada tiene partidos con resultados o bloqueados
  const hasMatchdayResults = (matchday: string) => {
    return matchdayGroups[matchday].some((match) => hasResult(match.id) || match.locked)
  }

  // Verificar si una jornada tiene partidos bloqueados
  const hasLockedMatches = (matchday: string) => {
    return matchdayGroups[matchday].some((match) => match.locked)
  }

  // Ordenar las jornadas numéricamente
  const sortedMatchdays = Object.keys(matchdayGroups).sort((a, b) => Number(a) - Number(b))

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl font-semibold text-primary">Partidos Pendientes</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-top-teams"
            checked={showTopTeamsOnly}
            onCheckedChange={(checked) => setShowTopTeamsOnly(checked as boolean)}
          />
          <label
            htmlFor="show-top-teams"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar solo partidos de las primeras posiciones
          </label>
        </div>
      </div>

      <Alert className="py-2">
        <AlertDescription className="text-sm">
          Bienvenido/a a la Calculadora Granate. Aquí puedes predecir todos los partidos hasta final de liga y ver la
          clasificación final. No es necesario que rellenes todos los resultados.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <TabsList className="inline-flex whitespace-nowrap">
            {sortedMatchdays.map((matchday) => {
              const hasResults = hasMatchdayResults(matchday)
              const hasLocked = hasLockedMatches(matchday)

              // Determinar la clase de estilo basada en si hay resultados o partidos bloqueados
              let tabClass = "tab-inactive data-[state=active]:tab-active"

              if (hasLocked) {
                // Si hay partidos bloqueados, usar un fondo azul
                tabClass += " bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60"
              } else if (hasResults) {
                // Si solo hay resultados (no bloqueados), usar un fondo verde
                tabClass += " bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-800/60"
              }

              return (
                <TabsTrigger key={matchday} value={matchday} className={tabClass}>
                  J{matchday}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {sortedMatchdays.map((matchday) => (
          <TabsContent key={matchday} value={matchday} className="mt-4">
            <div className="space-y-3">
              {matchdayGroups[matchday].map((match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    key={match.id}
                    className={`
                      ${
                        highlightedTeamId === match.homeTeamId || highlightedTeamId === match.awayTeamId
                          ? "ring-2 ring-primary/50"
                          : ""
                      }
                      ${hasResult(match.id) && !match.locked ? "bg-green-50 dark:bg-green-900/20" : ""}
                      ${match.locked ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : ""}
                      transition-all duration-200
                    `}
                  >
                    <CardContent className="p-2 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div
                          className="text-center sm:text-right sm:pr-2 truncate mb-1 sm:mb-0 sm:flex-1 cursor-pointer w-full sm:w-auto"
                          onMouseEnter={() => handleTeamHover(match.homeTeamId)}
                          onMouseLeave={handleTeamLeave}
                        >
                          <span
                            className={`
                            ${getTeamName(match.homeTeamId) === "Pontevedra CF" ? "font-bold" : ""}
                            ${highlightedTeamId === match.homeTeamId ? "text-primary" : ""}
                          `}
                          >
                            <span className="hidden sm:inline">{getTeamName(match.homeTeamId)}</span>
                            <span className="sm:hidden">{getTeamName(match.homeTeamId, true)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mx-2 relative">
                          <Input
                            type="number"
                            min="0"
                            className={`w-10 sm:w-12 text-center no-spinner h-8 sm:h-10 px-1 sm:px-2 ${
                              match.locked
                                ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                : "bg-background dark:bg-secondary"
                            }`}
                            value={
                              match.locked && match.result ? match.result.homeGoals : tempResults[match.id]?.home || ""
                            }
                            onChange={(e) => updateTempResult(match.id, "home", e.target.value)}
                            disabled={match.locked}
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            min="0"
                            className={`w-10 sm:w-12 text-center no-spinner h-8 sm:h-10 px-1 sm:px-2 ${
                              match.locked
                                ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                : "bg-background dark:bg-secondary"
                            }`}
                            value={
                              match.locked && match.result ? match.result.awayGoals : tempResults[match.id]?.away || ""
                            }
                            onChange={(e) => updateTempResult(match.id, "away", e.target.value)}
                            disabled={match.locked}
                          />
                        </div>
                        <div
                          className="text-center sm:text-left sm:pl-2 truncate mt-1 sm:mt-0 sm:flex-1 cursor-pointer w-full sm:w-auto"
                          onMouseEnter={() => handleTeamHover(match.awayTeamId)}
                          onMouseLeave={handleTeamLeave}
                        >
                          <span
                            className={`
                            ${getTeamName(match.awayTeamId) === "Pontevedra CF" ? "font-bold" : ""}
                            ${highlightedTeamId === match.awayTeamId ? "text-primary" : ""}
                          `}
                          >
                            <span className="hidden sm:inline">{getTeamName(match.awayTeamId)}</span>
                            <span className="sm:hidden">{getTeamName(match.awayTeamId, true)}</span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

