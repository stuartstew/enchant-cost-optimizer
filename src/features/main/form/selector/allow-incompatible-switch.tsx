import { Switch } from "@mantine/core";
import { useTranslation } from "react-i18next";

type Props = {
  allowIncompatible: boolean;
  onChange: () => void;
};

export const AllowIncompatibleSwitch = ({ allowIncompatible, onChange }: Props) => {
  const { t } = useTranslation();
  return <Switch checked={allowIncompatible} onChange={onChange} label={t("form.allowIncompatible")} />;
};
