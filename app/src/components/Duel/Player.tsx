import { Vector2 } from 'util/Vector2';
import { NetworkType } from 'components/Duel/NeatTypes';
import { config } from 'components/Duel/config';
import { Game } from 'components/Duel/Game';
const { canvasHeight, canvasWidth } = config;

export const PLAYER_RADIUS =
  0.005 * (canvasHeight > canvasWidth ? canvasWidth : canvasHeight);

export class Player {
  public age = 0;
  public health = 100;
  public hue = Math.random() * 360;
  public network: NetworkType;
  public position: Vector2 = new Vector2(0, 0);
  public radius = PLAYER_RADIUS;

  constructor(player: Partial<Player>) {
    Object.assign(this, player);
  }

  score(game: Game) {
    return this.health - this.position.distanceTo(game.healths[0].position);
  }

  step(game: Game) {
    this.age++;
    const health = game.healths[0];
    const inputs = [
      health.position.x,
      health.position.y,
      health.amount,
      this.position.x,
      this.position.y,
    ];
    const [velocityX, velocityY] = this.network.activate(inputs);

    this.position.x += velocityX;
    this.position.y += velocityY;

    // Kill players that step out of bounds
    if (
      Math.abs(this.position.x) > config.canvasWidth / 2 ||
      Math.abs(this.position.y) > config.canvasHeight / 2
    ) {
      this.health = 0;
    }

    if (
      this.position.distanceTo(health.position) <
      this.radius + health.radius
    ) {
      this.health += health.amount;
    } else {
      this.health -= 1;
    }
  }
}
