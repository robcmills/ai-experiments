import { Renderer } from 'components/Duel/Renderer';
import { Game } from 'components/Duel/Game';
import { NeatType, NetworkType } from 'components/Duel/NeatTypes';
const { Neat } = require('neataptic');

const options = {};

const EVOLUTIONS = 1000;

export class NeatDuel {
  game: Game;
  neat: NeatType;
  renderer: Renderer;

  constructor(parent: HTMLDivElement) {
    this.renderer = new Renderer(parent);
    this.neat = new Neat(5, 2, this.fitness, options);
    this.start();
  }

  fitness(network: NetworkType) {
    const game = new Game();
    game.addRandomHealth();
    game.addPlayer(network);
    game.run();
    return game.players[0].score(game);
  }

  start() {
    for (let i = 0; i < 100; i++) {
      this.neat.mutate();
    }
    for (let i = 0; i < EVOLUTIONS; i++) {
      if (i % 100 === 0) {
        console.log(`evolving ${i} of ${EVOLUTIONS}`);
      }
      this.neat.evolve();
    }
    this.neat.sort();

    this.game = new Game();
    this.game.addRandomHealth();
    // Simulate and visualize top ten fittest
    for (let i = 0; i < 10; i++) {
      this.game.addPlayer(this.neat.population[i]);
    }

    for (let i = 0; i < 100; i++) {
      this.game.step();
      this.renderer.renderPlayers(this.game);
    }
    this.renderer.renderHealths(this.game);

    // console.log(this);
  }
}
