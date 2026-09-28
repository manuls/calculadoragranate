"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ForecastReport } from "@/lib/forecasts/forecast-service"
import { predictFixture } from "@/lib/forecasts/model"
import type { Match, Team } from "@/lib/types"

type MatchPredictionsProps = {
  matches: Match[]
  teams: Team[]
  report: ForecastReport
  updateTempResults: (results: Record<number, { home: string; away: string }>) => void
  setActiveTab: (tab: string) => void
}

const percent = (value: number) => `${(value * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`

export default function MatchPredictions({ matches, teams, report, updateTempResults, setActiveTab }: MatchPredictionsProps) {
  const [activeMatchday, setActiveMatchday] = useState<number | null>(null)
  const availableMatchdays = useMemo(() => [...new Set(matches.filter((match) => !match.locked && !match.result).map((match) => match.matchday))]
    .sort((a, b) => a - b), [matches])
  const teamById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams])
  const competitionMatches = useMemo(() => new Map(report.input.competition.matches.map((match) => [match.id, match])), [report])
  const predictions = useMemo(() => new Map(matches.filter((match) => !match.locked && !match.result).map((match) => {
    const sourceMatch = competitionMatches.get(match.id)
    return [match.id, sourceMatch ? predictFixture(report.input, sourceMatch) : null] as const
  })), [matches, competitionMatches, report])

  useEffect(() => {
    if (!availableMatchdays.length) {
      setActiveMatchday(null)
    } else if (activeMatchday === null || !availableMatchdays.includes(activeMatchday)) {
      setActiveMatchday(availableMatchdays[0])
    }
  }, [availableMatchdays, activeMatchday])

  const visible = matches.filter((match) => match.matchday === activeMatchday && !match.locked && !match.result)
  const applyPredictions = () => {
    const results: Record<number, { home: string; away: string }> = {}
    for (const match of visible) {
      const prediction = predictions.get(match.id)
      if (!prediction) continue
      results[match.id] = {
        home: String(prediction.bestScore.homeGoals),
        away: String(prediction.bestScore.awayGoals),
      }
    }
    if (!Object.keys(results).length) return
    updateTempResults(results)
    setActiveTab("standings")
  }

  return <section aria-labelledby="match-predictions-title">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 id="match-predictions-title" className="flex items-center gap-2 text-lg font-semibold"><BarChart2 className="h-5 w-5" /> Predicciones de partidos</h2>
        <p className="mt-1 text-sm text-muted-foreground">Probabilidades calculadas con el mismo modelo y los mismos resultados oficiales que en Pronósticos.</p>
      </div>
      {visible.length > 0 && <Button type="button" variant="outline" onClick={applyPredictions}>Aplicar a esta jornada</Button>}
    </div>

    {availableMatchdays.length > 0 ? <>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Jornada de predicciones">
        {availableMatchdays.map((round) => <Button type="button" key={round} size="sm"
          variant={round === activeMatchday ? "default" : "outline"} aria-pressed={round === activeMatchday}
          onClick={() => setActiveMatchday(round)}>J{round}</Button>)}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {visible.map((match) => {
          const prediction = predictions.get(match.id)
          const home = teamById.get(match.homeTeamId)
          const away = teamById.get(match.awayTeamId)
          if (!prediction || !home || !away) return null
          const outcomes = [
            { label: "1 · Local", value: prediction.homeWin },
            { label: "X · Empate", value: prediction.draw },
            { label: "2 · Visitante", value: prediction.awayWin },
          ]
          const favorite = Math.max(...outcomes.map((outcome) => outcome.value))
          return <article key={match.id} className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {home.logoUrl && <Image src={home.logoUrl} alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />}
                <strong className="truncate text-sm" title={home.name}>{home.name}</strong>
              </div>
              <span className="text-xs text-muted-foreground">–</span>
              <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                <strong className="truncate text-sm" title={away.name}>{away.name}</strong>
                {away.logoUrl && <Image src={away.logoUrl} alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {outcomes.map((outcome) => <div key={outcome.label}
                className={`rounded-md px-2 py-2 text-center ${outcome.value === favorite ? "bg-primary/10 text-primary" : "bg-muted/50"}`}>
                <span className="block text-xs">{outcome.label}</span>
                <strong className="tabular-nums">{percent(outcome.value)}</strong>
              </div>)}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Marcador individual más probable: <strong className="text-foreground">{prediction.bestScore.homeGoals}–{prediction.bestScore.awayGoals}</strong> · Goles esperados: {prediction.expectedHomeGoals.toFixed(1)}–{prediction.expectedAwayGoals.toFixed(1)}</p>
          </article>
        })}
      </div>
    </> : <p className="mt-6 text-sm text-muted-foreground">No quedan partidos pendientes.</p>}
    <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">Estimaciones orientativas: en una muestra histórica reservada, el 1-X-2 aún no superó una referencia basada solo en frecuencias. El marcador individual más probable puede ser distinto del resultado 1, X o 2 con mayor probabilidad.</p>
  </section>
}
