import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Shell } from "@/shell";

export const App = () => (
  <MantineProvider>
    <Shell />
  </MantineProvider>
);
