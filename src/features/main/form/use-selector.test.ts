import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSelector } from "./use-selector";

describe("use-selector", () => {
  it("should change item", () => {
    const { result } = renderHook(() => useSelector());

    expect(result.current.item).toBeNull();

    act(() => result.current.changeItem("pickaxe"));

    expect(result.current.item).toBe("pickaxe");
  });

  it("should add enchantments", () => {
    const { result } = renderHook(() => useSelector());

    expect(result.current.enchants).toHaveProperty("size", 0);

    act(() => result.current.changeEnchant("efficiency", 5));
    act(() => result.current.changeEnchant("fortune", 3));

    expect(result.current.enchants).toHaveProperty("size", 2);
    expect(result.current.enchants.get("efficiency")).toBe(5);
    expect(result.current.enchants.get("fortune")).toBe(3);
  });

  it("should change enchantment levels", () => {
    const { result } = renderHook(() => useSelector());

    expect(result.current.enchants).toHaveProperty("size", 0);

    act(() => result.current.changeEnchant("efficiency", 5));

    expect(result.current.enchants).toHaveProperty("size", 1);
    expect(result.current.enchants.get("efficiency")).toBe(5);

    act(() => result.current.changeEnchant("efficiency", 4));

    expect(result.current.enchants).toHaveProperty("size", 1);
    expect(result.current.enchants.get("efficiency")).toBe(4);
  });

  it("should remove enchantments", () => {
    const { result } = renderHook(() => useSelector());

    expect(result.current.enchants).toHaveProperty("size", 0);

    act(() => result.current.changeEnchant("efficiency", 5));

    expect(result.current.enchants).toHaveProperty("size", 1);
    expect(result.current.enchants.get("efficiency")).toBe(5);

    act(() => result.current.changeEnchant("efficiency", 5));

    expect(result.current.enchants).toHaveProperty("size", 0);
  });

  it("should clear enchantments when the item is changed", () => {
    const { result } = renderHook(() => useSelector());

    act(() => result.current.changeItem("pickaxe"));

    expect(result.current.item).toBe("pickaxe");
    expect(result.current.enchants).toHaveProperty("size", 0);

    act(() => result.current.changeEnchant("efficiency", 5));

    expect(result.current.enchants).toHaveProperty("size", 1);
    expect(result.current.enchants.get("efficiency")).toBe(5);

    act(() => result.current.changeItem("sword"));

    expect(result.current.item).toBe("sword");
    expect(result.current.enchants).toHaveProperty("size", 0);
  });
});
