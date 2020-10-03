import {
  Direction,
  DIRECTIONS,
  getInitialGameState,
  IGameState,
  IHexState,
  IPlayer,
  IToken,
  IValidTokenMove,
  PlayerName,
} from 'components/Game/IGameState';
import { getRandomKey } from 'components/Game/getRandomKey';
import { gameConfig } from 'components/Game/IGameConfig';

export class GameController {
  public state: IGameState;

  constructor() {
    this.state = getInitialGameState();
  }

  private addValidStackMove(x: number, y: number) {
    if (!this.state.validStackMoves[x]) {
      this.state.validStackMoves[x] = {};
    }
    this.state.validStackMoves[x][y] = true;
  }

  private addValidTokenMove(validTokenMove: IValidTokenMove) {
    const { to } = validTokenMove;
    if (!this.state.validTokenMoves[to.xIndex]) {
      this.state.validTokenMoves[to.xIndex] = {};
    }
    this.state.validTokenMoves[to.xIndex][to.yIndex] = validTokenMove;
  }

  public doRandomMove() {
    if (this.state.isEnd) {
      return;
    }
    const r = Math.random();
    if (r < 0.75) {
      if (!this.doRandomStackMove()) {
        this.doRandomTokenMove();
      }
    } else {
      this.doRandomTokenMove();
    }
  }

  private doRandomStackMove(): boolean {
    const stackMove = this.getRandomStackMove();
    if (stackMove) {
      const [xIndex, yIndex] = stackMove;
      this.stackHex(xIndex, yIndex, this.state.activePlayer);
      this.rotateActivePlayer();
      this.update();
    }
    return !!stackMove;
  }

  private doRandomTokenMove() {
    const tokenMove = this.getRandomTokenMove();
    if (tokenMove) {
      this.moveToken(tokenMove);
      this.rotateActivePlayer();
    }
    this.update();
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
    return (this.state.hexes[adjacentX] || {})[adjacentY];
  }

  private getRandomStackMove() {
    const xKey: string = getRandomKey(this.state.validStackMoves);
    if (!xKey) {
      return;
    }
    const xIndex = parseInt(xKey, 10);
    const yKey = getRandomKey(this.state.validStackMoves[xIndex]);
    const yIndex = parseInt(yKey, 10);
    return [xIndex, yIndex];
  }

  private getRandomTokenMove(): IValidTokenMove {
    const xKey: string = getRandomKey(this.state.validTokenMoves);
    if (!xKey) {
      return;
    }
    const xIndex = parseInt(xKey, 10);
    const yKey = getRandomKey(this.state.validTokenMoves[xIndex]);
    const yIndex = parseInt(yKey, 10);
    return this.state.validTokenMoves[xIndex][yIndex];
  }

  private getTokenAt(x: number, y: number) {
    return (this.state.tokens[x] || {})[y];
  }

  public getValidStackMove(xIndex: number, yIndex: number) {
    return (this.state.validStackMoves[xIndex] || {})[yIndex];
  }

  private moveToken(tokenMove: IValidTokenMove) {
    const { from, to } = tokenMove;
    const token = this.state.tokens[from.xIndex][from.yIndex];
    this.state.tokens[to.xIndex][to.yIndex] = {
      ...token,
      x: to.xIndex,
      y: to.yIndex,
    };
    delete this.state.tokens[from.xIndex][from.yIndex];
  }

  public reset() {
    this.state = getInitialGameState();
  }

  private rotateActivePlayer() {
    const currentTurnOrderIndex = this.state.playersTurnOrder.indexOf(
      this.state.activePlayer
    );
    const nextTurnOrderIndex =
      currentTurnOrderIndex >= this.state.playersTurnOrder.length - 1
        ? 0
        : currentTurnOrderIndex + 1;
    this.state.activePlayer = this.state.playersTurnOrder[nextTurnOrderIndex];
  }

  private stackHex(xIndex: number, yIndex: number, player: PlayerName) {
    const hex = this.state.hexes[xIndex][yIndex];
    hex.height++;
    hex.owner = player;
  }

  private update() {
    this.updateScores();
    this.updateValidMoves();
    this.updateGameEnd();
  }

  private updateGameEnd() {
    let numberValidStackMoves = 0;
    Object.keys(this.state.validStackMoves).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.state.validStackMoves[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        if (this.state.validStackMoves[xIndex][yIndex]) {
          numberValidStackMoves++;
        }
      });
    });

    let numberValidTokenMoves = 0;
    Object.keys(this.state.validTokenMoves).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.state.validTokenMoves[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        if (this.state.validTokenMoves[xIndex][yIndex]) {
          numberValidTokenMoves++;
        }
      });
    });

    let isMaxScoreReached = false;
    Object.values(this.state.players).forEach((player: IPlayer) => {
      if (player.score >= gameConfig.maxScore) {
        isMaxScoreReached = true;
      }
    });

    if (
      isMaxScoreReached ||
      (numberValidStackMoves === 0 && numberValidTokenMoves === 0)
    ) {
      this.state.isEnd = true;
    }
  }

  private updateScores() {
    Object.values(this.state.players).forEach((player: IPlayer) => {
      player.score = 0;
    });
    Object.keys(this.state.hexes).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.state.hexes[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const hex: IHexState = this.state.hexes[xIndex][yIndex];
        if (hex.owner) {
          this.state.players[hex.owner].score += hex.height;
        }
      });
    });
  }

  public updateValidMoves() {
    this.state.validStackMoves = {};
    this.state.validTokenMoves = {};

    Object.keys(this.state.tokens).forEach((xKey) => {
      const xIndex = parseInt(xKey, 10);
      Object.keys(this.state.tokens[xIndex]).forEach((yKey) => {
        const yIndex = parseInt(yKey, 10);
        const token: IToken = this.state.tokens[xIndex][yIndex];
        if (this.state.activePlayer !== token.player) {
          return;
        }
        const originHex: IHexState = this.state.hexes[token.x][token.y];
        // Can player stack on currently occupied hex?
        if (originHex.owner !== token.player) {
          this.addValidStackMove(originHex.x, originHex.y);
        }

        // Walk in each cardinal direction from token hex
        // adding valid moves as you go and terminating upon
        // encountering cliffs or edge of board.
        DIRECTIONS.forEach((direction: Direction) => {
          let distance = 0;
          let previousAdjacentHex: IHexState = originHex;
          let nextAdjacentHex: IHexState | undefined;
          do {
            distance++;
            nextAdjacentHex = this.getAdjacentHex({
              direction,
              xIndex: previousAdjacentHex.x,
              yIndex: previousAdjacentHex.y,
            });
            if (!nextAdjacentHex) {
              return;
            }
            const isCliff =
              nextAdjacentHex.height - previousAdjacentHex.height > 1;
            if (isCliff) {
              return;
            }
            if (!this.getTokenAt(nextAdjacentHex.x, nextAdjacentHex.y)) {
              this.addValidTokenMove({
                from: {
                  xIndex: token.x,
                  yIndex: token.y,
                },
                to: {
                  xIndex: nextAdjacentHex.x,
                  yIndex: nextAdjacentHex.y,
                },
              });
              if (distance < 2 && nextAdjacentHex.owner !== token.player) {
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
