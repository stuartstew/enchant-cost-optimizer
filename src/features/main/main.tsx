import { Container } from "@mantine/core";
import { useState } from "react";
import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import type { Step } from "@/types/step";
import { Form } from "./form";
import { Result } from "./result";
import type { WorkerRequest, WorkerResponse } from "./workers/types";
import Worker from "./workers/worker?worker";

export const Main = () => {
  const [savedItem, setSavedItem] = useState("");
  const [savedEnchants, setSavedEnchants] = useState<Enchants>(new Map());
  const [savedOptimizationMode, setSavedOptimizationMode] = useState<OptimizationMode>("level");
  const [error, setError] = useState<string | undefined>(undefined);
  const [optimalSteps, setOptimalSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleCalculate = async (item: string, enchants: Enchants, optimizationMode: OptimizationMode) => {
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

  return (
    <Container size="800" pt="lg" pb={100}>
      <Form loading={loading} onCalculate={handleCalculate} />
      <Result
        savedItem={savedItem}
        savedEnchants={savedEnchants}
        savedOptimizationMode={savedOptimizationMode}
        error={error}
        optimalSteps={optimalSteps}
        activeStep={activeStep}
        onChangeStep={setActiveStep}
      />
    </Container>
  );
};
