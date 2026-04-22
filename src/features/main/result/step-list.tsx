import { Stepper, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import allEnchants from "@/data/enchant-definitions.json";
import type { Enchants } from "@/types/enchants";
import type { Piece, Step } from "@/types/step";

type Props = {
  item: string;
  enchants: Enchants;
  steps: Step[];
  activeStep: number;
  onChangeStep: (value: number) => void;
};

export const StepList = ({ item, enchants, steps, activeStep, onChangeStep }: Props) => {
  const { t } = useTranslation();

  const formatEnchant = (id: string) => {
    const maxLevel = allEnchants.find((enchant) => enchant.id === id)?.maxLevel ?? 1;
    if (maxLevel === 1) {
      return t(`enchants.${id}`);
    } else {
      const level = enchants.get(id) ?? 1;
      return `${t(`enchants.${id}`)} ${level}`;
    }
  };

  const formatPiece = (piece: Piece) => {
    const name = piece.kind === "item" ? t(`items.${item}`) : t("result.book");
    if (piece.enchants.length === 0) {
      return name;
    }
    const enchants = piece.enchants.map(formatEnchant).join(", ");
    return `${name} (${enchants})`;
  };

  const label = (step: Step) => `${formatPiece(step.target)} + ${formatPiece(step.sacrifice)}`;

  const description = (step: Step) =>
    `${t("result.cost")}${t("result.levelWithCount", { count: step.cost })} / ` +
    `${t("result.priorWorkPenalty")}${t("result.levelWithCount", { count: step.priorWorkPenalty })}`;

  return (
    <Stepper active={activeStep} onStepClick={onChangeStep} orientation="vertical">
      {steps.map((step) => (
        <Stepper.Step
          key={undefined}
          label={
            <Text lh="md" inherit>
              {label(step)}
            </Text>
          }
          description={description(step)}
        />
      ))}
    </Stepper>
  );
};
