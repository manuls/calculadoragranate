export type Objective = "survival" | "playoff" | "champion";

export type CompetitionTeam = {
  id: number;
  sourceId: string;
  name: string;
  position: number;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  pointsAdjustment: number;
};

export type CompetitionMatch = {
  id: number;
  round: number;
  homeId: number;
  awayId: number;
  date: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
};

export type Competition = {
  season: string;
  capturedAt: string;
  sourceUrl: string;
  source: string;
  availability: "source" | "saved";
  teams: CompetitionTeam[];
  matches: CompetitionMatch[];
};

export type HistoricalSeason = {
  season: string;
  group: number;
  sourceUrl: string;
  capturedAt: string;
  teams: { id: string; name: string; position: number; points: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; pointsAdjustment: number; administrativeNote: boolean }[];
  matches: { id: number; round: number; homeId: string; awayId: string; date: string; homeGoals: number; awayGoals: number }[];
};

export type TeamStrength = { teamId: number; attack: number; defense: number; uncertainty: number };
export type ModelInput = { competition: Competition; strengths: TeamStrength[]; homeMean: number; awayMean: number };
export type FixedScore = { matchId: number; homeGoals: number; awayGoals: number };
export type ProbabilityRow = { teamId: number; survival: number; playoff: number; champion: number; topFive: number; expectedPoints: number; lowPoints: number; highPoints: number };
export type TargetEstimate = { points: number | null; probability: number | null; sampleSize: number; cutLow: number; cutMedian: number; cutHigh: number };
export type Simulation = {
  version: string;
  iterations: number;
  seed: number;
  probabilities: ProbabilityRow[];
  targets: Record<Objective, TargetEstimate>;
  unresolvedTieRate: number;
  fixedScores: FixedScore[];
};
