import { IHexState, IPlayer, IToken, SIN_60 } from 'components/Game/IGameState';
import { GameController } from 'components/Game/GameController';
import { IRenderConfig, renderConfig } from 'components/Game/IRenderConfig';

export class GameCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private config: IRenderConfig;
  private context: CanvasRenderingContext2D;
  private game: GameController;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas;
    this.config = renderConfig;
    this.context = canvas.getContext('2d');
    this.game = new GameController();
    this.init();
  }

  private bindEventListeners() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    this.clearCanvas();
    this.drawBoard();
    this.drawTokens();
    this.drawValidMoves();
    this.drawText();
  }

  private drawBoard() {
    Object.keys(this.game.state.hexes).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.game.state.hexes[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const hex: IHexState = this.game.state.hexes[xIndex][yIndex];
        const isValidStackMove = !!this.game.getValidStackMove(xIndex, yIndex);
        let fillStyle =
          isValidStackMove && this.config.drawValidMoves
            ? this.config.validStackMoveFillStyle
            : this.config.hexFillStyle;
        if (hex.owner) {
          fillStyle = this.game.state.players[hex.owner].hexFillStyle;
        }
        const isEvenRow = hex.y % 2 === 0;
        const xCoord = this.getXCoordFromIndex(isEvenRow, hex.x);
        const yCoord = this.getYCoordFromIndex(hex.y);
        this.drawHex({
          fillStyle,
          lineWidth: this.config.hexLineWidth,
          strokeStyle: this.config.hexStrokeStyle,
          radius: this.config.hexRadius,
          x: xCoord,
          y: yCoord,
        });
        this.drawHexHeight({
          height: hex.height,
          xCoord,
          yCoord,
        });
        if (this.config.drawHexIndexes) {
          this.drawHexIndex({
            xCoord,
            yCoord,
            xIndex: hex.x,
            yIndex: hex.y,
          });
        }
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

  private drawHexHeight({
    height,
    xCoord,
    yCoord,
  }: {
    height: number;
    xCoord: number;
    yCoord: number;
  }) {
    const context = this.context;
    context.fillStyle = 'dimgray';
    context.font = '6px sans-serif';
    context.fillText(
      `${height}`,
      xCoord - this.config.hexRadius / 3,
      yCoord - this.config.hexRadius + 9
    );
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
      xCoord - this.config.hexRadius / 3,
      yCoord + this.config.hexRadius - 5
    );
  }

  private drawText() {
    const activePlayer = this.game.state.activePlayer;
    const marginLeft = 10;
    const lineHeight = 16;
    const scores = Object.values(this.game.state.players).reduce(
      (acc, player: IPlayer) => {
        acc += `${player.name}:${player.score} `;
        return acc;
      },
      ''
    );
    const context = this.context;
    context.fillStyle = 'black';
    context.font = `${this.config.fontSize} ${this.config.font}`;

    // Scores
    context.fillText(`Scores: ${scores}`, marginLeft, lineHeight);

    // Active Player / Winner
    let activePlayerText = '';
    if (this.game.state.isEnd) {
      const sortedPlayers: IPlayer[] = Object.values(
        this.game.state.players
      ).sort((a: IPlayer, b: IPlayer) => (a.score < b.score ? 1 : -1));
      const first: IPlayer = sortedPlayers[0];
      const second: IPlayer = sortedPlayers[1];
      if (first.score === second.score) {
        activePlayerText = 'draw';
      } else {
        activePlayerText = `${first.name} wins`;
      }
    } else {
      activePlayerText = `${activePlayer} to play`;
    }
    context.fillText(activePlayerText, marginLeft, lineHeight * 2);
  }

  private drawTokens() {
    const context = this.context;
    const radius = this.config.tokenRadius;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    Object.keys(this.game.state.tokens).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.game.state.tokens[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const token: IToken = this.game.state.tokens[xIndex][yIndex];
        const isEvenRow = token.y % 2 === 0;
        const x = this.getXCoordFromIndex(isEvenRow, token.x);
        const y = this.getYCoordFromIndex(token.y);
        context.fillStyle = token.fillStyle;
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle);
        context.closePath();
        context.fill();
      });
    });
  }

  private drawValidMoves() {
    if (!this.config.drawValidMoves) {
      return;
    }
    const context = this.context;
    const radius = this.config.tokenRadius;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    Object.keys(this.game.state.validTokenMoves).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.game.state.validTokenMoves[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const isEvenRow = yIndex % 2 === 0;
        const x = this.getXCoordFromIndex(isEvenRow, xIndex);
        const y = this.getYCoordFromIndex(yIndex);
        context.fillStyle = this.config.validTokenMovesFillStyle;
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle);
        context.closePath();
        context.fill();
      });
    });
  }

  private getXCoordFromIndex(isEvenRow: boolean, x: number): number {
    return (
      this.config.hexRadius * 3 * x +
      (isEvenRow ? 0 : this.config.hexRadius * 1.5) +
      this.config.center.x
    );
  }

  private getYCoordFromIndex(y: number): number {
    return SIN_60 * this.config.hexRadius * y + this.config.center.y;
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.game.doRandomMove();
      this.draw();
    } else if (event.key === 'Enter') {
      const t0 = performance.now();
      while (!this.game.state.isEnd) {
        this.game.doRandomMove();
      }
      const t1 = performance.now();
      console.log(`Game took ${t1 - t0} milliseconds.`);
      this.draw();
    } else if (event.key === 'r') {
      this.reset();
    } else if (event.key === 'v') {
      console.log(this.game.getValidMoves());
    }
  }

  private handleMousemove(event: MouseEvent) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    // console.log({ mouseX, mouseY });
  }

  private init() {
    this.setupCanvas();
    this.game.updateValidMoves();
    this.draw();
    this.bindEventListeners();
  }

  private reset() {
    this.game.reset();
    this.draw();
  }

  private setupCanvas() {
    const canvas = this.canvas;
    const dpr = window.devicePixelRatio || 1;
    canvas.height = this.config.canvas.height * dpr;
    canvas.width = this.config.canvas.width * dpr;
    this.context.scale(dpr, dpr);
  }
}
