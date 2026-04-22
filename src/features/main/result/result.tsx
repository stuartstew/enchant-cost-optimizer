import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import type { Step } from "@/types/step";
import { ErrorAlert } from "./error-alert";
import { StepList } from "./step-list";

type Props = {
  savedItem: string;
  savedEnchants: Enchants;
  savedOptimizationMode: OptimizationMode;
  error?: string;
  optimalSteps: Step[];
  activeStep: number;
  onChangeStep: (value: number) => void;
};

export const Result = ({
  savedItem,
  savedEnchants,
  savedOptimizationMode,
  error,
  optimalSteps,
  activeStep,
  onChangeStep,
}: Props) => {
  const { t } = useTranslation();
  const totalCost = optimalSteps.reduce((acc, step) => acc + step.cost, 0);
  if (error !== undefined) {
    return <ErrorAlert title={t("result.error")}>{error}</ErrorAlert>;
  }
  if (optimalSteps.length > 0) {
    return (
      <div>
        <Text mb="xs" size="xl" fw={500}>
          {savedOptimizationMode === "level" ? t("result.optimalSolutionLevel") : t("result.optimalSolutionPriorWork")}
        </Text>
        <Text mb="md">
          <Text span fw={500}>
            {t("result.totalCost")}
          </Text>
          {t("result.levelWithCount", { count: totalCost })}
        </Text>
        <StepList
          item={savedItem}
          enchants={savedEnchants}
          steps={optimalSteps}
          activeStep={activeStep}
          onChangeStep={onChangeStep}
        />
      </div>
    );
  }
};
