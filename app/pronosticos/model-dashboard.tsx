"use client";

import { loadScenario, saveScenario } from "@/lib/forecasts/scenario-storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChartNoAxesCombined, Flag, RotateCcw, ShieldCheck, Trophy } from "lucide-react";
import type { ForecastReport, HistoricalSummary } from "@/lib/forecasts/forecast-service";
import type { FixedScore, Objective, Simulation } from "@/lib/forecasts/model-types";
import styles from "./forecast.module.css";

const objectives = [{ id: "survival", label: "Permanencia", zone: "15.º o mejor", Icon: ShieldCheck }, { id: "playoff", label: "Playoff", zone: "Del 2.º al 5.º", Icon: Flag }, { id: "champion", label: "Campeón", zone: "Primer puesto", Icon: Trophy }] as const;
const number = (value: number, decimals = 1) => value.toLocaleString("es-ES", { maximumFractionDigits: decimals });
const probability = (value: number) => value > 0 && value < 0.1 ? "<0,1" : value < 100 && value > 99.9 ? ">99,9" : number(value);
const displayDate = (value: string) => new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export function ModelDashboard({ report, historical }: { report: ForecastReport; historical: HistoricalSummary }) {
  const [objective, setObjective] = useState<Objective>("survival");
  const [roundIndex, setRoundIndex] = useState(report.trend.length - 1);
  const [simulation, setSimulation] = useState(report.simulation);
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [historyGroup, setHistoryGroup] = useState("1");
  const [scenarioRound, setScenarioRound] = useState(() => {
    const pending = report.input.competition.matches.filter((match) => match.homeGoals === null);
    const club = pending.filter((match) => match.homeId === 3 || match.awayId === 3);
    return Math.min(...(club.length ? club : pending).map((match) => match.round), 38);
  });
  const workerRef = useRef<Worker | null>(null);
  useEffect(() => () => workerRef.current?.terminate(), []);
  const { competition } = report.input;
  const team = competition.teams.find((row) => row.id === 3)!;
  const selected = simulation.probabilities.find((row) => row.teamId === 3)!;
  const selectedObjective = objectives.find((item) => item.id === objective)!;
  const target = simulation.targets[objective];
  const names = new Map(competition.teams.map((row) => [row.id, row.name]));
  const remaining = 38 - team.played;
  const completed = competition.matches.filter((match) => match.homeGoals !== null && (match.homeId === 3 || match.awayId === 3)).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || b.round - a.round).slice(0, 5);
  const pending = competition.matches.filter((match) => match.homeGoals === null).sort((a, b) => a.round - b.round);
  const next = pending.filter((match) => match.homeId === 3 || match.awayId === 3).slice(0, 5);
  const scenarioRounds = [...new Set(pending.map((match) => match.round))];
  const scenarioMatches = pending.filter((match) => match.round === scenarioRound);
  const snapshot = report.trend[roundIndex];
  const needed = target.points === null ? null : Math.max(0, target.points - team.points);
  const scenarioActive = simulation.fixedScores.length > 0;
  const rowsById = new Map(simulation.probabilities.map((row) => [row.teamId, row]));
  const x = (i: number) => 48 + i * 540 / Math.max(1, report.trend.length - 1);
  const y = (value: number) => 205 - value * 1.7;
  const path = report.trend.map((row, i) => `${i ? "L" : "M"}${x(i)},${y(row[objective])}`).join(" ");

  function resetScenario() { workerRef.current?.terminate(); workerRef.current = null; setBusy(false); setSimulation(report.simulation); setScores({}); setError(""); }
  function calculateScenario(scenarioScores = scores) {
    const fixedScores: FixedScore[] = [];
    for (const [matchId, score] of Object.entries(scenarioScores)) {
      if (score.home === "" && score.away === "") continue;
      if (score.home === "" || score.away === "") { setError("Completa los dos marcadores de cada partido que quieras fijar."); return; }
      const homeGoals = Number(score.home), awayGoals = Number(score.away);
      if (![homeGoals, awayGoals].every((value) => Number.isInteger(value) && value >= 0 && value <= 15)) { setError("Los marcadores deben ser números enteros entre 0 y 15."); return; }
      fixedScores.push({ matchId: Number(matchId), homeGoals, awayGoals });
    }
    if (!fixedScores.length) { resetScenario(); return; }
    setError(""); setBusy(true);
    workerRef.current?.terminate();
    try {
      const worker = new Worker(new URL("./simulation-worker.ts", import.meta.url));
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<{ success: boolean; simulation?: Simulation; message?: string }>) => {
        if (event.data.success && event.data.simulation) setSimulation(event.data.simulation);
        else setError(event.data.message ?? "No se pudo calcular el escenario.");
        setBusy(false); worker.terminate(); workerRef.current = null;
      };
      worker.onerror = () => { setError("No se pudo iniciar el cálculo. Vuelve a intentarlo."); setBusy(false); worker.terminate(); workerRef.current = null; };
      worker.postMessage({ input: report.input, fixedScores, seed: report.simulation.seed });
    } catch { setError("Este navegador no permite iniciar el cálculo de escenarios."); setBusy(false); }
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("escenario") !== "calculadora") return;
    const imported = loadScenario(report.input.competition);
    if (!imported.length) { setError("No quedan marcadores pendientes en el escenario guardado. Se muestra la situación real."); return; }
    const importedScores = Object.fromEntries(imported.map((score) => [score.matchId, { home: String(score.homeGoals), away: String(score.awayGoals) }]));
    setScores(importedScores);
    calculateScenario(importedScores);
  }, [report]);

  return <div className={styles.app}>
    <main className={styles.main}>
      <div className={styles.sourceNotice}><span className={styles.sourceBadge}>{competition.availability === "saved" ? "COPIA GUARDADA" : "DATOS COMPARTIDOS"}</span><span>{competition.source} · Consulta del {displayDate(competition.capturedAt)}</span><a href={competition.sourceUrl} target="_blank" rel="noreferrer">Ver fuente ↗</a></div>
      {competition.availability === "saved" && <p className={styles.dataWarning}>La fuente no se ha podido actualizar. Los cálculos usan la última copia disponible, fechada arriba.</p>}
      <div className={styles.heading}><div><p className={styles.eyebrow}>EL CAMINO DEL PONTEVEDRA</p><h1>Cada jornada cuenta.</h1></div><span className={styles.round}>Temporada {competition.season}<strong>{team.played} de 38 partidos jugados</strong></span></div>
      <div className={styles.scenarioActions}><Link href="/?escenario=pronosticos" onClick={(event) => { if (!saveScenario(competition, simulation.fixedScores)) { event.preventDefault(); setError("Activa el almacenamiento de sesión para trasladar el escenario."); } }}>{scenarioActive ? "Usar este escenario en la calculadora →" : "Ir a la calculadora →"}</Link></div>
      {scenarioActive && <div className={styles.scenarioNotice} role="status"><strong>Escenario hipotético · {simulation.fixedScores.length} resultados fijados</strong><button type="button" onClick={resetScenario}>Volver a la situación real</button></div>}
      <section className={styles.hero} aria-labelledby="model-team-title"><div className={styles.teamHeader}><div className={styles.teamIdentity}><div className={styles.crest}><Image src="/assets/escudos/pontevedra-cf.png" alt="" width={58} height={66} /></div><div><p className={styles.heroEyebrow}>NOSSO PONTEVEDRA</p><h2 id="model-team-title">Pontevedra CF</h2><p>{team.position}.º en la fuente <span>·</span> {team.points} puntos <span>·</span> {remaining} partidos pendientes</p></div></div><span className={styles.modelBadge}>Modelo experimental</span></div>
        <div className={styles.probabilities}>{objectives.map(({ id, label, zone, Icon }) => {
          const previous = scenarioActive ? report.simulation.probabilities.find((row) => row.teamId === 3)![id] : report.trend.length > 1 ? report.trend[report.trend.length - 2][id] : selected[id];
          const delta = selected[id] - previous;
          return <button type="button" className={styles.probability} key={id} data-active={objective === id} aria-pressed={objective === id} onClick={() => setObjective(id)}><span className={styles.probabilityLabel}><Icon size={19} aria-hidden="true" />{label}</span><span className={styles.probabilityValue}>{probability(selected[id])}<small>%</small></span><span className={styles.probabilityBottom}><span>{zone}</span><span className={styles.delta}>{scenarioActive || report.trend.length > 1 ? `${delta >= 0 ? "↑" : "↓"} ${number(Math.abs(delta))} pp` : "Primer cálculo"}</span></span></button>;
        })}</div>
        <p className={styles.heroNote}>{scenarioActive ? "Variación respecto al cálculo sin resultados fijados." : "Variación respecto al punto anterior del gráfico."} No suman 100 %: playoff y campeón también implican permanencia. Un 100 % simulado no equivale a certeza matemática.</p>
      </section>
      <section className={styles.target} aria-live="polite"><div><span className={styles.eyebrow}>OBJETIVO · {selectedObjective.label.toUpperCase()}</span><h2>{target.points === null ? "Aún no hay un objetivo fiable" : `Una referencia de ${target.points} puntos`}</h2><p>{objective === "playoff" ? "El objetivo incluye acabar primero: entrar en el top 5." : "Referencia probabilística, sin garantía matemática."}</p></div><div className={styles.targetStats}><div><strong>{target.points ?? "—"}<small> pts</small></strong><span>Objetivo final</span></div><div><strong>{needed === null ? "—" : `+${needed}`}</strong><span>Puntos por sumar</span></div><div><strong>{needed === null || remaining === 0 ? "—" : number(needed / remaining, 2)}</strong><span>Puntos / partido</span></div></div></section>
      <p className={styles.targetExplanation}>{target.points !== null ? `Entre ${number(target.sampleSize, 0)} simulaciones en las que el Pontevedra termina exactamente con ${target.points} puntos, cumple el objetivo en el ${number(target.probability!)} %. Es una estimación condicionada a esos escenarios, no una garantía para cualquier combinación de resultados.` : "No hay suficientes escenarios para asociar una puntuación a una probabilidad alta con un margen estadístico prudente."}</p>
      <div className={styles.columns}><div className={styles.leftColumn}>
        <section className={styles.panel} aria-labelledby="evolution-title"><div className={styles.panelHeading}><div><p className={styles.eyebrow}>PERSPECTIVA</p><h2 id="evolution-title">Cómo cambian las opciones</h2></div><span className={styles.pill}>Modelo actual</span></div><div className={styles.tabs} role="group" aria-label="Objetivo del gráfico">{objectives.map((item) => <button type="button" key={item.id} aria-pressed={objective === item.id} onClick={() => setObjective(item.id)}>{item.label}</button>)}</div>
          <div className={styles.chartSummary} aria-live="polite"><strong>{probability(snapshot[objective])}<small> %</small></strong><span>{snapshot.round === 0 ? "Antes de empezar" : `Jornada ${snapshot.round}`}</span></div>
          <svg className={styles.chart} viewBox="0 0 630 250" role="img" aria-label={`Evolución de ${selectedObjective.label.toLowerCase()}: ${report.trend.map((row) => `jornada ${row.round}, ${number(row[objective])} por ciento`).join("; ")}`}>
            {[0, 25, 50, 75, 100].map((value) => <g key={value}><line x1="48" x2="588" y1={y(value)} y2={y(value)} stroke="#e9e6e3" strokeDasharray="4 5" /><text x="32" y={y(value) + 5} textAnchor="end">{value}</text></g>)}<path d={path} stroke="#8c1238" strokeWidth="3" strokeLinejoin="round" fill="none" />{report.trend.map((row, i) => <g key={row.round}><circle cx={x(i)} cy={y(row[objective])} r={roundIndex === i ? 6 : 4} fill={roundIndex === i ? "#8c1238" : "white"} stroke="#8c1238" strokeWidth="2" />{(i === 0 || i === report.trend.length - 1 || i % Math.ceil(report.trend.length / 6) === 0) && <text x={x(i)} y="238" textAnchor="middle">J{row.round}</text>}</g>)}
          </svg><label className={styles.sliderLabel} htmlFor="real-round">Explorar jornada <strong>J{snapshot.round}</strong></label><input id="real-round" className={styles.slider} type="range" min="0" max={report.trend.length - 1} disabled={report.trend.length < 2} value={roundIndex} onChange={(event) => setRoundIndex(Number(event.target.value))} aria-valuetext={`Jornada ${snapshot.round}`} /><div className={styles.snapshot}><span>{snapshot.points} puntos del Pontevedra</span><span>Sin resultados hipotéticos</span></div><p className={styles.smallNote}>{report.archiveState === "saved" ? "Registro de cálculos guardados. Cada punto conserva los datos y el modelo utilizados entonces; mostramos el último cálculo de cada jornada." : "El historial no se ha podido recuperar o guardar. Este punto muestra el cálculo actual; no inventamos jornadas anteriores."}</p>
          <details className={styles.cutDetails}><summary>Ver el corte estimado de puntos</summary><p>Para {selectedObjective.label.toLowerCase()}, el puesto de referencia termina con una mediana de <strong>{target.cutMedian} puntos</strong>. El 80 % central de simulaciones queda entre {target.cutLow} y {target.cutHigh} puntos.</p></details>
        </section>
        <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>LA RACHA</p><h2>Últimos resultados</h2></div><span className={styles.pill}>{completed.length} disponibles</span></div>{completed.map((match) => <div className={styles.realMatch} key={match.id}><div className={styles.match}><span className={styles.matchRound}>J{match.round}</span><span className={styles.homeTeam}>{names.get(match.homeId)}</span><strong className={styles.score}>{match.homeGoals}–{match.awayGoals}</strong><span>{names.get(match.awayId)}</span></div>{match.date && <span className={styles.matchSource}>{displayDate(`${match.date}T12:00:00Z`)}</span>}</div>)}{completed.length === 0 && <p>Todavía no hay resultados en esta temporada.</p>}</section>
        <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>LO QUE VIENE</p><h2>Próximos partidos</h2></div><span className={styles.pill}>{remaining} pendientes</span></div><div className={styles.realFixtures}>{next.map((match) => <div className={styles.realFixture} key={match.id}><span className={styles.eyebrow}>JORNADA {match.round} · {match.homeId === 3 ? "LOCAL" : "VISITANTE"}</span><strong>{names.get(match.homeId === 3 ? match.awayId : match.homeId)}</strong><span>{match.date ? displayDate(`${match.date}T12:00:00Z`) : "Fecha pendiente de confirmar"}</span></div>)}</div><p className={styles.smallNote}>Ordenados por jornada. Las fechas y los horarios pueden cambiar.</p></section>
        <section className={styles.panel} aria-labelledby="scenario-title"><div className={styles.panelHeading}><div><p className={styles.eyebrow}>¿Y SI…?</p><h2 id="scenario-title">Dibuja una jornada</h2></div></div><p className={styles.smallNote}>Fija marcadores del Pontevedra o sus rivales. Deja los demás vacíos para que el modelo los simule. Cambiar de jornada restablece el escenario.</p><label className={styles.historyFilter}>Jornada del escenario <select value={scenarioRound} disabled={busy || !scenarioRounds.length} onChange={(event) => { resetScenario(); setScenarioRound(Number(event.target.value)); }}>{scenarioRounds.map((round) => <option value={round} key={round}>Jornada {round}</option>)}</select></label><form onSubmit={(event) => { event.preventDefault(); calculateScenario(); }}><fieldset className={styles.scenarioFields} disabled={busy}><legend className={styles.srOnly}>Marcadores hipotéticos</legend>{scenarioMatches.map((match) => <div className={styles.scenarioMatch} key={match.id}><span>J{match.round} · {names.get(match.homeId)} — {names.get(match.awayId)}</span><div><input type="number" inputMode="numeric" min="0" max="15" step="1" aria-label={`Goles de ${names.get(match.homeId)} en J${match.round}`} placeholder="—" value={scores[match.id]?.home ?? ""} onChange={(event) => setScores({ ...scores, [match.id]: { home: event.target.value, away: scores[match.id]?.away ?? "" } })} /><span aria-hidden="true">–</span><input type="number" inputMode="numeric" min="0" max="15" step="1" aria-label={`Goles de ${names.get(match.awayId)} en J${match.round}`} placeholder="—" value={scores[match.id]?.away ?? ""} onChange={(event) => setScores({ ...scores, [match.id]: { home: scores[match.id]?.home ?? "", away: event.target.value } })} /></div></div>)}</fieldset><div className={styles.scenarioActions}><button type="submit" disabled={busy || !scenarioMatches.length}>{busy ? "Simulando…" : "Calcular escenario"}</button><button type="button" onClick={resetScenario}><RotateCcw size={15} aria-hidden="true" /> Restablecer</button></div>{error && <p role="alert" className={styles.dataWarning}>{error}</p>}<p role="status" className={styles.smallNote}>{busy ? "El cálculo se ejecuta en tu dispositivo sin bloquear el panel." : scenarioActive ? "Escenario aplicado. Las probabilidades de arriba ya incluyen tus resultados." : "Los escenarios no modifican resultados reales."}</p></form></section>
      </div><section className={`${styles.panel} ${styles.standings}`}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>GRUPO 1</p><h2>Clasificación y opciones</h2></div></div><p className={styles.smallNote}>La tabla muestra la situación real. La última columna estima el descenso{scenarioActive ? " con tu escenario" : ""}.</p><div className={styles.tableScroll}><table><caption className={styles.srOnly}>Clasificación de {competition.source} y probabilidad modelada de descenso</caption><thead><tr><th scope="col">#</th><th scope="col">Equipo</th><th scope="col">PJ</th><th scope="col">Pts</th><th scope="col">↓ %</th></tr></thead><tbody>{competition.teams.map((row) => <tr key={row.id} data-team={row.id === 3} data-zone={row.position === 1 ? "champion" : row.position <= 5 ? "playoff" : row.position >= 16 ? "relegation" : "middle"}><td><span className={styles.position}>{row.position}</span></td><th scope="row">{row.name}</th><td>{row.played}</td><td>{row.points}</td><td>{probability(100 - rowsById.get(row.id)!.survival)}</td></tr>)}</tbody></table></div><div className={styles.legend}><span><i data-zone="champion" />Campeón</span><span><i data-zone="playoff" />Playoff</span><span><i data-zone="relegation" />Descenso</span></div><div className={styles.gaps}><div><span>Proyección del Pontevedra</span><strong>{number(selected.expectedPoints)} pts</strong></div><div><span>Intervalo central del 80 %</span><strong>{selected.lowPoints}–{selected.highPoints} pts</strong></div></div><p className={styles.smallNote}>La posición publicada puede depender de los desempates. Partidos restantes: 38 menos los jugados por cada equipo.</p></section></div>
      <section className={`${styles.panel} ${styles.historyPanel}`} aria-labelledby="history-title"><div className={styles.panelHeading}><div><p className={styles.eyebrow}>LO QUE NOS ENSEÑA LA HISTORIA</p><h2 id="history-title">Dónde estuvo el corte</h2></div><label className={styles.historyFilter}>Grupo <select value={historyGroup} onChange={(event) => setHistoryGroup(event.target.value)}><option value="1">Grupo 1</option><option value="2">Grupo 2</option><option value="all">Ambos</option></select></label></div><div className={styles.tableScroll}><table className={styles.historyTable}><caption className={styles.srOnly}>Puntos de las posiciones finales en temporadas anteriores</caption><thead><tr><th>Temporada</th><th>Grupo</th><th>1.º</th><th>5.º</th><th>6.º</th><th>15.º</th><th>16.º</th></tr></thead><tbody>{historical.filter((row) => historyGroup === "all" || String(row.group) === historyGroup).map((row) => <tr key={`${row.season}-${row.group}`}><th scope="row"><a href={row.sourceUrl} target="_blank" rel="noreferrer">{row.season} ↗</a></th><td>{row.group}</td><td>{row.champion}</td><td>{row.fifth}</td><td>{row.sixth}</td><td><strong>{row.fifteenth}</strong></td><td>{row.sixteenth}</td></tr>)}</tbody></table></div><p className={styles.smallNote}>15.º: último salvado. 16.º: primer descendido por posición. Los mismos puntos pueden dar desenlaces distintos por los desempates; las tablas conservan los ajustes oficiales de puntos. No incluyen posteriores repescas administrativas.</p></section>
      <aside className={styles.explanation}><div className={styles.explanationIcon}><ChartNoAxesCombined size={25} aria-hidden="true" /></div><div><h2>Fútbol, con un poco de perspectiva.</h2><p>Simulamos {number(simulation.iterations, 0)} finales de temporada con históricos, resultados, rivales y localía. El modelo aún no está calibrado: sus probabilidades orientan, no certifican resultados.</p></div><Link href="/pronosticos/metodologia">Cómo se calcula <ArrowRight size={17} aria-hidden="true" /></Link></aside><footer className={styles.footer}><span>Calculadora Granate · Pronósticos · {simulation.version}</span><span>Cálculo: {displayDate(report.generatedAt)}</span><Link href="/pronosticos/metodologia">Metodología</Link></footer>
    </main>
  </div>;
}
