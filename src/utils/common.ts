/**
 * Returns an array of numbers from `0` to `n - 1`.
 */
export const range = (n: number): number[] => {
  const arr = Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
};

export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const min = <T>(arr: Array<T>, comparefn: (a: T, b: T) => number): T | undefined => {
  if (arr.length < 1) {
    return undefined;
  }
  return arr.reduce((a, b) => (comparefn(a, b) > 0 ? b : a));
};
