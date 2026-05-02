import { describe, expect, it } from "vitest";
import { submasks } from "./bitmask";

describe("power set", () => {
  it("should return all submasks of the given bitmask", () => {
    const s1 = Array.from(submasks(0b101));
    expect(s1).toHaveLength(4);
    expect(s1).toContain(0b000);
    expect(s1).toContain(0b001);
    expect(s1).toContain(0b100);
    expect(s1).toContain(0b101);

    const s2 = Array.from(submasks(0b1110));
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

  it("should return [0] when the given bitmask is 0 (empty set)", () => {
    const s = Array.from(submasks(0));
    expect(s).toEqual([0]);
  });

  it("should return an empty array for invalid inputs", () => {
    expect(Array.from(submasks(-1))).toHaveLength(0);
    expect(Array.from(submasks(1.5))).toHaveLength(0);
    expect(Array.from(submasks(1e100))).toHaveLength(0);
  });
});
