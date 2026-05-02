import enchantDefinitions from "@/data/enchant-definitions.json";
import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import type { Piece, Step } from "@/types/step";
import { submasks } from "@/utils/bitmask";
import { cartesianProduct, cartesianSquare } from "@/utils/cartesian-product";
import { min, range, sum } from "@/utils/common";

type InternalStep = {
  target: InternalPiece;
  sacrifice: InternalPiece;
  operationCost: number;
  resultAnvilUseCount: number;
};

type InternalPiece = {
  kind: "book" | "item";
  enchantBitmask: number;
  anvilUseCount: number;
};

type Solution = {
  cumulativeCost: number;
  step?: InternalStep;
};

type DpTable = {
  book: (Solution | undefined)[][];
  item: (Solution | undefined)[][];
};

const DEFAULT_INTERNAL_PIECE: InternalPiece = { kind: "book", enchantBitmask: 0, anvilUseCount: 0 };

const ENCHANT_MAP = new Map(enchantDefinitions.map((enchant, i) => [enchant.id, { ...enchant, index: i }]));

/**
 * The minimum cost that is rejected as "Too Expensive!" in an anvil.
 */
const TOO_EXPENSIVE_COST = 40;

const priorWorkPenalty = (anvilUseCount: number) => 2 ** anvilUseCount - 1;

const computeMaxAnvilUseCount = (): number => {
  let maxAnvilUseCount = 0;
  while (priorWorkPenalty(maxAnvilUseCount) < TOO_EXPENSIVE_COST) {
    maxAnvilUseCount++;
  }
  return maxAnvilUseCount;
};

const MAX_ANVIL_USE_COUNT = computeMaxAnvilUseCount();

/**
 * Builds the optimal sequence for applying all given enchantments to an item.
 * @param enchants - The enchantments applied to an item.
 * @param optimizationMode - The criterion for optimization.
 * @returns One of the optimal sequences for applying all enchantments to an item,
 *   or `undefined` if no optimal sequences are found.
 */
export const buildEnchantPlan = (enchants: Enchants, optimizationMode: OptimizationMode): Step[] | undefined => {
  const { ids, costs } = rearrangeEnchants(enchants);
  const steps = buildInternalEnchantPlan(costs, optimizationMode);
  return steps?.map((step) => ({
    target: internalPieceToPiece(step.target, ids),
    sacrifice: internalPieceToPiece(step.sacrifice, ids),
    cost: step.operationCost,
    priorWorkPenalty: priorWorkPenalty(step.resultAnvilUseCount),
  }));
};

const rearrangeEnchants = (enchants: Enchants): { ids: string[]; costs: number[] } => {
  if (Array.from(enchants.keys()).some((id) => !ENCHANT_MAP.has(id))) {
    const unknownEnchantId = Array.from(enchants.keys()).find((id) => !ENCHANT_MAP.has(id));
    throw new Error(`unknown enchant id: ${unknownEnchantId}`);
  }

  const enchantDetails = Array.from(enchants.entries()).map(([id, level]) => {
    // biome-ignore lint/style/noNonNullAssertion: we have checked that the map has all given keys
    return { enchant: ENCHANT_MAP.get(id)!, level };
  });

  // Ensure that the order in which enchantments are selected does not affect the result
  enchantDetails.sort((a, b) => a.enchant.index - b.enchant.index);

  const ids = enchantDetails.map(({ enchant }) => enchant.id);
  const costs = enchantDetails.map(({ enchant, level }) => level * enchant.multiplier);

  return { ids, costs };
};

const internalPieceToPiece = (internalPiece: InternalPiece, enchantIds: string[]): Piece => ({
  ...internalPiece,
  enchants: decodeEnchantIdsFromBitmask(internalPiece.enchantBitmask, enchantIds),
});

const decodeEnchantIdsFromBitmask = (enchantBitmask: number, enchantIds: string[]): string[] =>
  enchantIds.filter((_, i) => enchantBitmask & (1 << i));

/**
 * Calculates the minimum cost table, and reconstruct the optimal
 * sequence for applying all enchantments to an item.
 * @param costs - An array of enchantment costs (level * enchantment multiplier)
 * @param optimizationMode - The criterion for optimization.
 * @returns One of the optimal sequences for applying all enchantments to an item,
 *   or `undefined` if no optimal sequences are found.
 */
const buildInternalEnchantPlan = (costs: number[], optimizationMode: OptimizationMode): InternalStep[] | undefined => {
  const dp = minimumCostTable(costs);
  const optimalSolution = findOptimalSolution(dp, optimizationMode);
  if (optimalSolution === undefined) return undefined;
  return reconstructOptimalSteps(dp, optimalSolution);
};

const findOptimalSolution = (dp: DpTable, optimizationMode: OptimizationMode): Solution | undefined => {
  const solutionsWithAllEnchants = dp.item.at(-1);
  if (solutionsWithAllEnchants === undefined) return undefined;

  const candidates = solutionsWithAllEnchants.filter((x) => x !== undefined);
  switch (optimizationMode) {
    case "level":
      return min(candidates, (a, b) => a.cumulativeCost - b.cumulativeCost);
    case "priorWork":
      return candidates.at(0);
  }
};

const reconstructOptimalSteps = (dp: DpTable, optimalSolution: Solution): InternalStep[] => {
  // depth-first search
  const optimalSteps: InternalStep[] = [];
  const stack = [optimalSolution];
  while (stack.length > 0) {
    // biome-ignore lint/style/noNonNullAssertion: stack.length > 0
    const solution = stack.pop()!;
    if (solution.step === undefined) continue;
    optimalSteps.push(solution.step);
    const { target, sacrifice } = solution.step;
    stack.push(
      // biome-ignore lint/style/noNonNullAssertion: the dp table guarantees that these values are defined
      dp[target.kind][target.enchantBitmask][target.anvilUseCount]!,
      // biome-ignore lint/style/noNonNullAssertion: same as above
      dp[sacrifice.kind][sacrifice.enchantBitmask][sacrifice.anvilUseCount]!,
    );
  }
  return optimalSteps.reverse();
};

/**
 * Calculates the minimum cost table using dynamic programming to find
 * the optimal order for applying all enchantments to an item.
 *
 * ## Overview
 *
 * This function efficiently finds the optimal steps using **dynamic programming (DP)** and **bitmasking**.
 * We use a 3D DP table,
 * where `dp[kind][enchantBitmask][anvilUseCount]` stores the solution for a piece (an item or a book)
 * that satisfies following requirements:
 * - `kind`: The type of the piece (`"item"` or `"book"`).
 * - `enchantBitmask`: A bitmask representing the set of enchantments on the piece.
 *   If the i-th bit is `1`, the piece has the i-th enchantment.
 * - `anvilUseCount`: How many times the piece has been used on an anvil.
 *
 * A solution includes the **minimum cumulative cost** of the piece,
 * and the **final step** required in the anvil to obtain it at that cost.
 * If there is no way to obtain the piece in an anvil, the solution will be `undefined`.
 *
 * ## Complexity
 *
 * The time complexity is O(3ⁿ * (n + m²)) and the space complexity is O(2ⁿ * m),
 * where n is the number of enchantments, and m is `MAX_ANVIL_USE_COUNT`.
 *
 * @param costs - An array of enchantment costs (level * enchantment multiplier).
 * @returns The minimum cost table calculated using dynamic programming.
 */
const minimumCostTable = (costs: number[]): DpTable => {
  const n = costs.length;
  const dp = initializeDpTable(n);

  const kinds: ("book" | "item")[] = ["book", "item"];
  for (const [kind, resultEnchantBitmask] of cartesianProduct(kinds, range(1 << n))) {
    updateDpTable(dp, kind, resultEnchantBitmask, costs);
  }

  return dp;
};

const initializeDpTable = (n: number): DpTable => {
  const dp = {
    book: Array.from({ length: 1 << n }, (): (Solution | undefined)[] => []),
    item: Array.from({ length: 1 << n }, (): (Solution | undefined)[] => []),
  };

  // Assuming you have enchanted books, each with single enchantment (with an anvil use count of 0),
  for (const i of range(n)) {
    dp.book[1 << i][0] = { cumulativeCost: 0 };
  }

  // and an unenchanted item (also with an anvil use count of 0).
  dp.item[0][0] = { cumulativeCost: 0 };

  return dp;
};

const updateDpTable = (dp: DpTable, kind: "book" | "item", resultEnchantBitmask: number, costs: number[]) => {
  const target: InternalPiece = { ...DEFAULT_INTERNAL_PIECE, kind };
  const sacrifice: InternalPiece = { ...DEFAULT_INTERNAL_PIECE, kind: "book" };

  for (target.enchantBitmask of submasks(resultEnchantBitmask)) {
    sacrifice.enchantBitmask = resultEnchantBitmask & ~target.enchantBitmask;
    const enchantCostSum = sum(costs.filter((_, i) => sacrifice.enchantBitmask & (1 << i)));

    for ([target.anvilUseCount, sacrifice.anvilUseCount] of cartesianSquare(range(MAX_ANVIL_USE_COUNT))) {
      const targetSolution = dp[kind][target.enchantBitmask][target.anvilUseCount];
      const sacrificeSolution = dp.book[sacrifice.enchantBitmask][sacrifice.anvilUseCount];
      if (targetSolution === undefined || sacrificeSolution === undefined) continue;

      const operationCost =
        enchantCostSum + priorWorkPenalty(target.anvilUseCount) + priorWorkPenalty(sacrifice.anvilUseCount);

      if (operationCost >= TOO_EXPENSIVE_COST) continue;

      const cumulativeCost = targetSolution.cumulativeCost + sacrificeSolution.cumulativeCost + operationCost;
      const resultAnvilUseCount = Math.max(target.anvilUseCount, sacrifice.anvilUseCount) + 1;

      const oldSolution = dp[kind][resultEnchantBitmask][resultAnvilUseCount];
      if (oldSolution !== undefined && oldSolution.cumulativeCost <= cumulativeCost) continue;

      const step = { target: { ...target }, sacrifice: { ...sacrifice }, operationCost, resultAnvilUseCount };
      dp[kind][resultEnchantBitmask][resultAnvilUseCount] = { cumulativeCost, step };
    }
  }
};

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;
  const totalCost = (steps: InternalStep[]) => steps.reduce((acc, step) => acc + step.operationCost, 0);

  describe("optimal steps", () => {
    it("should return one of the sequences with the lowest cumulative cost", () => {
      const steps1 = buildInternalEnchantPlan([5], "level");

      expect(steps1).toBeDefined();
      if (steps1 === undefined) return; // satisfy TypeScript
      expect(steps1).toHaveLength(1);
      expect(steps1[0].target).toEqual({ kind: "item", enchantBitmask: 0, anvilUseCount: 0 });
      expect(steps1[0].sacrifice).toEqual({ kind: "book", enchantBitmask: 1, anvilUseCount: 0 });
      expect(steps1[0].resultAnvilUseCount).toBe(1);
      expect(steps1[0].operationCost).toBe(5);

      const steps2 = buildInternalEnchantPlan([1, 2], "level");

      expect(steps2).toBeDefined();
      if (steps2 === undefined) return; // satisfy TypeScript
      expect(steps2).toHaveLength(2);
      expect(steps2[1].target.kind).toBe("item");
      expect(steps2[1].target.anvilUseCount).toBe(1);
      expect(steps2[1].resultAnvilUseCount).toBe(2);
      expect(totalCost(steps2)).toBe(4);

      const steps3 = buildInternalEnchantPlan([3, 4, 5], "level");

      expect(steps3).toBeDefined();
      if (steps3 === undefined) return; // satisfy TypeScript
      expect(steps3).toHaveLength(3);
      expect(steps3[2].target.kind).toBe("item");
      expect(steps3[2].target.anvilUseCount).toBe(2);
      expect(steps3[2].resultAnvilUseCount).toBe(3);
      expect(totalCost(steps3)).toBe(16);
    });

    it("should return one of the sequences with the lowest prior work penalty", () => {
      const steps1 = buildInternalEnchantPlan([5], "level");

      expect(steps1).toBeDefined();
      if (steps1 === undefined) return; // satisfy TypeScript
      expect(steps1).toHaveLength(1);
      expect(steps1[0].target).toEqual({ kind: "item", enchantBitmask: 0, anvilUseCount: 0 });
      expect(steps1[0].sacrifice).toEqual({ kind: "book", enchantBitmask: 1, anvilUseCount: 0 });
      expect(steps1[0].resultAnvilUseCount).toBe(1);
      expect(steps1[0].operationCost).toBe(5);

      const steps2 = buildInternalEnchantPlan([1, 2], "priorWork");

      expect(steps2).toBeDefined();
      if (steps2 === undefined) return; // satisfy TypeScript
      expect(steps2).toHaveLength(2);
      expect(steps2[1].target.kind).toBe("item");
      expect(steps2[1].target.anvilUseCount).toBe(1);
      expect(steps2[1].resultAnvilUseCount).toBe(2);
      expect(totalCost(steps2)).toBe(4);

      const steps3 = buildInternalEnchantPlan([3, 4, 5], "priorWork");

      expect(steps3).toBeDefined();
      if (steps3 === undefined) return; // satisfy TypeScript
      expect(steps3).toHaveLength(3);
      expect(steps3[2].target.kind).toBe("item");
      expect(steps3[2].target.anvilUseCount).toBe(1);
      expect(steps3[2].resultAnvilUseCount).toBe(2);
      expect(totalCost(steps3)).toBe(17);
    });

    it("should return undefined when there are no optimal sequences", () => {
      const stepsLevel = buildInternalEnchantPlan([1000], "level");
      expect(stepsLevel).toBeUndefined();

      const stepsPriorWork = buildInternalEnchantPlan([1000], "priorWork");
      expect(stepsPriorWork).toBeUndefined();
    });
  });
}
