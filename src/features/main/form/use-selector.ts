import { useState } from "react";

import { useMap } from "@/hooks/use-map";

export const useSelector = () => {
  const [item, setItem] = useState<string | null>(null);
  const enchants = useMap<string, number>();

  const changeItem = (value: string | null) => {
    setItem(value);
    enchants.clear();
  };

  const changeEnchant = (id: string, level: number) => {
    if (enchants.get(id) === level) {
      enchants.delete(id);
    } else {
      enchants.set(id, level);
    }
  };

  return {
    item,
    enchants,
    changeItem,
    changeEnchant,
  };
};
