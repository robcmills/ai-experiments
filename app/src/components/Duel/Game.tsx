import { Player } from 'components/Duel/Player';
import { Network } from 'components/Duel/Neataptic';

export class Game {
  playersByIndex: Map<number, Player> = new Map();

  get nextIndex() {
    return (Array.from(this.playersByIndex.keys()).pop() || 0) + 1;
  }

  addPlayer(network: Network) {
    this.playersByIndex.set(this.nextIndex, new Player({ network }));
  }
}
