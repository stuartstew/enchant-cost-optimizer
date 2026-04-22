import { describe, expect, it } from "vitest";
import { cartesianProduct } from "./cartesian-product";

describe("cartesian product", () => {
  it("should return cartesian product of one set", () => {
    const s = cartesianProduct([0, 1, 2]);
    expect(Array.from(s)).toEqual([[0], [1], [2]]);
  });

  it("should return cartesian product of two sets", () => {
    const s = cartesianProduct([0, 1], [2, 3, 4]);
    expect(Array.from(s)).toEqual([
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 3],
      [1, 4],
    ]);
  });

  it("should return cartesian product of three sets", () => {
    const s = cartesianProduct([0, 1], [2, 3], [4, 5]);
    expect(Array.from(s)).toEqual([
      [0, 2, 4],
      [0, 2, 5],
      [0, 3, 4],
      [0, 3, 5],
      [1, 2, 4],
      [1, 2, 5],
      [1, 3, 4],
      [1, 3, 5],
    ]);
  });

  it("should return cartesian product of three sets, one of which consists of a single element", () => {
    const s = cartesianProduct([0, 1], [2, 3, 4], [5]);
    expect(Array.from(s)).toEqual([
      [0, 2, 5],
      [0, 3, 5],
      [0, 4, 5],
      [1, 2, 5],
      [1, 3, 5],
      [1, 4, 5],
    ]);
  });
});
