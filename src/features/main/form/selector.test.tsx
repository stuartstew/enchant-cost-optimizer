import { act, cleanup, renderHook, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { render } from "@/test-utils";
import { Selector } from "./selector";
import { useSelector } from "./use-selector";

beforeEach(() => {
  cleanup();
});

const user = userEvent.setup();

describe("level toggle group", async () => {
  it("should allow selecting items and enchantments", async () => {
    const { result } = renderHook(() => useSelector());
    const handleChangeItem = (value: string | null) => act(() => result.current.changeItem(value));
    const handleChangeEnchantment = (id: string, level: number) => act(() => result.current.changeEnchant(id, level));

    const { rerender } = render(
      <Selector
        item={result.current.item}
        enchants={result.current.enchants}
        onChangeItem={handleChangeItem}
        onChangeEnchant={handleChangeEnchantment}
      />,
    );

    expect(result.current.item).toBe(null);
    expect(result.current.enchants.size).toBe(0);

    const itemSelector = screen.getByRole("textbox", { name: "form.itemSelector.label" });
    await user.click(itemSelector);

    const option = screen.getByRole("option", { name: "items.pickaxe" });
    await user.click(option);

    expect(result.current.item).toBe("pickaxe");

    rerender(
      <Selector
        item={result.current.item}
        enchants={result.current.enchants}
        onChangeItem={handleChangeItem}
        onChangeEnchant={handleChangeEnchantment}
      />,
    );

    const rows = screen.getAllByRole("row");
    const row = rows.find((row) => within(row).queryByText("enchants.unbreaking") != null);
    expect(row).toBeDefined();
    if (row === undefined) return; // Just to satisfy TypeScript

    const button = within(row).getByRole("button", { name: /3/ });
    await user.click(button);

    expect(result.current.enchants.size).toBe(1);
    expect(result.current.enchants.get("unbreaking")).toBe(3);
  });
});
