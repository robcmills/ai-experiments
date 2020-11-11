import { Renderer } from 'components/Duel/Renderer';
import { Game } from 'components/Duel/Game';
import { Neat } from 'components/Duel/Neat';

export class NeatDuel {
  game: Game;
  neat: Neat;
  renderer: Renderer;

  constructor(parent: HTMLDivElement) {
    this.renderer = new Renderer(parent);
    this.game = new Game();
    this.neat = new Neat(this.game);
    this.neat.start();
  }
}
