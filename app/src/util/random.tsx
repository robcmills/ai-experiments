export function random(from: number = 0, to: number = 1): number {
  return Math.random() * (to - from) + from;
}

export function randomBool(): boolean {
  return Math.random() > 0.5;
}
