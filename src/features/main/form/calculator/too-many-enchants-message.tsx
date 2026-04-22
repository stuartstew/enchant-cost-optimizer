import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

type Props = {
  maxEnchantCount: number;
};

export const TooManyEnchantsMessage = ({ maxEnchantCount }: Props) => {
  const { t } = useTranslation();
  return (
    <Text size="sm" c="red" fw={500}>
      {t("form.tooManyEnchants", {
        enchantWithCount: t("form.enchantWithCount", { count: maxEnchantCount }),
      })}
    </Text>
  );
};
