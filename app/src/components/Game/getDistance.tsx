export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}
