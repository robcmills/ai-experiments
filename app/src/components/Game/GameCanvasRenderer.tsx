import {
  IHexState,
  IPlayer,
  IToken,
  IValidMove,
  SIN_60,
} from 'components/Game/IGameState';
import { GameController } from 'components/Game/GameController';
import { IRenderConfig, renderConfig } from 'components/Game/IRenderConfig';
import { getDistance } from 'components/Game/getDistance';
import { isEqualMove } from 'components/Game/isEqualMove';
import { drawCircle, drawHex } from 'components/Game/draw';

export class GameCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private config: IRenderConfig;
  private context: CanvasRenderingContext2D;
  private game: GameController;
  private hoveredMove: IValidMove | null = null;

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
    this.drawHoveredMove();
    this.drawText();
  }

  private drawBoard() {
    Object.keys(this.game.state.hexes).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.game.state.hexes[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const hex: IHexState = this.game.state.hexes[xIndex][yIndex];
        const xCoord = this.getXCoordFromIndex(hex.x, hex.y);
        const yCoord = this.getYCoordFromIndex(hex.y);

        const isHoveredStackMove =
          this.hoveredMove &&
          this.hoveredMove.type === 'stack' &&
          this.hoveredMove.to.xIndex === xIndex &&
          this.hoveredMove.to.yIndex === yIndex;
        const isValidStackMove = !!this.game.getValidStackMove(xIndex, yIndex);
        let fill = this.config.hexFillStyle;
        if (isHoveredStackMove) {
          fill = this.game.state.players[this.game.state.activePlayer]
            .hexFillStyle;
        } else if (isValidStackMove && this.config.drawValidMoves) {
          fill = this.config.validStackMoveFillStyle;
        } else if (hex.owner) {
          fill = this.game.state.players[hex.owner].hexFillStyle;
        }

        drawHex({
          context: this.context,
          fill,
          lineWidth: this.config.hexLineWidth,
          stroke: this.config.hexStrokeStyle,
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

  private drawHoveredMove() {
    if (!this.hoveredMove) {
      return;
    }
    const xCoord = this.getXCoordFromIndex(
      this.hoveredMove.to.xIndex,
      this.hoveredMove.to.yIndex
    );
    const yCoord = this.getYCoordFromIndex(this.hoveredMove.to.yIndex);
    if (this.hoveredMove.type === 'token') {
      drawCircle({
        context: this.context,
        fill: this.game.state.players[this.game.state.activePlayer]
          .tokenFillStyle,
        radius: this.config.tokenRadius,
        x: xCoord,
        y: yCoord,
      });
    }
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
        const x = this.getXCoordFromIndex(token.x, token.y);
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
        const x = this.getXCoordFromIndex(xIndex, yIndex);
        const y = this.getYCoordFromIndex(yIndex);
        context.fillStyle = this.config.validTokenMovesFillStyle;
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle);
        context.closePath();
        context.fill();
      });
    });
  }

  private getXCoordFromIndex(x: number, y: number): number {
    const isEvenRow = y % 2 === 0;
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
    const mouseX = event.clientX / this.config.dpr;
    const mouseY = event.clientY / this.config.dpr;
    const validMoves: IValidMove[] = this.game.getValidMoves();
    let nearestDistance: number = Infinity;
    let nearestMove: IValidMove | null = null;
    validMoves.forEach((move: IValidMove) => {
      const xCoord = this.getXCoordFromIndex(move.to.xIndex, move.to.yIndex);
      const yCoord = this.getYCoordFromIndex(move.to.yIndex);
      const distance: number = getDistance(mouseX, mouseY, xCoord, yCoord);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestMove = move;
      } else if (
        distance === nearestDistance &&
        distance < this.config.tokenRadius + 2
      ) {
        nearestDistance = distance;
        nearestMove = move;
      }
    });
    if (nearestDistance > this.config.hoveredFalloffDistance) {
      this.hoveredMove = null;
      this.draw();
      return;
    }
    if (
      !this.hoveredMove ||
      (nearestMove && !isEqualMove(nearestMove, this.hoveredMove))
    ) {
      this.hoveredMove = nearestMove;
      this.draw();
    }
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
    const dpr = this.config.dpr;
    canvas.height = this.config.canvas.height * dpr;
    canvas.width = this.config.canvas.width * dpr;
    this.context.scale(dpr, dpr);
  }
}
