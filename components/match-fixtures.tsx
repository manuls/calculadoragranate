"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import type { Match, Team } from "@/lib/types"
import { cn } from "@/lib/utils"
import { PONTEVEDRA_TEAM_ID } from "@/lib/constants"

interface MatchFixturesProps {
  fixtures: Match[]
  teams: Team[]
  tempResults: Record<number, { home: string; away: string }>
  updateTempResult: (matchId: number, team: "home" | "away", value: string) => void
  className?: string
}

export default function MatchFixtures({
  fixtures,
  teams,
  tempResults,
  updateTempResult,
  className,
}: MatchFixturesProps) {
  const [activeTab, setActiveTab] = useState("")
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

  const featuredTeamIds = useMemo(
    () => new Set([PONTEVEDRA_TEAM_ID, ...teams.slice(0, 5).map((team) => team.id)]),
    [teams],
  )

  // Filtrar partidos para mostrar solo los del Pontevedra y sus rivales directos
  const filterTopTeams = (match: Match) => {
    if (!showTopTeamsOnly) return true
    return featuredTeamIds.has(match.homeTeamId) || featuredTeamIds.has(match.awayTeamId)
  }

  // Agrupar partidos por jornada
  const matchdayGroups = useMemo(
    () =>
      fixtures.reduce(
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
      ),
    [fixtures, showTopTeamsOnly, featuredTeamIds],
  )

  const getLatestStoredMatchday = (matchdays: string[]) => {
    const matchdaysWithStoredResults = matchdays.filter((matchday) =>
      matchdayGroups[matchday].some((match) => match.locked && match.result),
    )

    return matchdaysWithStoredResults.at(-1) ?? null
  }

  const getFirstPlayableMatchday = (matchdays: string[]) => {
    return matchdays.find((matchday) => matchdayGroups[matchday].some((match) => !match.locked)) ?? null
  }

  // Priorizar la ultima jornada con resultados almacenados solo como seleccion inicial.
  useEffect(() => {
    const keys = Object.keys(matchdayGroups)
    if (keys.length === 0) return

    const sorted = keys.sort((a, b) => Number(a) - Number(b))
    const latestStoredMatchday = getLatestStoredMatchday(sorted)
    const firstPlayableMatchday = getFirstPlayableMatchday(sorted)
    const preferredMatchday = latestStoredMatchday || firstPlayableMatchday || sorted[0]

    if (!activeTab) {
      setActiveTab(preferredMatchday)
      return
    }

    if (!matchdayGroups[activeTab]) {
      setActiveTab(preferredMatchday)
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
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-primary">Partidos Pendientes y Aplazados</h2>
        <div className="flex items-start space-x-2 rounded-lg border p-3 sm:border-0 sm:p-0">
          <Checkbox
            id="show-top-teams"
            checked={showTopTeamsOnly}
            onCheckedChange={(checked) => setShowTopTeamsOnly(checked as boolean)}
          />
          <label
            htmlFor="show-top-teams"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar solo Pontevedra y rivales directos
          </label>
        </div>
      </div>

      <Alert className="py-2 sm:py-3">
        <AlertDescription className="text-sm">
          La calculadora parte de la clasificación oficial tras la jornada 33. Puedes simular todo el
          calendario desde la jornada 34 hasta el final.
          <p className="mt-2 text-xs italic">
            * Para contrastar calendario y resultados publicados, puedes consultar{" "}
            <a
              href="https://www.bdfutbol.com/es/t/t2025-261rf1.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              BDFutbol
            </a>{" "}
            y la web oficial de la RFEF cuando esté accesible.
          </p>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <TabsList className="inline-flex whitespace-nowrap mobile-nav-tabs">
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
                    <CardContent className="p-3 sm:p-4">
                      <div className="mobile-fixture-card flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center">
                        <div
                          className="text-left sm:text-right sm:pr-2 truncate sm:flex-1 cursor-pointer w-full sm:w-auto"
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
                        <div className="flex items-center justify-center space-x-2 sm:mx-2 relative">
                          <Input
                            type="number"
                            min="0"
                            className={`w-12 sm:w-12 text-center no-spinner h-10 sm:h-10 px-1 sm:px-2 text-base ${
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
                            className={`w-12 sm:w-12 text-center no-spinner h-10 sm:h-10 px-1 sm:px-2 text-base ${
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
                          className="text-left sm:text-left sm:pl-2 truncate sm:flex-1 cursor-pointer w-full sm:w-auto"
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
