import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getForecastReport } from "@/lib/forecasts/forecast-service";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function isSundayAt2030InMadrid(date: Date) {
  const values = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date).map((part) => [part.type, part.value]));
  return values.weekday === "Sun" && values.hour === "20" && values.minute === "30";
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const forceUpdate = new URL(request.url).searchParams.get("force") === "1";
  if (!forceUpdate && !isSundayAt2030InMadrid(new Date())) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Fuera de las 20:30 del domingo en Europe/Madrid" });
  }
  revalidateTag("forecast-source");
  revalidateTag("forecast-report");
  const report = await getForecastReport();
  const ok = report.archiveState === "saved" && report.input.competition.availability === "source";
  return NextResponse.json({ ok, source: report.input.competition.source, availability: report.input.competition.availability, archive: report.archiveState, calculatedAt: report.generatedAt, version: report.simulation.version }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
