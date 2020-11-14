import { config } from 'components/Duel/config';
import { Game } from 'components/Duel/Game';
import { Player } from 'components/Duel/Player';
import { Health } from 'components/Duel/Health';
import { Vector2 } from 'util/Vector2';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.initCanvas();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCircle({
    x,
    y,
    r,
    fillStyle,
  }: {
    x: number;
    y: number;
    r: number;
    fillStyle: string;
  }) {
    const context = this.context;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    context.fillStyle = fillStyle;
    context.beginPath();
    context.arc(x, y, r, startAngle, endAngle);
    context.closePath();
    context.fill();
  }

  drawHealth(health: Health) {
    console.log('drawHealth', health);
    const { canvasHeight, canvasWidth } = config;
    const c = this.context;
    const center = new Vector2(
      health.position.x * canvasWidth - canvasWidth / 2,
      health.position.y * canvasHeight - canvasHeight / 2
    );
    const size = canvasHeight > canvasWidth ? canvasWidth : canvasHeight;
    const radius = 0.02 * size;
    c.fillStyle = 'orange';
    c.fillRect(
      center.x - radius,
      center.y - radius / 4,
      radius * 2,
      radius / 2
    );
    c.fillRect(
      center.x - radius / 4,
      center.y - radius,
      radius / 2,
      radius * 2
    );
  }

  drawPlayer(player: Player) {
    this.drawCircle({
      x: player.position.x,
      y: player.position.y,
      r: player.radius,
      fillStyle: `hsl(${player.hue},${player.health}%,50%)`,
    });
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.parent.append(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.canvas.height = config.canvasHeight;
    this.canvas.width = config.canvasWidth;
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
  }

  renderHealths(game: Game) {
    game.healths.forEach((health: Health) => {
      this.drawHealth(health);
    });
  }

  renderPlayers(game: Game) {
    // this.clear();
    game.players.forEach((player) => {
      this.drawPlayer(player);
    });
  }
}
