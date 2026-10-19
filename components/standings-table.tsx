"use client"

import Image from "next/image"
import { teamCrestUrl } from "@/lib/team-crest"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, Minus, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import EnhancedShareButtons from "./enhanced-share-buttons"
import FormBadge from "./form-badge"
import type { Team, Match } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getTeamForm } from "@/lib/team-form"
import styles from "./standings-table.module.css"

interface StandingsTableProps {
  teams: Team[]
  previousStandings: Team[] | null
  matches: Match[]
  className?: string
}

const zoneStyles = (position: number) => {
  if (position === 1) return "border-l-emerald-500"
  if (position <= 5) return "border-l-sky-500"
  if (position >= 16) return "border-l-rose-500"
  return "border-l-transparent"
}

export default function StandingsTable({ teams, previousStandings, matches, className }: StandingsTableProps) {
  const previousPositions = new Map(previousStandings?.map((team, index) => [team.id, index]) ?? [])
  const teamForm = getTeamForm(matches)
  const teamNames = new Map(teams.map((team) => [team.id, team.name]))

  const renderTable = (complete = false) => (
      <div className={cn("overflow-hidden rounded-lg border", complete && "min-h-0 overflow-y-auto")}>
        <div className={cn(styles.viewport, "overflow-x-auto")}>
          <table className={cn(styles.table, complete && styles.complete, "border-collapse text-sm")}>
            <thead className="sticky top-0 z-10 bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className={cn(styles.position, "px-2 py-3 text-center font-medium")}>Pos.</th>
                <th scope="col" className={cn(styles.teamColumn, "px-2 py-3 text-left font-medium")}>Equipo</th>
                <th scope="col" className={cn(styles.points, "px-2 py-3 text-center font-medium")}>Pts.</th>
                <th scope="col" className={cn(styles.stat, "px-2 py-3 text-center font-medium")}>PJ</th>
                {complete && <>
                  <th scope="col" className={cn(styles.stat, styles.extra, "px-2 py-3 text-center font-medium")} title="Partidos ganados">G</th>
                  <th scope="col" className={cn(styles.stat, styles.extra, "px-2 py-3 text-center font-medium")} title="Partidos empatados">E</th>
                  <th scope="col" className={cn(styles.stat, styles.extra, "px-2 py-3 text-center font-medium")} title="Partidos perdidos">P</th>
                </>}
                <th scope="col" className={cn(styles.stat, styles.goals, "px-2 py-3 text-center font-medium")}>GF</th>
                <th scope="col" className={cn(styles.stat, styles.goals, "px-2 py-3 text-center font-medium")}>GC</th>
                <th scope="col" className={cn(styles.stat, styles.difference, "px-2 py-3 text-center font-medium")}>DG</th>
                <th scope="col" className={cn(styles.formColumn, "px-2 py-3 text-center font-medium")} title="Últimos cinco partidos oficiales, del más reciente al más antiguo">Forma</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => {
                const position = index + 1
                const change = (previousPositions.get(team.id) ?? index) - index
                const isPontevedra = team.name === "Pontevedra CF"
                const recentForm = teamForm.get(team.id) ?? []

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
                      <div className={cn(styles.positionContent, "flex items-center justify-center gap-1")}>
                        <span>{position}</span>
                        {change > 0 ? (
                          <ArrowUp className="h-4 w-4 text-emerald-600" aria-label={`Sube ${change} posiciones`} />
                        ) : change < 0 ? (
                          <ArrowDown className="h-4 w-4 text-rose-600" aria-label={`Baja ${Math.abs(change)} posiciones`} />
                        ) : (
                          <Minus className="h-4 w-4 text-amber-500" aria-label={previousStandings ? "Sin cambios" : "Sin jornada anterior para comparar"} />
                        )}
                      </div>
                    </td>
                    <td className={cn(styles.teamCell, "px-2 py-2.5")}>
                      <div className={cn(styles.teamContent, "flex min-w-0 items-center gap-2")}>
                        {team.logoUrl && (
                          <Image src={teamCrestUrl(team.logoUrl)} unoptimized alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                        )}
                        <span className={cn(styles.teamName, isPontevedra && "font-semibold text-primary")} title={team.name}>
                          {team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold tabular-nums text-foreground">{team.points}</td>
                    <td className="px-2 py-2.5 text-center tabular-nums">{team.played}</td>
                    {complete && <>
                      <td className={cn(styles.extra, "px-2 py-2.5 text-center tabular-nums")}>{team.won}</td>
                      <td className={cn(styles.extra, "px-2 py-2.5 text-center tabular-nums")}>{team.drawn}</td>
                      <td className={cn(styles.extra, "px-2 py-2.5 text-center tabular-nums")}>{team.lost}</td>
                    </>}
                    <td className={cn(styles.goals, "px-2 py-2.5 text-center tabular-nums")}>{team.goalsFor}</td>
                    <td className={cn(styles.goals, "px-2 py-2.5 text-center tabular-nums")}>{team.goalsAgainst}</td>
                    <td className={cn(styles.difference, "px-2 py-2.5 text-center tabular-nums")}>{team.goalsFor - team.goalsAgainst}</td>
                    <td className="px-2 py-2.5">
                      <div className={styles.badges} aria-label={`Forma de ${team.name}, más reciente primero`}>
                        {recentForm.map((result) => <FormBadge key={result.match.id} result={result} homeName={teamNames.get(result.match.homeTeamId) ?? "Local"} awayName={teamNames.get(result.match.awayTeamId) ?? "Visitante"} />)}
                        {Array.from({ length: 5 - recentForm.length }, (_, index) => <span key={`empty-${index}`} className={cn(styles.badge, styles.empty)} title="Sin partido oficial" aria-label="Sin partido oficial">–</span>)}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

  )

  return (
    <section className={cn("min-w-0 rounded-xl border bg-card p-3 shadow-sm sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Clasificación</h2>
          <p className="mt-1 text-sm text-muted-foreground">Posiciones frente a la jornada anterior. Tus marcadores actualizan la tabla al instante.</p>
        </div>
        <EnhancedShareButtons teams={teams} currentUrl={typeof window !== "undefined" ? window.location.href : ""} />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-3 min-h-11 w-full gap-2">
            <Expand className="h-4 w-4" aria-hidden="true" />Ver clasificación completa
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-24px)] max-w-[1060px] flex-col gap-3 rounded-xl p-4 sm:p-6">
          <DialogHeader className="shrink-0 pr-6 text-left">
            <DialogTitle>Clasificación completa</DialogTitle>
            <DialogDescription>Todos los equipos y estadísticas de la clasificación que estás viendo, incluidos tus marcadores simulados.</DialogDescription>
          </DialogHeader>
          <p className="text-xs text-muted-foreground sm:hidden">Desliza la tabla hacia los lados para ver todas las columnas.</p>
          {renderTable(true)}
          <p className="shrink-0 text-xs leading-relaxed text-muted-foreground">PJ: jugados · G: ganados · E: empatados · P: perdidos · GF: goles a favor · GC: goles en contra · DG: diferencia de goles · Pts.: puntos. La forma muestra los últimos 5 partidos oficiales.</p>
        </DialogContent>
      </Dialog>

      <div className="mt-4">{renderTable()}</div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground" aria-label="Leyenda de la forma">
        <span className="inline-flex items-center gap-1.5"><span className={cn(styles.badge, styles.win)} aria-hidden="true">V</span>Victoria</span>
        <span className="inline-flex items-center gap-1.5"><span className={cn(styles.badge, styles.draw)} aria-hidden="true">E</span>Empate</span>
        <span className="inline-flex items-center gap-1.5"><span className={cn(styles.badge, styles.loss)} aria-hidden="true">D</span>Derrota</span>
        <span className="basis-full">Últimos 5 partidos oficiales · Más reciente a la izquierda.</span>
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
