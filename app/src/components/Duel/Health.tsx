import { Vector2 } from 'util/Vector2';

const HEALTH_RADIUS = 1;

export class Health {
  amount = 100;
  position = new Vector2(Math.random(), Math.random());
  radius = HEALTH_RADIUS;
  remove: () => void;

  constructor(remove: () => void) {
    this.remove = remove;
  }
}
