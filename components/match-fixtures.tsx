"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Match, Team } from "@/lib/types"
import { cn } from "@/lib/utils"
import { PONTEVEDRA_TEAM_ID } from "@/lib/constants"

interface MatchFixturesProps {
  fixtures: Match[]
  teams: Team[]
  tempResults: Record<number, { home: string; away: string }>
  updateTempResult: (matchId: number, team: "home" | "away", value: string) => void
  onReset: () => void
  className?: string
}

const compactTeamNames: Record<string, string> = {
  "Pontevedra CF": "Pontevedra",
  "Racing Club Ferrol": "Racing Ferrol",
  "Real Avilés Industrial": "Real Avilés",
  "RC Deportivo Fabril": "Dépor Fabril",
  "Unionistas de Salamanca CF": "Unionistas",
}

export default function MatchFixtures({
  fixtures,
  teams,
  tempResults,
  updateTempResult,
  onReset,
  className,
}: MatchFixturesProps) {
  const [activeMatchday, setActiveMatchday] = useState("")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const teamsById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams])
  const featuredTeamIds = useMemo(
    () => new Set([PONTEVEDRA_TEAM_ID, ...teams.slice(0, 5).map((team) => team.id)]),
    [teams],
  )

  const matchdayGroups = useMemo(
    () =>
      fixtures.reduce(
        (groups, match) => {
          const isFeatured = featuredTeamIds.has(match.homeTeamId) || featuredTeamIds.has(match.awayTeamId)
          if (!showFeaturedOnly || isFeatured) {
            const matchday = String(match.matchday)
            groups[matchday] ??= []
            groups[matchday].push(match)
          }
          return groups
        },
        {} as Record<string, Match[]>,
      ),
    [fixtures, showFeaturedOnly, featuredTeamIds],
  )

  const sortedMatchdays = useMemo(
    () => Object.keys(matchdayGroups).sort((a, b) => Number(a) - Number(b)),
    [matchdayGroups],
  )

  useEffect(() => {
    if (sortedMatchdays.length === 0) return

    const latestOfficial = sortedMatchdays.filter((matchday) =>
      matchdayGroups[matchday].some((match) => match.locked && match.result),
    ).at(-1)
    const firstPlayable = sortedMatchdays.find((matchday) =>
      matchdayGroups[matchday].some((match) => !match.locked),
    )
    const preferred = latestOfficial || firstPlayable || sortedMatchdays[0]

    if (!activeMatchday || !matchdayGroups[activeMatchday]) setActiveMatchday(preferred)
  }, [activeMatchday, matchdayGroups, sortedMatchdays])

  const activeIndex = sortedMatchdays.indexOf(activeMatchday)
  const visibleMatches = matchdayGroups[activeMatchday] ?? []

  const moveMatchday = (offset: number) => {
    const nextMatchday = sortedMatchdays[activeIndex + offset]
    if (nextMatchday) setActiveMatchday(nextMatchday)
  }

  const renderTeam = (teamId: number, align: "left" | "right") => {
    const team = teamsById.get(teamId)
    if (!team) return <span>Equipo</span>

    return (
      <div className={cn("flex min-w-0 items-center gap-2", align === "right" && "flex-row-reverse text-right")}>
        {team.logoUrl && (
          <Image src={team.logoUrl} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
        )}
        <span className={cn("min-w-0 text-sm leading-tight", team.id === PONTEVEDRA_TEAM_ID && "font-semibold text-primary")} title={team.name}>
          <span className="sm:hidden">{compactTeamNames[team.name] ?? team.name}</span>
          <span className="hidden sm:inline">{team.name}</span>
        </span>
      </div>
    )
  }

  return (
    <section className={cn("rounded-xl border bg-card p-4 shadow-sm sm:p-5", className)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Simula la jornada</h2>
            <p className="mt-1 text-sm text-muted-foreground">Escribe los marcadores y la clasificación cambiará al instante.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="shrink-0 text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-y py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => moveMatchday(-1)}
            disabled={activeIndex <= 0}
            aria-label="Jornada anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select value={activeMatchday} onValueChange={setActiveMatchday}>
            <SelectTrigger className="w-[160px] bg-background" aria-label="Seleccionar jornada">
              <SelectValue placeholder="Jornada" />
            </SelectTrigger>
            <SelectContent>
              {sortedMatchdays.map((matchday) => (
                <SelectItem key={matchday} value={matchday}>Jornada {matchday}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => moveMatchday(1)}
            disabled={activeIndex < 0 || activeIndex >= sortedMatchdays.length - 1}
            aria-label="Jornada siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <label htmlFor="show-featured" className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            id="show-featured"
            checked={showFeaturedOnly}
            onCheckedChange={(checked) => setShowFeaturedOnly(Boolean(checked))}
          />
          Solo Pontevedra y rivales directos
        </label>
      </div>

      <div className="mt-4 divide-y rounded-lg border bg-background">
        {visibleMatches.map((match) => {
          const hasResult = tempResults[match.id]?.home !== undefined && tempResults[match.id]?.away !== undefined
          return (
            <div
              key={match.id}
              className={cn(
                "grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4",
                hasResult && !match.locked && "bg-primary/[0.035]",
              )}
            >
              {renderTeam(match.homeTeamId, "right")}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    aria-label={`Goles de ${teamsById.get(match.homeTeamId)?.name ?? "equipo local"}`}
                    className="no-spinner h-11 w-11 rounded-lg p-0 text-center text-base font-semibold sm:w-12"
                    value={match.locked && match.result ? match.result.homeGoals : tempResults[match.id]?.home || ""}
                    onChange={(event) => updateTempResult(match.id, "home", event.target.value)}
                    disabled={match.locked}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    aria-label={`Goles de ${teamsById.get(match.awayTeamId)?.name ?? "equipo visitante"}`}
                    className="no-spinner h-11 w-11 rounded-lg p-0 text-center text-base font-semibold sm:w-12"
                    value={match.locked && match.result ? match.result.awayGoals : tempResults[match.id]?.away || ""}
                    onChange={(event) => updateTempResult(match.id, "away", event.target.value)}
                    disabled={match.locked}
                  />
                </div>
                {match.locked && <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Oficial</span>}
              </div>
              {renderTeam(match.awayTeamId, "left")}
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Clasificación oficial tras la jornada 1. Calendario contrastado con{" "}
        <a href="https://www.bdfutbol.com/es/t/t2026-271rf1.html" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
          BDFutbol
        </a>.
      </p>
    </section>
  )
}
