import { useState } from "react";
import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import type { Step } from "@/types/step";
import type { WorkerRequest, WorkerResponse } from "./workers/types";
import Worker from "./workers/worker?worker";

export const useCalculator = () => {
  const [savedItem, setSavedItem] = useState("");
  const [savedEnchants, setSavedEnchants] = useState<Enchants>(new Map());
  const [savedOptimizationMode, setSavedOptimizationMode] = useState<OptimizationMode>("level");
  const [error, setError] = useState<string | undefined>(undefined);
  const [optimalSteps, setOptimalSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const calculate = async (item: string, enchants: Enchants, optimizationMode: OptimizationMode) => {
    const worker = new Worker();
    setLoading(true);

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.result === undefined) {
        setError("No optimal solution found");
      } else {
        setSavedItem(item);
        setSavedEnchants(enchants);
        setSavedOptimizationMode(optimizationMode);
        setError(undefined);
        setOptimalSteps(e.data.result);
        setActiveStep(0);
      }
      setLoading(false);
      worker.terminate();
    };

    const request: WorkerRequest = { enchants, optimizationMode };
    worker.postMessage(request);
  };

  return {
    savedItem,
    savedEnchants,
    savedOptimizationMode,
    error,
    optimalSteps,
    loading,
    activeStep,
    setActiveStep,
    calculate,
  };
};
