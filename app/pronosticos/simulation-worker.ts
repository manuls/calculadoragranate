import { simulate } from "@/lib/forecasts/model";
import type { FixedScore, ModelInput } from "@/lib/forecasts/model-types";

const worker = self as unknown as {
  onmessage: ((event: MessageEvent<{ input: ModelInput; fixedScores: FixedScore[]; seed: number }>) => void) | null;
  postMessage: (message: unknown) => void;
};

worker.onmessage = (event) => {
  try {
    const { input, fixedScores, seed } = event.data;
    worker.postMessage({ success: true, simulation: simulate(input, 10000, fixedScores, seed) });
  } catch (error) {
    worker.postMessage({ success: false, message: error instanceof Error ? error.message : "No se pudo calcular el escenario." });
  }
};
