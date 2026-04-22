import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/test-utils";
import { LevelToggleGroup } from "./level-toggle-group";

beforeEach(() => {
  cleanup();
});

const user = userEvent.setup();

describe("level toggle group", async () => {
  it("should show exactly one button when the max level is 1", async () => {
    const handleChangeEnchant = vi.fn();
    const enchant = { id: "example", maxLevel: 1, multiplier: 1, incompatible: [] };

    render(
      <LevelToggleGroup enchant={enchant} disabled={false} value={undefined} onChangeEnchant={handleChangeEnchant} />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleChangeEnchant).toHaveBeenLastCalledWith("example", 1);
  });

  it("should show 3 buttons when the max level is 3", async () => {
    const handleChangeEnchant = vi.fn();
    const enchant = { id: "example", maxLevel: 3, multiplier: 1, incompatible: [] };

    render(
      <LevelToggleGroup enchant={enchant} disabled={false} value={undefined} onChangeEnchant={handleChangeEnchant} />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3);

    for (let i = 1; i <= 3; i++) {
      const button = screen.getByRole("button", { name: new RegExp(i.toString(), "i") });
      await user.click(button);

      expect(handleChangeEnchant).toHaveBeenLastCalledWith("example", i);
    }
  });

  it("should not be clickable when disabled", async () => {
    const handleChangeEnchant = vi.fn();
    const enchant = { id: "example", maxLevel: 1, multiplier: 1, incompatible: [] };

    render(<LevelToggleGroup enchant={enchant} disabled value={undefined} onChangeEnchant={handleChangeEnchant} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleChangeEnchant).not.toHaveBeenCalled();
  });
});
