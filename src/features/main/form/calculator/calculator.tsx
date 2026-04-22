import { Box } from "@mantine/core";
import { useState } from "react";
import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import { CalculateButton } from "./calculate-button";
import { OptimizationModeRadioGroup } from "./optimization-mode-radio-group";
import { TooManyEnchantsMessage } from "./too-many-enchants-message";

const maxEnchantCount = 31;

type Props = {
  item: string | null;
  enchants: Enchants;
  loading: boolean;
  onCalculate: (item: string, enchants: Enchants, optimizationMode: OptimizationMode) => void;
};

export const Calculator = ({ item, enchants, loading, onCalculate }: Props) => {
  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>("level");
  return (
    <div>
      {item !== null && (
        <CalculateButton
          disabled={enchants.size === 0 || enchants.size > maxEnchantCount}
          loading={loading}
          onClick={() => onCalculate(item, enchants, optimizationMode)}
        />
      )}
      {enchants.size > maxEnchantCount && (
        <Box mt="xs">
          <TooManyEnchantsMessage maxEnchantCount={maxEnchantCount} />
        </Box>
      )}
      <Box mt="xs">
        <OptimizationModeRadioGroup optimizationMode={optimizationMode} onChange={setOptimizationMode} />
      </Box>
    </div>
  );
};
