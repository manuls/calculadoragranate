"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import EnhancedShareButtons from "./enhanced-share-buttons"
import type { Team } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StandingsTableProps {
  teams: Team[]
  initialStandings: Team[]
  className?: string
}

const zoneStyles = (position: number) => {
  if (position === 1) return "border-l-emerald-500"
  if (position <= 5) return "border-l-sky-500"
  if (position >= 16) return "border-l-rose-500"
  return "border-l-transparent"
}

export default function StandingsTable({ teams, initialStandings, className }: StandingsTableProps) {
  const initialPositions = new Map(initialStandings.map((team, index) => [team.id, index]))

  return (
    <section className={cn("rounded-xl border bg-card p-4 shadow-sm sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Clasificación</h2>
          <p className="mt-1 text-sm text-muted-foreground">Se actualiza automáticamente con tus marcadores.</p>
        </div>
        <EnhancedShareButtons teams={teams} currentUrl={typeof window !== "undefined" ? window.location.href : ""} />
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-14 px-2 py-3 text-center font-medium">Pos.</th>
                <th className="min-w-[150px] px-2 py-3 text-left font-medium">Equipo</th>
                <th className="w-12 px-2 py-3 text-center font-medium">PJ</th>
                <th className="hidden w-12 px-2 py-3 text-center font-medium sm:table-cell">GF</th>
                <th className="hidden w-12 px-2 py-3 text-center font-medium sm:table-cell">GC</th>
                <th className="w-12 px-2 py-3 text-center font-medium">DG</th>
                <th className="w-14 px-2 py-3 text-center font-medium">Pts.</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => {
                const position = index + 1
                const change = (initialPositions.get(team.id) ?? index) - index
                const isPontevedra = team.name === "Pontevedra CF"

                return (
                  <motion.tr
                    key={team.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                    className={cn(
                      "border-b border-l-4 last:border-b-0 hover:bg-muted/45",
                      zoneStyles(position),
                      isPontevedra && "bg-primary/[0.06]",
                    )}
                  >
                    <td className="px-2 py-2.5 text-center font-medium tabular-nums">
                      <div className="flex items-center justify-center gap-1">
                        <span>{position}</span>
                        {change > 0 ? (
                          <ArrowUp className="h-3.5 w-3.5 text-emerald-600" aria-label={`Sube ${change} posiciones`} />
                        ) : change < 0 ? (
                          <ArrowDown className="h-3.5 w-3.5 text-rose-600" aria-label={`Baja ${Math.abs(change)} posiciones`} />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground/60" aria-label="Sin cambios" />
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        {team.logoUrl && (
                          <Image src={team.logoUrl} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                        )}
                        <span className={cn("max-w-[150px] truncate sm:max-w-none", isPontevedra && "font-semibold text-primary")} title={team.name}>
                          {team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center tabular-nums">{team.played}</td>
                    <td className="hidden px-2 py-2.5 text-center tabular-nums sm:table-cell">{team.goalsFor}</td>
                    <td className="hidden px-2 py-2.5 text-center tabular-nums sm:table-cell">{team.goalsAgainst}</td>
                    <td className="px-2 py-2.5 text-center tabular-nums">{team.goalsFor - team.goalsAgainst}</td>
                    <td className="px-2 py-2.5 text-center font-bold tabular-nums text-foreground">{team.points}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground" aria-label="Leyenda de la clasificación">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Ascenso</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-500" />Playoff</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Descenso</span>
      </div>

      <details className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground">Cómo se calcula</summary>
        <p className="mt-2 leading-relaxed">
          PJ: partidos jugados · GF: goles a favor · GC: goles en contra · DG: diferencia de goles. Los desempates siguen el criterio de la RFEF, salvo el juego limpio porque la aplicación no dispone de esos datos.
        </p>
      </details>
    </section>
  )
}
