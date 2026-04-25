import { Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { InfoButton } from "./info-button";
import { InfoModal } from "./info-modal";
import { LanguagePicker } from "./language-picker";

export const Header = () => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <InfoModal opened={opened} onClose={close} />
      <Group h="100%" px="md" justify="space-between">
        <Title size={24}>{t("title")}</Title>
        <Group h="100%" gap="xs">
          <InfoButton onClick={open} />
          <LanguagePicker />
          <ColorSchemeToggle />
        </Group>
      </Group>
    </>
  );
};
