import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getForecastReport } from "@/lib/forecasts/forecast-service";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  revalidateTag("forecast-source");
  revalidateTag("forecast-report");
  const report = await getForecastReport();
  const ok = report.archiveState === "saved" && report.input.competition.availability === "source";
  return NextResponse.json({ ok, source: report.input.competition.availability, archive: report.archiveState, calculatedAt: report.generatedAt, version: report.simulation.version }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
