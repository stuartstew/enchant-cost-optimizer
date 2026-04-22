import { Group, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { LanguagePicker } from "./language-picker";

export const Header = () => {
  const { t } = useTranslation();
  return (
    <Group h="100%" px="md" justify="space-between">
      <Title size={24}>{t("title")}</Title>
      <Group h="100%" gap="xs">
        <LanguagePicker />
        <ColorSchemeToggle />
      </Group>
    </Group>
  );
};
