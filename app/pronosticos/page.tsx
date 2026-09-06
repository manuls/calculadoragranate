import type { Metadata } from "next";
import { SeasonDashboard } from "./season-dashboard";

export const metadata: Metadata = {
  title: "Pronósticos del Pontevedra",
  description: "Clasificación, resultados y calendario del Pontevedra CF en Primera Federación. Probabilidades de permanencia, playoff y campeonato.",
  alternates: { canonical: "/pronosticos" },
};

export default async function ForecastPage() {
  return SeasonDashboard();
}
