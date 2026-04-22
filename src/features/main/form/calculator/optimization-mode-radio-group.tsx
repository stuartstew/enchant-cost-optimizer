import { Group, Radio, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import type { OptimizationMode } from "@/types/optimization-mode";

type Props = {
  optimizationMode: string;
  onChange: (mode: OptimizationMode) => void;
};

export const OptimizationModeRadioGroup = ({ optimizationMode, onChange }: Props) => {
  const { t } = useTranslation();
  const handleChange = (value: string) => {
    onChange(value as OptimizationMode);
  };

  return (
    <Group>
      <Text fw={500}>{t("form.optimizeFor")}</Text>
      <Radio.Group value={optimizationMode} onChange={handleChange} name="optimizationMode">
        <Group>
          <Radio value="level" label={t("form.optimizationModeLevel")} />
          <Radio value="priorWork" label={t("form.optimizationModePriorWork")} />
        </Group>
      </Radio.Group>
    </Group>
  );
};
