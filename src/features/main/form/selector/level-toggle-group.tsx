import { Button, Group } from "@mantine/core";
import type { EnchantDefinition } from "@/types/enchant-definition";

type Props = {
  enchant: EnchantDefinition;
  disabled: boolean;
  value: number | undefined;
  onChangeEnchant: (id: string, level: number) => void;
};

export const LevelToggleGroup = ({ enchant, disabled, value, onChangeEnchant }: Props) => {
  const levels = Array.from({ length: enchant.maxLevel }, (_, i) => i + 1);
  return (
    <Group gap="xs">
      {levels.map((level) => (
        <Button
          key={level}
          variant={level === value ? "filled" : "default"}
          onClick={() => onChangeEnchant(enchant.id, level)}
          disabled={disabled}
          px="xs"
        >
          {level}
        </Button>
      ))}
    </Group>
  );
};
