import { NextResponse } from "next/server";
import { getGranateCompetition } from "@/lib/forecasts/granate-source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Fuente pública compartida para calendario, horarios y marcadores de Liga.
export async function GET() {
  try {
    const competition = await getGranateCompetition();
    return NextResponse.json({ success: true, timeZone: "Europe/Madrid", data: competition }, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Calendario temporalmente no disponible" }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
