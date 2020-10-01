import {
  IGameState,
  IHexState,
  initialGameState,
  SIN_60,
} from 'components/Game/constants';

export class GameClass {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private gameState: IGameState;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.gameState = initialGameState;
    this.init();
  }

  private init() {
    this.setupCanvas();
    this.draw();
  }

  private setupCanvas() {
    const canvas = this.canvas;
    const dpr = window.devicePixelRatio || 1;
    canvas.height = this.gameState.canvas.height * dpr;
    canvas.width = this.gameState.canvas.width * dpr;
    this.context.scale(dpr, dpr);
  }

  private draw() {
    this.gameState.hexes.forEach((hex: IHexState) => {
      const isEvenRow = hex.y % 2 === 0;
      const x =
        this.gameState.hexRadius * 3 * hex.x +
        (isEvenRow ? 0 : this.gameState.hexRadius * 1.5) +
        this.gameState.center.x;
      const y =
        SIN_60 * this.gameState.hexRadius * hex.y + this.gameState.center.y;
      this.drawHex({
        fillStyle: this.gameState.hexFillStyle,
        lineWidth: this.gameState.hexLineWidth,
        strokeStyle: this.gameState.hexStrokeStyle,
        radius: this.gameState.hexRadius,
        x,
        y,
      });
    });
  }

  private drawHex({
    fillStyle,
    lineWidth,
    radius,
    strokeStyle,
    x,
    y,
  }: {
    fillStyle?: string;
    lineWidth?: number;
    radius: number;
    strokeStyle?: string;
    x: number;
    y: number;
  }) {
    /*
      sin θ = opposite/hypotenuse        _________
      cos θ = adjacent/hypotenuse       / |       \
      tan θ = opposite/adjacent    hyp /  | opp    \
                                      /θ__|         \
                                      \ adj         /
                                       \           /
                                        \_________/
     */
    const adjacent = radius / 2;
    const opposite = SIN_60 * radius;

    const context = this.canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + adjacent, y + opposite);
    context.lineTo(x - adjacent, y + opposite);
    context.lineTo(x - radius, y);
    context.lineTo(x - adjacent, y - opposite);
    context.lineTo(x + adjacent, y - opposite);
    context.lineTo(x + radius, y);
    context.closePath();

    context.fillStyle = fillStyle;
    context.fill();
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.stroke();
  }
}
