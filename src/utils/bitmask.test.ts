import { describe, expect, it } from "vitest";
import { powerSet } from "./bitmask";

describe("power set", () => {
  it("should return the power set of the given set", () => {
    const s1 = Array.from(powerSet(0b101));
    expect(s1).toHaveLength(4);
    expect(s1).toContain(0b000);
    expect(s1).toContain(0b001);
    expect(s1).toContain(0b100);
    expect(s1).toContain(0b101);

    const s2 = Array.from(powerSet(0b1110));
    expect(s2).toHaveLength(8);
    expect(s2).toContain(0b0000);
    expect(s2).toContain(0b0010);
    expect(s2).toContain(0b0100);
    expect(s2).toContain(0b0110);
    expect(s2).toContain(0b1000);
    expect(s2).toContain(0b1010);
    expect(s2).toContain(0b1100);
    expect(s2).toContain(0b1110);
  });

  it("should return [0] when the given set is 0 (empty set)", () => {
    const s = Array.from(powerSet(0));
    expect(s).toEqual([0]);
  });

  it("should return an empty array for invalid inputs", () => {
    expect(Array.from(powerSet(-1))).toHaveLength(0);
    expect(Array.from(powerSet(1.5))).toHaveLength(0);
    expect(Array.from(powerSet(1e100))).toHaveLength(0);
  });
});
