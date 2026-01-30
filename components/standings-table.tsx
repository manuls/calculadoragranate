"use client"

import { useState, useEffect } from "react"
import type { Team } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUp, ArrowDown, Minus, LayoutList, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWindowSize } from "@/hooks/use-window-size"
import EnhancedShareButtons from "./enhanced-share-buttons"
import { cn } from "@/lib/utils"

interface StandingsTableProps {
  teams: Team[]
  initialStandings: Team[] // Clasificación inicial basada en resultados oficiales
  resetSimulation: () => void
  lastCalculated: Date | null
  className?: string
}

export default function StandingsTable({
  teams,
  initialStandings,
  resetSimulation,
  lastCalculated,
  className,
}: StandingsTableProps) {
  const [compactView, setCompactView] = useState(true) // Por defecto vista compacta
  const { isMobile } = useWindowSize()

  // Estado para almacenar los cambios de posición calculados
  const [positionChanges, setPositionChanges] = useState<Record<number, number>>({})

  // Calcular los cambios de posición cuando cambian los equipos o la clasificación inicial
  useEffect(() => {
    if (teams.length > 0 && initialStandings.length > 0) {
      const changes: Record<number, number> = {}

      teams.forEach((team, currentIndex) => {
        // Encontrar la posición del equipo en la clasificación inicial
        const initialIndex = initialStandings.findIndex((t) => t.id === team.id)

        // Si se encuentra el equipo, calcular el cambio
        if (initialIndex !== -1) {
          // Si initialIndex > currentIndex, el equipo ha subido
          // Si initialIndex < currentIndex, el equipo ha bajado
          changes[team.id] = initialIndex - currentIndex
        } else {
          changes[team.id] = 0
        }
      })

      console.log("Cambios de posición calculados:", changes)
      setPositionChanges(changes)
    }
  }, [teams, initialStandings])

  const getPositionColor = (position: number, index: number) => {
    if (position === 1) return "bg-green-100 dark:bg-green-900 dark:bg-opacity-50"
    if (position >= 2 && position <= 5) return "bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50"
    if (position >= 16 && position <= 20) return "bg-red-100 dark:bg-red-900 dark:bg-opacity-50"
    return index % 2 === 0 ? "bg-primary/5" : ""
  }

  // Función para mostrar el nombre del equipo según el tamaño de pantalla
  const renderTeamName = (name: string) => {
    if (name.length <= 15) return name

    return (
      <>
        <span className="hidden sm:inline">{name}</span>
        <span className="sm:hidden">{name.substring(0, 10) + "..."}</span>
      </>
    )
  }

  const getPositionChangeAnimation = (teamId: number) => {
    const change = positionChanges[teamId] || 0

    if (change > 3) {
      return "animate-bounce-up-big"
    } else if (change > 0) {
      return "animate-bounce-up"
    } else if (change < -3) {
      return "animate-bounce-down-big"
    } else if (change < 0) {
      return "animate-bounce-down"
    }

    return ""
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl font-semibold text-primary">Tabla de Clasificación</h2>
        <div className="flex flex-wrap items-center gap-2 mobile-action-buttons">
          <Button variant="outline" size="sm" onClick={() => setCompactView(!compactView)} className="h-8 px-2 text-xs">
            {compactView ? <LayoutList className="h-3.5 w-3.5 mr-1" /> : <LayoutGrid className="h-3.5 w-3.5 mr-1" />}
            {compactView ? "Detallada" : "Compacta"}
          </Button>
          <EnhancedShareButtons teams={teams} currentUrl={typeof window !== "undefined" ? window.location.href : ""} />
        </div>
      </div>

      <div className="rounded-md border border-primary overflow-hidden">
        <div className="overflow-x-auto">
          {compactView ? (
            // Vista compacta
            <table className="w-full border-collapse mobile-compact-table">
              <thead>
                <tr className="bg-primary">
                  <th className="w-12 text-primary-foreground p-1 sm:p-2 text-center">Pos</th>
                  <th className="w-8 text-primary-foreground p-1 sm:p-2 text-center"></th>
                  <th className="text-primary-foreground p-1 sm:p-2 text-left">Equipo</th>
                  <th className="text-primary-foreground p-1 sm:p-2 text-center">PJ</th>
                  <th className="text-primary-foreground p-1 sm:p-2 text-center">GF</th>
                  <th className="text-primary-foreground p-1 sm:p-2 text-center">GC</th>
                  <th className="text-primary-foreground p-1 sm:p-2 text-center">DG</th>
                  <th className="text-primary-foreground p-1 sm:p-2 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => {
                  const rowColorClass = getPositionColor(index + 1, index)
                  const positionChange = positionChanges[team.id] || 0

                  return (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      }}
                      layout
                      className={`border-b border-primary/20 ${rowColorClass}`}
                    >
                      <td className="font-medium text-center p-1 sm:p-2">{index + 1}</td>
                      <td className="text-center p-1 sm:p-2">
                        {positionChange > 0 ? (
                          <ArrowUp
                            className={`h-4 w-4 text-green-600 mx-auto ${getPositionChangeAnimation(team.id)}`}
                          />
                        ) : positionChange < 0 ? (
                          <ArrowDown
                            className={`h-4 w-4 text-red-600 mx-auto ${getPositionChangeAnimation(team.id)}`}
                          />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="font-medium p-1 sm:p-2">
                        <div className="flex items-center space-x-2">
                          {team.logoUrl && (
                            <Image
                              src={team.logoUrl || "/placeholder.svg"}
                              alt={"Escudo de " + team.name}
                              width={20}
                              height={20}
                              className="rounded-full hidden sm:block"
                            />
                          )}
                          <span className={team.name === "Pontevedra CF" ? "font-bold" : ""}>
                            {renderTeamName(team.name)}
                          </span>
                        </div>
                      </td>
                      <td className="text-center p-1 sm:p-2">{team.played}</td>
                      <td className="text-center p-1 sm:p-2">{team.goalsFor}</td>
                      <td className="text-center p-1 sm:p-2">{team.goalsAgainst}</td>
                      <td className="text-center p-1 sm:p-2">{team.goalsFor - team.goalsAgainst}</td>
                      <td className="text-center font-bold p-1 sm:p-2">{team.points}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            // Vista detallada
            <table className="w-full" style={{ minWidth: "800px" }}>
              <thead>
                <tr className="bg-primary">
                  <th className="w-12 text-primary-foreground p-2 text-center">Pos</th>
                  <th className="w-10 text-primary-foreground p-2 text-center"></th>
                  <th className="text-primary-foreground p-2 text-left">Equipo</th>
                  <th className="text-primary-foreground p-2 text-center w-12">PJ</th>
                  <th className="text-primary-foreground p-2 text-center w-12">G</th>
                  <th className="text-primary-foreground p-2 text-center w-12">E</th>
                  <th className="text-primary-foreground p-2 text-center w-12">P</th>
                  <th className="text-primary-foreground p-2 text-center w-12">GF</th>
                  <th className="text-primary-foreground p-2 text-center w-12">GC</th>
                  <th className="text-primary-foreground p-2 text-center w-12">DG</th>
                  <th className="text-primary-foreground p-2 text-center w-16">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => {
                  const positionChange = positionChanges[team.id] || 0
                  const rowColorClass = getPositionColor(index + 1, index)

                  return (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      }}
                      layout
                      className={`${rowColorClass} hover:bg-primary/10`}
                    >
                      <td className="font-medium text-center p-2 border-b">{index + 1}</td>
                      <td className="p-2 border-b text-center">
                        {positionChange > 0 ? (
                          <ArrowUp
                            className={`h-4 w-4 text-green-600 mx-auto ${getPositionChangeAnimation(team.id)}`}
                          />
                        ) : positionChange < 0 ? (
                          <ArrowDown
                            className={`h-4 w-4 text-red-600 mx-auto ${getPositionChangeAnimation(team.id)}`}
                          />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="font-medium p-2 border-b">
                        <div className="flex items-center space-x-2">
                          {team.logoUrl ? (
                            <Image
                              src={team.logoUrl || "/placeholder.svg"}
                              alt={"Escudo de " + team.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          )}
                          <span className={`text-sm ${team.name === "Pontevedra CF" ? "font-bold" : ""}`}>
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center p-2 border-b text-sm">{team.played}</td>
                      <td className="text-center p-2 border-b text-sm">{team.won}</td>
                      <td className="text-center p-2 border-b text-sm">{team.drawn}</td>
                      <td className="text-center p-2 border-b text-sm">{team.lost}</td>
                      <td className="text-center p-2 border-b text-sm">{team.goalsFor}</td>
                      <td className="text-center p-2 border-b text-sm">{team.goalsAgainst}</td>
                      <td className="text-center p-2 border-b text-sm">{team.goalsFor - team.goalsAgainst}</td>
                      <td className="text-center font-bold p-2 border-b text-sm">{team.points}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>PJ: Partidos jugados, G: Ganados, E: Empatados, P: Perdidos</p>
        <p>GF: Goles a favor, GC: Goles en contra, DG: Diferencia de goles, Pts: Puntos</p>
      </div>
      <div className="text-sm mt-4 flex flex-wrap gap-2">
        <p className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 dark:bg-opacity-50 rounded text-xs sm:text-sm">
          Ascenso directo
        </p>
        <p className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 rounded text-xs sm:text-sm">
          Playoff de ascenso
        </p>
        <p className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900 dark:bg-opacity-50 rounded text-xs sm:text-sm">
          Descenso
        </p>
      </div>
    </div>
  )
}
