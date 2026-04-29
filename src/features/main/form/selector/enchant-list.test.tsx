import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/test-utils";
import { EnchantList } from "./enchant-list";

beforeEach(() => {
  cleanup();
});

const user = userEvent.setup();

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

    expect(handleChangeEnchantment).not.toHaveBeenCalled();

    const rows = screen.getAllByRole("row");
    const row = rows.find((row) => within(row).queryByText("enchants.unbreaking") != null);
    expect(row).toBeDefined();
    if (row === undefined) return; // Just to satisfy TypeScript

    const button = within(row).getByRole("button", { name: /3/ });
    await user.click(button);

    expect(handleChangeEnchantment).toHaveBeenCalledTimes(1);
  });
});
