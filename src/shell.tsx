import { AppShell, Divider, useMatches } from "@mantine/core";
import { Footer } from "@/features/footer";
import { Header } from "@/features/header";
import { Main } from "@/features/main";

export const Shell = () => {
  const height = useMatches({
    base: 120,
    sm: 60,
  });

  return (
    <AppShell header={{ height }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Main />
        <Divider />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
};
