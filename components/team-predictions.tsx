"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ForecastReport } from "@/lib/forecasts/forecast-service"
import type { FixedScore, Simulation } from "@/lib/forecasts/model-types"

type TeamPredictionsProps = {
  report: ForecastReport
  results: Record<number, { home: string; away: string }>
}

const format = (value: number) => value.toLocaleString("es-ES", { maximumFractionDigits: 1 })

export default function TeamPredictions({ report, results }: TeamPredictionsProps) {
  const [selectedTeamId, setSelectedTeamId] = useState("3")
  const { scores, invalid } = useMemo(() => {
    const scores: FixedScore[] = []
    let invalid = false
    for (const match of report.input.competition.matches) {
      if (match.homeGoals !== null) continue
      const result = results[match.id]
      if (!result || result.home === "" || result.away === "" || result.home === undefined || result.away === undefined) continue
      const homeGoals = Number(result.home), awayGoals = Number(result.away)
      if (![homeGoals, awayGoals].every((goals) => Number.isInteger(goals) && goals >= 0 && goals <= 15)) {
        invalid = true
        continue
      }
      scores.push({ matchId: match.id, homeGoals, awayGoals })
    }
    return { scores, invalid }
  }, [report, results])
  const signature = JSON.stringify(scores)
  const [calculation, setCalculation] = useState<{ simulation: Simulation; signature: string; error: string }>({
    simulation: report.simulation, signature: "[]", error: "",
  })

  useEffect(() => {
    if (signature === "[]") {
      setCalculation({ simulation: report.simulation, signature, error: "" })
      return
    }
    let worker: Worker | undefined
    const timer = setTimeout(() => {
      try {
        worker = new Worker(new URL("../app/pronosticos/simulation-worker.ts", import.meta.url))
        worker.onmessage = (event: MessageEvent<{ success: boolean; simulation?: Simulation }>) => {
          setCalculation({ simulation: event.data.simulation ?? report.simulation, signature,
            error: event.data.success ? "" : "No se ha podido calcular este escenario." })
          worker?.terminate()
        }
        worker.onerror = () => {
          setCalculation({ simulation: report.simulation, signature, error: "No se ha podido calcular este escenario." })
          worker?.terminate()
        }
        worker.postMessage({ input: report.input, fixedScores: scores, seed: report.simulation.seed })
      } catch {
        setCalculation({ simulation: report.simulation, signature, error: "No se ha podido iniciar el cálculo." })
      }
    }, 400)
    return () => { clearTimeout(timer); worker?.terminate() }
  }, [signature, report])

  const row = calculation.simulation.probabilities.find((team) => team.teamId === Number(selectedTeamId))
  const pending = calculation.signature !== signature
  const available = !invalid && !pending && !calculation.error && row
  const categories = row ? [
    { label: "Campeón", value: row.champion, color: "bg-emerald-500" },
    { label: "Playoff (2.º–5.º)", value: row.playoff, color: "bg-sky-500" },
    { label: "Permanencia sin playoff (6.º–15.º)", value: Math.max(0, row.survival - row.topFive), color: "bg-amber-500" },
    { label: "Descenso por posición (16.º–20.º)", value: Math.max(0, 100 - row.survival), color: "bg-rose-500" },
  ] : []

  return <section className="space-y-5" aria-labelledby="objectives-title">
    <div>
      <h2 id="objectives-title" className="flex items-center gap-2 text-lg font-semibold"><BarChart2 className="h-5 w-5" /> Opciones al final de la temporada</h2>
      <p className="mt-1 text-sm text-muted-foreground">El mismo modelo y los mismos resultados oficiales que en Pronósticos.</p>
    </div>
    <div className="max-w-sm space-y-2">
      <label className="text-sm font-medium" htmlFor="objective-team">Equipo</label>
      <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
        <SelectTrigger id="objective-team" className="h-11"><SelectValue placeholder="Selecciona un equipo" /></SelectTrigger>
        <SelectContent>{report.input.competition.teams.map((team) => <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    {available ? <div aria-live="polite" className="space-y-4">
      {categories.map((category) => <div key={category.label} className="space-y-1.5">
        <div className="flex justify-between gap-3 text-sm"><span>{category.label}</span><strong className="tabular-nums">{format(category.value)} %</strong></div>
        <Progress value={category.value} className="h-2 bg-muted" indicatorClassName={category.color} />
      </div>)}
      <div className="grid gap-3 border-t pt-4 sm:grid-cols-2">
        <div className="rounded-lg bg-muted/40 p-4"><span className="text-sm text-muted-foreground">Puntos finales esperados</span><strong className="block text-2xl tabular-nums">{format(row.expectedPoints)}</strong></div>
        <div className="rounded-lg bg-muted/40 p-4"><span className="text-sm text-muted-foreground">Intervalo central del 80 %</span><strong className="block text-2xl tabular-nums">{row.lowPoints}–{row.highPoints}</strong></div>
      </div>
    </div> : <p role="status" className="text-sm text-muted-foreground">{invalid ? "Usa marcadores enteros entre 0 y 15 para calcular el escenario." : calculation.error || "Calculando las opciones…"}</p>}
    <p className="border-t pt-4 text-sm text-muted-foreground">Basado en {calculation.simulation.iterations.toLocaleString("es-ES")} simulaciones. Evaluado con temporadas anteriores, pero la muestra es limitada: las probabilidades siguen siendo orientativas.</p>
  </section>
}
