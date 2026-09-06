import { createHash } from "node:crypto";
import { list, put } from "@vercel/blob";
import type { Competition, ModelInput, Simulation } from "./model-types";

export type PredictionRecord = { schema: 1; recordedAt: string; input: ModelInput; simulation: Simulation };
export type TrendPoint = { round: number; points: number; survival: number; playoff: number; champion: number; recordedAt: string; version: string };

export async function latestSavedCompetition(season: string): Promise<Competition | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const result = await list({ prefix: `predictions/${season}/`, limit: 1000 });
    const candidates = result.blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 10);
    for (const blob of candidates) {
      const response = await fetch(blob.url, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
      if (!response.ok) continue;
      const record = await response.json() as PredictionRecord;
      const competition = record.input?.competition;
      if (record.schema === 1 && competition?.season === season && competition.availability === "source" && competition.teams.length === 20 && competition.matches.length === 380) {
        return { ...competition, availability: "saved" };
      }
    }
  } catch { /* La copia de distribución sigue disponible si falla el almacén. */ }
  return null;
}

export function predictionKey(input: ModelInput, simulation: Simulation) {
  const identity = { version: simulation.version, iterations: simulation.iterations, season: input.competition.season,
    teams: input.competition.teams, matches: input.competition.matches, strengths: input.strengths, homeMean: input.homeMean, awayMean: input.awayMean };
  return `predictions/${input.competition.season}/${simulation.version}/${createHash("sha256").update(JSON.stringify(identity)).digest("hex")}.json`;
}

function toTrend(record: PredictionRecord): TrendPoint {
  const probability = record.simulation.probabilities.find((row) => row.teamId === 3)!;
  return { round: Math.max(0, ...record.input.competition.matches.filter((match) => match.homeGoals !== null).map((match) => match.round)),
    points: record.input.competition.teams.find((team) => team.id === 3)!.points,
    survival: probability.survival, playoff: probability.playoff, champion: probability.champion,
    recordedAt: record.recordedAt, version: record.simulation.version };
}

export async function archivePrediction(record: PredictionRecord) {
  const current = toTrend(record);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { trend: [current], archiveState: "unavailable" as const };
  const prefix = `predictions/${record.input.competition.season}/${record.simulation.version}/`;
  const pathname = predictionKey(record.input, record.simulation);
  try {
    const stored = await list({ prefix, limit: 1000 });
    const existing = stored.blobs.find((blob) => blob.pathname === pathname);
    if (!existing) {
      try {
        await put(pathname, JSON.stringify(record), { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: false });
      } catch (error) {
        const concurrent = await list({ prefix: pathname, limit: 1 });
        if (!concurrent.blobs.some((blob) => blob.pathname === pathname)) throw error;
      }
    }
    const records: TrendPoint[] = [];
    // El almacén solo recibe documentos generados en el servidor, nunca archivos del visitante.
    for (let start = 0; start < stored.blobs.length; start += 8) {
      const batch = await Promise.allSettled(stored.blobs.slice(start, start + 8).map(async (blob) => {
        const response = await fetch(blob.url, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
        if (!response.ok) throw new Error("Registro temporalmente no disponible.");
        const saved = await response.json() as PredictionRecord;
        if (saved.schema !== 1 || saved.simulation.version !== record.simulation.version || !saved.simulation.probabilities.some((row) => row.teamId === 3)) throw new Error("Registro incompatible.");
        return toTrend(saved);
      }));
      for (const item of batch) if (item.status === "fulfilled") records.push(item.value);
    }
    if (!existing || !records.length) records.push(current);
    // Se conserva todo en Blob. En la gráfica se resume el último cálculo de cada jornada.
    const byRound = new Map<number, TrendPoint>();
    records.sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)).forEach((item) => byRound.set(item.round, item));
    return { trend: [...byRound.values()].sort((a, b) => a.round - b.round), archiveState: "saved" as const };
  } catch {
    return { trend: [current], archiveState: "unavailable" as const };
  }
}
