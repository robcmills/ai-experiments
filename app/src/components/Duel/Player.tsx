import { Vector2 } from 'util/Vector2';
import { Health } from 'components/Duel/Health';
import { NetworkType } from 'components/Duel/NeatTypes';

const PLAYER_RADIUS = 1;

export class Player {
  public health = 100;
  public network: NetworkType;
  public position: Vector2 = new Vector2(0, 0);
  public radius = PLAYER_RADIUS;

  constructor(player: Partial<Player>) {
    Object.assign(this, player);
  }

  step(healths: Health[]) {
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

    if (
      this.position.distanceTo(health.position) <
      this.radius + health.radius
    ) {
      this.health += health.amount;
      health.remove();
    } else {
      this.health -= 1;
    }
  }
}
