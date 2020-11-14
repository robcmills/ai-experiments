import { Vector2 } from 'util/Vector2';
import { config } from 'components/Duel/config';
const { canvasHeight, canvasWidth } = config;

export const HEALTH_RADIUS =
  0.02 * (canvasHeight > canvasWidth ? canvasWidth : canvasHeight);

export class Health {
  amount = 10;
  position = new Vector2(
    Math.random() * (canvasWidth / 2) - canvasWidth / 4,
    Math.random() * (canvasHeight / 2) - canvasHeight / 4
  );
  radius = HEALTH_RADIUS;
}
