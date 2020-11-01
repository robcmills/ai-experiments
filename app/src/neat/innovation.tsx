export type Innovation = IterableIterator<number>;
// Create a new innovation number generator
export function* innovation(i: number = 0): IterableIterator<number> {
  while (true) yield i++;
}
