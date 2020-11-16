import { Renderer } from 'components/Duel/Renderer';
import { Game } from 'components/Duel/Game';
import { NeatType, NetworkType } from 'components/Duel/NeatTypes';
const { Neat } = require('neataptic');

const options = {
  elitism: 10,
  popsize: 100,
};

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
    return Promise.resolve(game.players[0].score(game));
  }

  async start() {
    // Provide some initial variety
    for (let i = 0; i < 100; i++) {
      this.neat.mutate();
    }

    // Evolve a champion
    let champion: NetworkType;
    for (let i = 0; i < EVOLUTIONS; i++) {
      const fittest = await this.neat.evolve();
      const championScore = (champion && champion.score) || 0;
      if (fittest.score > championScore) {
        champion = fittest;
      }
      if (i % 100 === 0) {
        console.log(`evolving ${i} of ${EVOLUTIONS}`);
        console.log('champion.score', champion.score);
      }
    }
    console.log('final champion.score', champion.score);

    // Simulate and visualize fittest
    this.game = new Game();
    this.game.addRandomHealth();
    this.game.addPlayer(champion);
    for (let i = 0; i < 100; i++) {
      this.game.step();
      this.renderer.renderPlayers(this.game);
    }
    this.renderer.renderHealths(this.game);

    // console.log(this);
  }
}
