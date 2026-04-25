import enchantDefinitions from "@/data/enchant-definitions.json";
import type { Enchants } from "@/types/enchants";
import type { OptimizationMode } from "@/types/optimization-mode";
import type { Piece, Step } from "@/types/step";
import { powerSet } from "./bitmask";
import { cartesianProduct, cartesianSquare } from "./cartesian-product";
import { min, range, sum } from "./common";

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

const defaultInternalPiece: InternalPiece = { kind: "book", enchantBitmask: 0, anvilUseCount: 0 };

const enchantMap = new Map(enchantDefinitions.map((enchant, i) => [enchant.id, { ...enchant, index: i }]));

/**
 * The minimum cost that is rejected as "Too Expensive!" in an anvil.
 */
const tooExpensiveCost = 40;

const priorWorkPenalty = (anvilUseCount: number) => 2 ** anvilUseCount - 1;

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
  if (Array.from(enchants.keys()).some((id) => !enchantMap.has(id))) {
    const unknownEnchantId = Array.from(enchants.keys()).find((id) => !enchantMap.has(id));
    throw new Error(`unknown enchant id: ${unknownEnchantId}`);
  }

  const enchantDetails = Array.from(enchants.entries()).map(([id, level]) => {
    // biome-ignore lint/style/noNonNullAssertion: we have checked that the map has all given keys
    return { enchant: enchantMap.get(id)!, level };
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
 * @param costs - An array of enchantment costs (level x enchantment multiplier),
 *   where each index corresponds to the enchantment's bit position in the bitmask.
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
 * Calculates the minimum cost table using dynamic programming to find the optimal
 * sequence for applying all enchantments to an item.
 *
 * ## Table Structure
 * The table is structured as `dp[kind][enchantBitmask][anvilUseCount]`, where each entry holds
 * the minimum cumulative cost and the corresponding anvil operation (`step`) needed
 * to produce a piece (item or enchanted book) satisfying the following conditions:
 *
 * - `kind`: The type of piece - `"item"` (the target item) or `"book"` (an enchanted book).
 * - `enchantBitmask`: A bitmask representing the set of enchantments on the piece.
 *   The i-th bit being `1` indicates that the i-th enchantment is present.
 * - `anvilUseCount`: The number of times this piece has been used in an anvil.
 *   Each anvil use increases the "prior work penalty", calculated as `2^anvilUseCount - 1` levels.
 *
 * @param costs - An array of enchantment costs (level x enchantment multiplier),
 *   where each index corresponds to the enchantment's bit position in the bitmask.
 * @returns The dynamic programming table. `dp.book[enchantBitmask][anvilUseCount]` holds entries
 *   for enchanted books and `dp.item[enchantBitmask][anvilUseCount]` for items.
 *   Unreachable states are represented as `undefined`.
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

const updateDpTable = (dp: DpTable, kind: "book" | "item", resultEnchantBitmask: number, costs: number[]) => {
  const target: InternalPiece = { ...defaultInternalPiece, kind };
  const sacrifice: InternalPiece = { ...defaultInternalPiece, kind: "book" };
  const maxAnvilUseCount = computeMaxAnvilUseCount();

  for (target.enchantBitmask of powerSet(resultEnchantBitmask)) {
    sacrifice.enchantBitmask = resultEnchantBitmask & ~target.enchantBitmask;
    const enchantCostSum = sum(costs.filter((_, i) => sacrifice.enchantBitmask & (1 << i)));

    for ([target.anvilUseCount, sacrifice.anvilUseCount] of cartesianSquare(range(maxAnvilUseCount))) {
      const targetSolution = dp[kind][target.enchantBitmask][target.anvilUseCount];
      const sacrificeSolution = dp.book[sacrifice.enchantBitmask][sacrifice.anvilUseCount];
      if (targetSolution === undefined || sacrificeSolution === undefined) continue;

      const operationCost =
        enchantCostSum + priorWorkPenalty(target.anvilUseCount) + priorWorkPenalty(sacrifice.anvilUseCount);

      if (operationCost >= tooExpensiveCost) continue;

      const cumulativeCost = targetSolution.cumulativeCost + sacrificeSolution.cumulativeCost + operationCost;
      const resultAnvilUseCount = Math.max(target.anvilUseCount, sacrifice.anvilUseCount) + 1;

      const oldSolution = dp[kind][resultEnchantBitmask][resultAnvilUseCount];
      if (oldSolution !== undefined && oldSolution.cumulativeCost <= cumulativeCost) continue;

      const step = { target: { ...target }, sacrifice: { ...sacrifice }, operationCost, resultAnvilUseCount };
      dp[kind][resultEnchantBitmask][resultAnvilUseCount] = { cumulativeCost, step };
    }
  }
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

const computeMaxAnvilUseCount = (): number => {
  let maxAnvilUseCount = 0;
  while (priorWorkPenalty(maxAnvilUseCount) < tooExpensiveCost) {
    maxAnvilUseCount++;
  }
  return maxAnvilUseCount;
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
