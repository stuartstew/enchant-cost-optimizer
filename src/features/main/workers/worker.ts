import type { WorkerRequest, WorkerResponse } from "./types";
import { buildEnchantPlan } from "./utils";

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { enchants, optimizationMode } = e.data;
  const result = buildEnchantPlan(enchants, optimizationMode);
  const response: WorkerResponse = { result };
  postMessage(response);
};
