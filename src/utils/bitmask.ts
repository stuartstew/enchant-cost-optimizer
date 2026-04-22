/**
 * Returns all subsets of the given set (represented as a bitmask).
 * @param set a set represented as a bitmask.
 */
export function* powerSet(set: number) {
  if (!Number.isSafeInteger(set) || set < 0) {
    return;
  }
  let subset = set;
  while (subset >= 0) {
    subset &= set;
    yield subset;
    subset--;
  }
}
