type CartesianProductElement<T extends unknown[][]> = T extends []
  ? []
  : T extends [Array<infer V>, ...infer W extends unknown[][]]
    ? [V, ...CartesianProductElement<W>]
    : [];

export function* cartesianProduct<T extends unknown[][]>(
  ...args: T
): Generator<CartesianProductElement<T>, void, undefined> {
  if (args.length === 0) yield [] as CartesianProductElement<T>;
  else {
    const [head, ...rest] = args;
    for (const h of head) {
      const restIter = cartesianProduct(...rest);
      for (const r of restIter) {
        yield [h, ...r] as CartesianProductElement<T>;
      }
    }
  }
}

export const cartesianSquare = <T>(set: T[]) => cartesianProduct(set, set);
