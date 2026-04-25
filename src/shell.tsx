import { AppShell, Divider } from "@mantine/core";
import { Footer } from "@/features/footer";
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
        <Divider mt={100} mb={20} />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
};
