import { Vector2 } from 'util/Vector2';
import { Network } from 'components/Duel/Neataptic';

export class Player {
  public network: Network;
  public position: Vector2 = new Vector2(0, 0);
  public velocity: Vector2 = new Vector2(0, 0);

  constructor(player: Partial<Player>) {
    Object.assign(this, player);
  }
}
