import {
  Direction,
  DIRECTIONS,
  IGameState,
  IHexState,
  initialGameState,
  IPlayer,
  IToken,
  SIN_60,
} from 'components/Game/constants';
import { getRandomKey } from 'components/Game/getRandomKey';

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

  private addValidStackMove(x: number, y: number) {
    if (!this.gameState.validStackMoves[x]) {
      this.gameState.validStackMoves[x] = {};
    }
    this.gameState.validStackMoves[x][y] = true;
  }

  private addValidTokenMove(x: number, y: number) {
    if (!this.gameState.validTokenMoves[x]) {
      this.gameState.validTokenMoves[x] = {};
    }
    this.gameState.validTokenMoves[x][y] = true;
  }

  private bindEventListeners() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private doRandomMove() {
    const r = Math.random();
    if (r < 1) {
      const stackMove = this.getRandomStackMove();
      if (stackMove) {
        const [xIndex, yIndex] = stackMove;
        this.gameState.hexes[xIndex][
          yIndex
        ].owner = this.gameState.activePlayer;
        this.gameState.activePlayer =
          this.gameState.activePlayer === 'green' ? 'blue' : 'green';
        this.update();
      }
    }
  }

  private draw() {
    this.clearCanvas();
    this.drawBoard();
    this.drawTokens();
    this.drawValidMoves();
    this.drawText();
  }

  private drawBoard() {
    Object.keys(this.gameState.hexes).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.gameState.hexes[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const hex: IHexState = this.gameState.hexes[xIndex][yIndex];
        const isValidStackMove = this.getValidStackMove(xIndex, yIndex);
        let fillStyle = isValidStackMove
          ? this.gameState.validStackMoveFillStyle
          : this.gameState.hexFillStyle;
        if (hex.owner) {
          fillStyle = this.gameState.players[hex.owner].hexFillStyle;
        }
        const isEvenRow = hex.y % 2 === 0;
        const xCoord = this.getXCoordFromIndex(isEvenRow, hex.x);
        const yCoord = this.getYCoordFromIndex(hex.y);
        this.drawHex({
          fillStyle,
          lineWidth: this.gameState.hexLineWidth,
          strokeStyle: this.gameState.hexStrokeStyle,
          radius: this.gameState.hexRadius,
          x: xCoord,
          y: yCoord,
        });
        this.drawHexIndex({
          xCoord,
          yCoord,
          xIndex: hex.x,
          yIndex: hex.y,
        });
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
    const scores = Object.values(this.gameState.players).reduce(
      (acc, player: IPlayer) => {
        acc += `${player.name}:${player.score} `;
        return acc;
      },
      ''
    );
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

    Object.keys(this.gameState.tokens).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.gameState.tokens[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const token: IToken = this.gameState.tokens[xIndex][yIndex];
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
    const context = this.context;
    const radius = this.gameState.tokenRadius;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    Object.keys(this.gameState.validTokenMoves).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.gameState.validTokenMoves[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const isEvenRow = yIndex % 2 === 0;
        const x = this.getXCoordFromIndex(isEvenRow, xIndex);
        const y = this.getYCoordFromIndex(yIndex);
        context.fillStyle = this.gameState.validTokenMovesFillStyle;
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle);
        context.closePath();
        context.fill();
      });
    });
  }

  private getAdjacentHex({
    direction,
    xIndex,
    yIndex,
  }: {
    direction: Direction;
    xIndex: number;
    yIndex: number;
  }): IHexState | undefined {
    const isEvenRow = yIndex % 2 === 0;
    let adjacentX: number = xIndex;
    switch (direction) {
      case Direction.NE:
      case Direction.SE:
        adjacentX += isEvenRow ? 0 : 1;
        break;
      case Direction.NW:
      case Direction.SW:
        adjacentX -= isEvenRow ? 1 : 0;
        break;
    }
    let adjacentY: number = yIndex;
    switch (direction) {
      case Direction.N:
        adjacentY -= 2;
        break;
      case Direction.S:
        adjacentY += 2;
        break;
      case Direction.NE:
      case Direction.NW:
        adjacentY -= 1;
        break;
      case Direction.SE:
      case Direction.SW:
        adjacentY += 1;
        break;
    }
    return (this.gameState.hexes[adjacentX] || {})[adjacentY];
  }

  private getRandomStackMove() {
    const xKey: string = getRandomKey(this.gameState.validStackMoves);
    if (!xKey) {
      return;
    }
    const xIndex = parseInt(xKey, 10);
    const yKey = getRandomKey(this.gameState.validStackMoves[xIndex]);
    const yIndex = parseInt(yKey, 10);
    return [xIndex, yIndex];
  }

  private getTokenAt(x: number, y: number) {
    return (this.gameState.tokens[x] || {})[y];
  }

  private getValidStackMove(xIndex: number, yIndex: number) {
    return (this.gameState.validStackMoves[xIndex] || {})[yIndex];
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

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.doRandomMove();
    }
  }

  private init() {
    this.setupCanvas();
    this.updateValidMoves();
    this.draw();
    this.bindEventListeners();
  }

  private setupCanvas() {
    const canvas = this.canvas;
    const dpr = window.devicePixelRatio || 1;
    canvas.height = this.gameState.canvas.height * dpr;
    canvas.width = this.gameState.canvas.width * dpr;
    this.context.scale(dpr, dpr);
  }

  private update() {
    this.updateValidMoves();
    this.draw();
  }

  private updateValidMoves() {
    this.gameState.validStackMoves = {};
    this.gameState.validTokenMoves = {};

    Object.keys(this.gameState.tokens).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.gameState.tokens[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const token: IToken = this.gameState.tokens[xIndex][yIndex];
        if (this.gameState.activePlayer !== token.player) {
          return;
        }
        const originHex: IHexState = this.gameState.hexes[token.x][token.y];
        // Can player stack on currently occupied hex?
        if (originHex.owner !== token.player) {
          this.addValidStackMove(originHex.x, originHex.y);
        }

        DIRECTIONS.forEach((direction: Direction) => {
          let counter = 0;
          let previousAdjacentHex: IHexState = originHex;
          let nextAdjacentHex: IHexState | undefined;
          do {
            counter++;
            nextAdjacentHex = this.getAdjacentHex({
              direction,
              xIndex: previousAdjacentHex.x,
              yIndex: previousAdjacentHex.y,
            });
            if (
              nextAdjacentHex &&
              nextAdjacentHex.height - previousAdjacentHex.height < 2 && // cliffs
              !this.getTokenAt(nextAdjacentHex.x, nextAdjacentHex.y)
            ) {
              this.addValidTokenMove(nextAdjacentHex.x, nextAdjacentHex.y);
              if (counter < 2 && nextAdjacentHex.owner !== token.player) {
                this.addValidStackMove(nextAdjacentHex.x, nextAdjacentHex.y);
              }
            }
            previousAdjacentHex = nextAdjacentHex;
          } while (nextAdjacentHex);
        });
      });
    });
  }
}
