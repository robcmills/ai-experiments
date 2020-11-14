import { Vector2 } from 'util/Vector2';
import { Health } from 'components/Duel/Health';
import { NetworkType } from 'components/Duel/NeatTypes';
import { config } from 'components/Duel/config';

const PLAYER_RADIUS = 1;

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

  step(healths: Health[]) {
    this.age++;
    const health = healths[0];
    const inputs = [
      health.position.x,
      health.position.y,
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

    this.health--;
    // if (
    //   this.position.distanceTo(health.position) <
    //   this.radius + health.radius
    // ) {
    //   this.health += health.amount;
    //   health.remove();
    // } else {
    //   this.health -= 1;
    // }
  }
}
