import {
  IGameState,
  IHexState,
  initialGameState,
  IPlayer,
  IToken,
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

  private draw() {
    this.drawBoard();
    this.drawTokens();
    this.updateValidMoves();
    this.drawValidMoves();
    this.drawText();
  }

  private drawBoard() {
    this.gameState.hexes.forEach((hex: IHexState) => {
      const isEvenRow = hex.y % 2 === 0;
      const x = this.getXCoordFromIndex(isEvenRow, hex.x);
      const y = this.getYCoordFromIndex(hex.y);
      this.drawHex({
        fillStyle: this.gameState.hexFillStyle,
        lineWidth: this.gameState.hexLineWidth,
        strokeStyle: this.gameState.hexStrokeStyle,
        radius: this.gameState.hexRadius,
        x,
        y,
      });
      this.drawHexIndex({
        xCoord: x,
        yCoord: y,
        xIndex: hex.x,
        yIndex: hex.y,
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

    const context = this.context;
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

  private drawHexIndex({
    xCoord,
    yCoord,
    xIndex,
    yIndex,
  }: {
    xCoord: number;
    yCoord: number;
    xIndex: number;
    yIndex: number;
  }) {
    const context = this.context;
    context.fillStyle = 'dimgray';
    context.font = '6px sans-serif';
    context.fillText(
      `${xIndex},${yIndex}`,
      xCoord - this.gameState.hexRadius / 3,
      yCoord + this.gameState.hexRadius - 5
    );
  }

  private drawText() {
    const activePlayer = this.gameState.activePlayer;
    const marginLeft = 10;
    const lineHeight = 16;
    const scores = this.gameState.players.reduce((acc, player: IPlayer) => {
      acc += `${player.name}:${player.score} `;
      return acc;
    }, '');
    const context = this.context;
    context.fillStyle = 'black';
    context.font = `${this.gameState.fontSize} ${this.gameState.font}`;
    context.fillText(`Scores: ${scores}`, marginLeft, lineHeight);
    context.fillText(`${activePlayer} to play`, marginLeft, lineHeight * 2);
  }

  private drawTokens() {
    const context = this.context;
    const radius = this.gameState.tokenRadius;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;
    this.gameState.tokens.forEach((token: IToken) => {
      const isEvenRow = token.y % 2 === 0;
      const x = this.getXCoordFromIndex(isEvenRow, token.x);
      const y = this.getYCoordFromIndex(token.y);
      context.fillStyle = token.fillStyle;
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle);
      context.closePath();
      context.fill();
    });
  }

  private drawValidMoves() {
    // todo
  }

  private getXCoordFromIndex(isEvenRow: boolean, x: number): number {
    return (
      this.gameState.hexRadius * 3 * x +
      (isEvenRow ? 0 : this.gameState.hexRadius * 1.5) +
      this.gameState.center.x
    );
  }

  private getYCoordFromIndex(y: number): number {
    return SIN_60 * this.gameState.hexRadius * y + this.gameState.center.y;
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

  private updateValidMoves() {}
}
