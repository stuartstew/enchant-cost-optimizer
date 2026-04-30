import { Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppTitle } from "./app-title";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { InfoButton } from "./info-button";
import { InfoModal } from "./info-modal";
import { LanguagePicker } from "./language-picker";

export const Header = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <InfoModal opened={opened} onClose={close} />
      <Group visibleFrom="sm" h="100%" px="md" justify="space-between">
        <AppTitle />
        <Group h="100%" gap="xs">
          <InfoButton onClick={open} />
          <LanguagePicker />
          <ColorSchemeToggle />
        </Group>
      </Group>
      <Stack hiddenFrom="sm" h="100%" gap="md" px="md" justify="center">
        <AppTitle />
        <Group gap="xs">
          <InfoButton onClick={open} />
          <LanguagePicker />
          <ColorSchemeToggle />
        </Group>
      </Stack>
    </>
  );
};
