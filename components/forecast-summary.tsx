"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ForecastReport } from "@/lib/forecasts/forecast-service";
import type { FixedScore } from "@/lib/forecasts/model-types";
import { saveScenario } from "@/lib/forecasts/scenario-storage";

export function ForecastSummary({ report, results }: { report: ForecastReport; results: Record<number, { home: string; away: string }> }) {
  const fixed: FixedScore[] = [];
  let invalid = false;
  for (const match of report.input.competition.matches) {
    const score = results[match.id];
    if (match.homeGoals !== null || !score || !score.home || !score.away) continue;
    const homeGoals = Number(score.home), awayGoals = Number(score.away);
    if (![homeGoals, awayGoals].every((v) => Number.isInteger(v) && v >= 0 && v <= 15)) { invalid = true; continue; }
    fixed.push({ matchId: match.id, homeGoals, awayGoals });
  }
  const signature = JSON.stringify(fixed);
  const [state, setState] = useState({ simulation: report.simulation, signature: "[]", error: "" });
  useEffect(() => {
    const scores = JSON.parse(signature) as FixedScore[];
    if (!scores.length) { setState({ simulation: report.simulation, signature, error: "" }); return; }
    let worker: Worker | undefined;
    const timer = setTimeout(() => {
      try {
        worker = new Worker(new URL("../app/pronosticos/simulation-worker.ts", import.meta.url));
        worker.onmessage = (event) => {
          setState({ simulation: event.data.simulation ?? report.simulation, signature, error: event.data.success ? "" : "No se pudo calcular el escenario." });
          worker?.terminate();
        };
        worker.onerror = () => { setState({ simulation: report.simulation, signature, error: "No se pudo calcular el escenario." }); worker?.terminate(); };
        worker.postMessage({ input: report.input, fixedScores: scores, seed: report.simulation.seed });
      } catch { setState({ simulation: report.simulation, signature, error: "No se pudo iniciar el cálculo." }); }
    }, 400);
    return () => { clearTimeout(timer); worker?.terminate(); };
  }, [signature, report]);
  const busy = state.signature !== signature;
  const probability = state.simulation.probabilities.find((p) => p.teamId === 3)!;
  const format = (value: number) => value > 0 && value < .1 ? "<0,1" : value < 100 && value > 99.9 ? ">99,9" : value.toLocaleString("es-ES", { maximumFractionDigits: 1 });
  return <section className="mb-5 rounded-xl border bg-card p-4 shadow-sm" aria-label="Pronósticos del Pontevedra">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Las opciones del Pontevedra</h2><p className="text-xs text-muted-foreground">{fixed.length ? `Tu escenario · ${fixed.length} resultados fijados` : "Situación oficial · Modelo orientativo"}</p></div><Link className="text-sm font-semibold text-primary underline-offset-4 hover:underline" href={fixed.length ? "/pronosticos?escenario=calculadora" : "/pronosticos"} onClick={(event) => { if (fixed.length && !saveScenario(report.input.competition, fixed)) { event.preventDefault(); setState({ ...state, error: "Activa el almacenamiento de sesión para trasladar el escenario." }); } }}>Ver análisis →</Link></div>
    <div className="mt-3 grid grid-cols-3 gap-2" aria-live="polite">{([['survival', 'Permanencia'], ['playoff', 'Playoff'], ['champion', 'Campeón']] as const).map(([key, label]) => <div key={key} className="rounded-lg bg-primary/5 px-2 py-3 sm:px-4"><p className="text-xs text-muted-foreground">{label}</p><strong className="text-xl tabular-nums sm:text-2xl">{busy || invalid || state.error ? "—" : `${format(probability[key])} %`}</strong></div>)}</div>
    <p className="mt-2 text-xs text-muted-foreground" role="status">{invalid ? "Para calcular las probabilidades, usa marcadores enteros entre 0 y 15." : state.error || (busy ? "Recalculando tus probabilidades…" : "Las probabilidades cambian al completar marcadores. Playoff y campeón también implican permanencia.")}</p>
    <p className="mt-1 text-xs text-muted-foreground">{report.input.competition.availability === 'saved' ? 'Copia guardada' : 'Datos compartidos con Pronósticos'} · {new Date(report.input.competition.capturedAt).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
  </section>;
}
