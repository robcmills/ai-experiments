export type Innovator = IterableIterator<number>;

export function* getInnovator(i: number = 1): Innovator {
  while (true) yield i++;
}
