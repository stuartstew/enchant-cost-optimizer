import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

export const CalculateButton = ({ disabled, loading, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <Button disabled={disabled} loading={loading} onClick={onClick} px="xl">
      {t("form.buttons.calculate")}
    </Button>
  );
};
