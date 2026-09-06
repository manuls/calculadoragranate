import { getForecastReport, historicalSummary } from "@/lib/forecasts/forecast-service";
import { ModelDashboard } from "./model-dashboard";

export async function SeasonDashboard() {
  const report = await getForecastReport();
  return <ModelDashboard report={report} historical={historicalSummary} />;
}
