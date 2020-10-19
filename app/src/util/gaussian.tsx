// Returns a normally distributed random number (Box-Muller transform)
import { random } from 'util/random';

// todo: Is a generator function really necessary?
export function* gaussian(mean: number = 0, standardDeviation: number = 1) {
  let u, v, s;

  while (true) {
    do {
      v = random(-1, 1);
      u = random(-1, 1);
      s = u ** 2 + v ** 2;
    } while (s === 0 || s >= 1);

    s = Math.sqrt((-2 * Math.log(s)) / s);

    yield s * u * standardDeviation + mean;
    yield s * v * standardDeviation + mean;
  }
}
