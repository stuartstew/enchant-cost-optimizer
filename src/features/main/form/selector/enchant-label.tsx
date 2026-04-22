import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

type Props = {
  id: string;
  disabled: boolean;
};

export const EnchantLabel = ({ id, disabled }: Props) => {
  const { t } = useTranslation();
  return (
    <Text mr="xl" c={disabled ? "var(--mantine-color-disabled)" : undefined}>
      {t(`enchants.${id}`)}
    </Text>
  );
};
