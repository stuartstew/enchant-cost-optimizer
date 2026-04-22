import { AppShell } from "@mantine/core";
import { Header } from "@/features/header";
import { Main } from "@/features/main";

export const Shell = () => {
  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Main />
      </AppShell.Main>
    </AppShell>
  );
};
