import { Button } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const GithubLink = () => {
  const { t } = useTranslation();
  return (
    <a href="https://github.com/stuartstew/enchant-cost-optimizer" target="_blank" rel="noopener noreferrer">
      <Button leftSection={<IconBrandGithub size={16} />} variant="default" size="compact-md">
        {t("github-link")}
      </Button>
    </a>
  );
};
