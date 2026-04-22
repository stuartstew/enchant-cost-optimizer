import { buildEnchantPlan } from "@/utils/calculate";
import type { WorkerRequest, WorkerResponse } from "./types";

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { enchants, optimizationMode } = e.data;
  const result = buildEnchantPlan(enchants, optimizationMode);
  const response: WorkerResponse = { result };
  postMessage(response);
};
