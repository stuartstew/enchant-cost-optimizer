import { Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const AppTitle = () => {
  const { t } = useTranslation();
  return <Title size={24}>{t("title")}</Title>;
};
