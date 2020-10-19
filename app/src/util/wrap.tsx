// todo: convert to simpler clamp?
// Keeps the given value between the specified range
export function wrap(min: number, max: number, value: number) {
  const l = max - min + 1;
  return ((((value - min) % l) + l) % l) + min;
}
