import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

type Props = {
  id: string;
  disabled: boolean;
};

export const EnchantLabel = ({ id, disabled }: Props) => {
  const { t } = useTranslation();
  const color = disabled ? "var(--mantine-color-disabled)" : undefined;
  return (
    <>
      <Text hiddenFrom="sm" size="sm" mr="xs" c={color} data-testid="label-mobile">
        {t(`enchants.${id}`)}
      </Text>
      <Text visibleFrom="sm" mr="xl" c={color} data-testid="label-desktop">
        {t(`enchants.${id}`)}
      </Text>
    </>
  );
};
