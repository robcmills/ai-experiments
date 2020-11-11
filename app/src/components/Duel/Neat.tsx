import { Game } from 'components/Duel/Game';
import { Network } from 'components/Duel/Neataptic';
const { Neat: Neataptic } = require('neataptic');

const options = {};

export class Neat {
  game: Game;
  neataptic: any;

  constructor(game: Game) {
    this.game = game;
    this.neataptic = new Neataptic(4, 1, null, options);
  }

  start() {
    console.log(this);
    this.neataptic.population.forEach((network: Network) => {
      this.game.addPlayer(network);
    });
    // genome = neat.population[genome];
    // new Player(genome);
  }
}
