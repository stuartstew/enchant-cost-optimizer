import { Box } from "@mantine/core";
import { useState } from "react";
import type { Enchants } from "@/types/enchants";
import { AllowIncompatibleSwitch } from "./allow-incompatible-switch";
import { EnchantList } from "./enchant-list";
import { ItemSelector } from "./item-selector";

type Props = {
  item: string | null;
  enchants: Enchants;
  onChangeItem: (value: string | null) => void;
  onChangeEnchant: (id: string, level: number) => void;
};

export const Selector = ({ item, enchants, onChangeItem, onChangeEnchant }: Props) => {
  const [allowIncompatible, setAllowIncompatible] = useState(false);
  const handleChangeAllowIncompatible = () => {
    if (allowIncompatible) {
      enchants.clear();
    }
    setAllowIncompatible(!allowIncompatible);
  };

  return (
    <div>
      <ItemSelector value={item} onChange={onChangeItem} />
      {item !== null && (
        <>
          <Box mt="xs">
            <EnchantList
              item={item}
              enchants={enchants}
              allowIncompatible={allowIncompatible}
              onChangeEnchant={onChangeEnchant}
            />
          </Box>
          <Box mt="xs" mb="xl">
            <AllowIncompatibleSwitch allowIncompatible={allowIncompatible} onChange={handleChangeAllowIncompatible} />
          </Box>
        </>
      )}
    </div>
  );
};
