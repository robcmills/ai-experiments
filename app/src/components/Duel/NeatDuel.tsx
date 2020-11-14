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
    this.game.addRandomHealth();

    for (let i = 0; i < 100; i++) {
      this.neat.mutate();
    }

    this.neat.population.forEach((network: NetworkType) => {
      this.game.addPlayer(network);
    });

    for (let i = 0; i < 100; i++) {
      this.game.step();
      this.renderer.renderPlayers(this.game);
    }

    this.renderer.renderHealths(this.game);

    this.game.players.forEach((player) => {
      console.log('player.age', player.age);
    });

    console.log(this);
  }
}
