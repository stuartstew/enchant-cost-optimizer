import { describe, expect, it } from "vitest";
import { min, range, sum } from "./common";

describe("min", () => {
  it("should return the smallest item of an array", () => {
    expect(min([1, 2, 0], (a, b) => a - b)).toBe(0);
    expect(min([6, 3, 7, 5], (a, b) => a - b)).toBe(3);
  });

  it("should return the first of the smallest items", () => {
    expect(min([23, 13, 15], (a, b) => (a % 10) - (b % 10))).toBe(23);
    expect(min([13, 23, 15], (a, b) => (a % 10) - (b % 10))).toBe(13);
  });

  it("should return undefined if the array is empty", () => {
    expect(min([], (a, b) => a - b)).toBeUndefined();
  });
});

describe("range", () => {
  it("should return an array of numbers from 0 to n - 1.", () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("sum", () => {
  it("should return the total of the items", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([5, -1, 0, 7])).toBe(11);
  });
});
