import { ActionIcon, Menu } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const languages = [
  { value: "en", label: "English" },
  { value: "jp", label: "日本語" },
];

export const LanguagePicker = () => {
  const { i18n } = useTranslation();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="default" size="lg" aria-label="Pick Language">
          <IconLanguage style={{ height: "70%", width: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {languages.map((language) => (
          <Menu.Item key={language.value} onClick={() => i18n.changeLanguage(language.value)}>
            {language.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
