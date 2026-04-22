import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/test-utils";
import { CalculateButton } from "./calculate-button";

beforeEach(() => {
  cleanup();
});

const user = userEvent.setup();

describe("calculate button", async () => {
  it("should not be clickable when disabled", async () => {
    const handleClick = vi.fn();

    render(<CalculateButton disabled onClick={handleClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should not be clickable when loading", async () => {
    const handleClick = vi.fn();

    render(<CalculateButton loading onClick={handleClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should be clickable when neither disabled nor loading", async () => {
    const handleClick = vi.fn();

    render(<CalculateButton onClick={handleClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
