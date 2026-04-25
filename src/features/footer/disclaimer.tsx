import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const Disclaimer = () => {
  const { t } = useTranslation();
  return (
    <Text size="sm" c="dimmed">
      {t("disclaimer")}
    </Text>
  );
};
