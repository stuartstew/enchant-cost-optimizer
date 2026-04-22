import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === "light" ? (
          <IconMoon style={{ height: "70%", width: "70%" }} stroke={1.5} />
        ) : (
          <IconSun style={{ height: "70%", width: "70%" }} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
};
