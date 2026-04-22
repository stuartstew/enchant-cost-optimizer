import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import items from "@/data/items.json";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const ItemSelector = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const data = items.map((item) => ({ value: item.id, label: t(`items.${item.id}`) }));
  return (
    <Select
      data={data}
      value={value}
      onChange={onChange}
      label={t("form.itemSelector.label")}
      placeholder={t("form.itemSelector.placeholder")}
      w="fit-content"
    />
  );
};
