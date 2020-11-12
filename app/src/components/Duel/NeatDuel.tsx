import { Renderer } from 'components/Duel/Renderer';
import { Game } from 'components/Duel/Game';
import { NeatType, NetworkType } from 'components/Duel/NeatTypes';
const { Neat } = require('neataptic');

const options = {};

export class NeatDuel {
  game: Game;
  neat: NeatType;
  renderer: Renderer;

  constructor(parent: HTMLDivElement) {
    this.renderer = new Renderer(parent);
    this.neat = new Neat(4, 2, null, options);
    this.start();
  }

  start() {
    this.game = new Game();

    this.neat.population.forEach((network: NetworkType) => {
      this.game.addPlayer(network);
    });

    while (!this.game.isEnd) {
      this.game.step();
      this.renderer.render(this.game);
    }

    console.log(this);
  }
}
