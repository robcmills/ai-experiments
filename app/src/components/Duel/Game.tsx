import { Player } from 'components/Duel/Player';
import { Health } from 'components/Duel/Health';
import { NetworkType } from 'components/Duel/NeatTypes';

export class Game {
  healthsByIndex: Map<number, Health> = new Map();
  isEnd = false;
  playersByIndex: Map<number, Player> = new Map();

  constructor() {
    this.addRandomHealth();
  }

  get healths() {
    return Array.from(this.healthsByIndex.values());
  }

  get nextHealthIndex() {
    return (Array.from(this.healthsByIndex.keys()).pop() || 0) + 1;
  }

  get nextPlayerIndex() {
    return (Array.from(this.playersByIndex.keys()).pop() || 0) + 1;
  }

  get players() {
    return Array.from(this.playersByIndex.values());
  }

  addPlayer(network: NetworkType) {
    this.playersByIndex.set(this.nextPlayerIndex, new Player({ network }));
  }

  addRandomHealth() {
    const remove = () => this.removeHealth(this.nextHealthIndex);
    this.healthsByIndex.set(this.nextHealthIndex, new Health(remove));
  }

  removeHealth(index: number) {
    this.healthsByIndex.delete(index);
  }

  step() {
    this.players.forEach((player) => {
      player.step(this.healths);
      if (player.health <= 0) {
        this.isEnd = true;
      }
    });
  }
}
