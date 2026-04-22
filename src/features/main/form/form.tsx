import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import { Calculator } from "./calculator";
import { Selector } from "./selector";

import { useSelector } from "./use-selector";

type Props = {
  loading: boolean;
  onCalculate: (item: string, enchants: Enchants, optimizationMode: OptimizationMode) => void;
};

export const Form = ({ loading, onCalculate }: Props) => {
  const { item, enchants, changeItem, changeEnchant } = useSelector();
  return (
    <>
      <Selector item={item} enchants={enchants} onChangeItem={changeItem} onChangeEnchant={changeEnchant} />
      <Calculator item={item} enchants={enchants} loading={loading} onCalculate={onCalculate} />
    </>
  );
};
