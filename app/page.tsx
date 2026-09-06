import StandingsCalculator from "@/components/standings-calculator"
import { getForecastReport } from "@/lib/forecasts/forecast-service"
export default async function Home() {
  const report = await getForecastReport()
  return <main className="mx-auto w-full max-w-[1480px] px-3 py-4 sm:px-4 md:px-6 md:py-6"><StandingsCalculator report={report} /></main>
}
