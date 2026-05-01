/**
 * Returns all submasks of the given bitmask.
 */
export function* submasks(bitmask: number) {
  if (!Number.isSafeInteger(bitmask) || bitmask < 0) {
    return;
  }
  let submask = bitmask;
  while (submask >= 0) {
    submask &= bitmask;
    yield submask;
    submask--;
  }
}
