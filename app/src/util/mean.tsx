// Compute the mean of the given values
export function mean(...values: number[]): number {
  return values.length
    ? values.reduce((sum, n) => sum + n, 0) / values.length
    : 0;
}
