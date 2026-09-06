import { unstable_cache } from "next/cache";
import historyData from "./historical-seasons.json";
import { getGranateCompetition } from "./granate-source";
import { MODEL_VERSION, prepareModel, simulate } from "./model";
import type { Competition, HistoricalSeason } from "./model-types";
import { archivePrediction } from "./prediction-archive";

export const historicalSeasons: HistoricalSeason[] = historyData.seasons;

const buildReport = unstable_cache(async (serialized: string) => {
  const competition = JSON.parse(serialized) as Competition;
  const input = prepareModel(competition, historicalSeasons);
  const simulation = simulate(input, 10000);
  const generatedAt = new Date().toISOString();
  const archive = await archivePrediction({ schema: 1, recordedAt: generatedAt, input, simulation });
  return { input, simulation, ...archive, generatedAt };
}, ["granate-model-report-archive-v1", MODEL_VERSION], { revalidate: 3600, tags: ["forecast-report"] });

export async function getForecastReport() {
  const competition = await getGranateCompetition();
  return buildReport(JSON.stringify(competition));
}

export const historicalSummary = historicalSeasons.map((season) => ({
  season: season.season, group: season.group, sourceUrl: season.sourceUrl,
  champion: season.teams.find((team) => team.position === 1)!.points,
  fifth: season.teams.find((team) => team.position === 5)!.points,
  sixth: season.teams.find((team) => team.position === 6)!.points,
  fifteenth: season.teams.find((team) => team.position === 15)!.points,
  sixteenth: season.teams.find((team) => team.position === 16)!.points,
  administrative: season.teams.some((team) => team.administrativeNote),
}));

export type ForecastReport = Awaited<ReturnType<typeof getForecastReport>>;
export type HistoricalSummary = typeof historicalSummary;
