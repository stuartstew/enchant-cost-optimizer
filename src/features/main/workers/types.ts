import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import type { Step } from "@/types/step";

export interface WorkerRequest {
  enchants: Enchants;
  optimizationMode: OptimizationMode;
}

export interface WorkerResponse {
  result?: Step[];
}
