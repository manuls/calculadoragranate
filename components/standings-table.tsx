"use client"

import { useState } from "react"
import type { Team } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUp, ArrowDown, Minus, LayoutList, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWindowSize } from "@/hooks/use-window-size"

interface StandingsTableProps {
  teams: Team[]
  resetSimulation: () => void
  lastCalculated: Date | null
}

export default function StandingsTable({ teams, resetSimulation, lastCalculated }: StandingsTableProps) {
  const [compactView, setCompactView] = useState(true) // Por defecto vista compacta
  const { isMobile } = useWindowSize()

  const getPositionColor = (position: number, index: number) => {
    if (position === 1) return "bg-green-100 dark:bg-green-900 dark:bg-opacity-50"
    if (position >= 2 && position <= 5) return "bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50"
    if (position === 13) return "bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-50"
    if (position >= 14 && position <= 18) return "bg-red-100 dark:bg-red-900 dark:bg-opacity-50"
    return index % 2 === 0 ? "bg-primary/5" : ""
  }

  // Funcion para determinar si un equipo ha cambiado de posicion
  const getPositionChange = (teamId: number) => {
    // Esta funcion se usara para mostrar indicadores de cambio de posicion
    // en futuras actualizaciones de la clasificacion
    return null // Por ahora retornamos null
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">Tabla de Clasificación</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCompactView(!compactView)} className="h-8 px-2 text-xs">
            {compactView ? <LayoutList className="h-3.5 w-3.5 mr-1" /> : <LayoutGrid className="h-3.5 w-3.5 mr-1" />}
            {compactView ? "Detallada" : "Compacta"}
          </Button>
          {lastCalculated && (
            <div className="text-xs text-muted-foreground hidden sm:block">
              Última actualización: {lastCalculated.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border border-primary overflow-hidden">
        <div className="overflow-x-auto">
          {compactView ? (
            // Vista compacta
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="w-12 text-primary-foreground p-1 sm:p-2 text-center">Pos</th>
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
                  const positionChange = getPositionChange(team.id)
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
                      <td className="p-2 border-b">
                        {positionChange > 0 ? (
                          <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : positionChange < 0 ? (
                          <ArrowDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-400" />
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
        <p className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-50 rounded text-xs sm:text-sm">
          Play Out de descenso
        </p>
        <p className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900 dark:bg-opacity-50 rounded text-xs sm:text-sm">
          Descenso
        </p>
      </div>
    </div>
  )
}

