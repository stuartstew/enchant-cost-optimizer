import { cleanup, screen } from "@testing-library/react";
import { beforeEach, describe, it, vi } from "vitest";
import { render } from "@/test-utils";
import { EnchantList } from "./enchant-list";

beforeEach(() => {
  cleanup();
});

describe("level toggle group", async () => {
  it("should show an enchantment list when an item is selected", async () => {
    const handleChangeEnchantment = vi.fn();
    render(
      <EnchantList
        item="pickaxe"
        enchants={new Map()}
        allowIncompatible={false}
        onChangeEnchant={handleChangeEnchantment}
      />,
    );
    screen.getByText("enchants.efficiency");
  });
});
