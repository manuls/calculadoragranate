import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "redis";
import { getForecastReport } from "@/lib/forecasts/forecast-service";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const responseOptions = { headers: { "Cache-Control": "no-store" } };
const retryMinutes = new Set(["30", "40", "50"]);

function madridSchedule(date: Date) {
  const values = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date).map((part) => [part.type, part.value]));
  return {
    scheduled: values.weekday === "Sun" && values.hour === "20" && retryMinutes.has(values.minute),
    key: `cron:results-update:${values.year}-${values.month}-${values.day}`,
    attempt: `${values.hour}:${values.minute}`,
  };
}

async function successMarker(key: string, value?: string) {
  if (!process.env.REDIS_URL) return null;
  const client = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 2500, reconnectStrategy: false } });
  client.on("error", () => {});
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await client.connect();
    return await Promise.race([
      value === undefined ? client.get(key) : client.set(key, value, { EX: 172800 }),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("Tiempo de Redis agotado")), 2500); }),
    ]);
  } finally {
    clearTimeout(timeout);
    if (client.isOpen) client.destroy();
  }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const forceUpdate = new URL(request.url).searchParams.get("force") === "1";
  const schedule = madridSchedule(new Date());
  if (!forceUpdate && !schedule.scheduled) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Fuera de los intentos del domingo a las 20:30, 20:40 y 20:50 en Europe/Madrid" }, responseOptions);
  }
  if (!forceUpdate) {
    try {
      if (await successMarker(schedule.key)) {
        return NextResponse.json({ ok: true, skipped: true, reason: "Actualización dominical completada", attempt: schedule.attempt }, responseOptions);
      }
    } catch (error) {
      console.error("No se pudo consultar la marca de actualización dominical:", error);
    }
  }
  try {
    revalidateTag("forecast-source");
    revalidateTag("forecast-report");
    const report = await getForecastReport();
    const ok = report.archiveState === "saved" && report.input.competition.availability === "source";
    if (ok) {
      try {
        await successMarker(schedule.key, report.generatedAt);
      } catch (error) {
        console.error("No se pudo guardar la marca de actualización dominical:", error);
      }
    }
    return NextResponse.json({ ok, source: report.input.competition.source, availability: report.input.competition.availability, archive: report.archiveState, calculatedAt: report.generatedAt, version: report.simulation.version, attempt: schedule.attempt }, { ...responseOptions, status: ok ? 200 : 503 });
  } catch (error) {
    console.error("Falló la actualización dominical de resultados:", error);
    return NextResponse.json({ ok: false, error: "Falló la actualización de resultados", attempt: schedule.attempt }, { ...responseOptions, status: 503 });
  }
}
