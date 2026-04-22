import { act, cleanup, renderHook, screen } from "@testing-library/react";
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
  it("should show an enchantment list when an item is selected", async () => {
    const { result } = renderHook(() => useSelector());

    const { rerender } = render(
      <Selector
        item={result.current.item}
        enchants={result.current.enchants}
        onChangeItem={(value) => act(() => result.current.changeItem(value))}
        onChangeEnchant={(id, level) => act(() => result.current.changeEnchant(id, level))}
      />,
    );

    const itemSelector = screen.getByRole("textbox", { name: "form.itemSelector.label" });
    await user.click(itemSelector);

    const option = screen.getByRole("option", { name: "items.pickaxe" });
    await user.click(option);

    expect(result.current.item).toBe("pickaxe");

    rerender(
      <Selector
        item={result.current.item}
        enchants={result.current.enchants}
        onChangeItem={(value) => act(() => result.current.changeItem(value))}
        onChangeEnchant={(id, level) => act(() => result.current.changeEnchant(id, level))}
      />,
    );

    screen.getByText("enchants.efficiency");
  });
});
