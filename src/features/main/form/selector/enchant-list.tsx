import { Table } from "@mantine/core";
import enchantDefinitions from "@/data/enchant-definitions.json";
import items from "@/data/items.json";
import type { Enchants } from "@/types/enchants";
import { EnchantLabel } from "./enchant-label";
import { LevelToggleGroup } from "./level-toggle-group";

type Props = {
  item: string;
  enchants: Enchants;
  allowIncompatible: boolean;
  onChangeEnchant: (id: string, level: number) => void;
};

export const EnchantList = ({ item, enchants, allowIncompatible, onChangeEnchant }: Props) => {
  const itemDetail = items.find((x) => x.id === item);
  if (itemDetail === undefined) return undefined;
  const applicableEnchants = itemDetail.enchants.map((id) => enchantDefinitions.find((enchant) => enchant.id === id));

  return (
    <Table w="fit-content">
      <Table.Tbody>
        {applicableEnchants.map((enchant) => {
          if (enchant === undefined) return undefined;
          const disabled = !allowIncompatible && enchant.incompatible.some((id) => enchants.has(id));
          return (
            <Table.Tr key={enchant.id}>
              <Table.Td>
                <EnchantLabel id={enchant.id} disabled={disabled} />
              </Table.Td>
              <Table.Td>
                <LevelToggleGroup
                  enchant={enchant}
                  disabled={disabled}
                  value={enchants.get(enchant.id)}
                  onChangeEnchant={onChangeEnchant}
                />
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
