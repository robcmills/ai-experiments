export enum Direction {
  N,
  NE,
  SE,
  S,
  SW,
  NW,
}

export const DIRECTIONS: Direction[] = [
  Direction.N,
  Direction.NE,
  Direction.SE,
  Direction.S,
  Direction.SW,
  Direction.NW,
];

export const toRad = (degrees: number) => degrees * (Math.PI / 180);
export const SIN_60 = Math.sin(toRad(60));

function getInitialHexes() {
  return [
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [1, 3],
    [1, 2],
    [1, 1],
    [1, 0],
    [1, 4],
    [1, 5],
    [1, 6],
    [1, 7],
    [1, 8],
    [2, 2],
    [2, 4],
    [2, 6],
  ].reduce((acc, [x, y]) => {
    if (!acc[x]) {
      acc[x] = {};
    }
    if (!acc[x][y]) {
      acc[x][y] = { height: 0, x, y };
    }
    return acc;
  }, {} as IHexes);
}

function getInitialPlayers() {
  return {
    red: {
      hexFillStyle: 'lightcoral',
      name: 'red',
      score: 0,
    } as IPlayer,
    green: {
      hexFillStyle: 'lightgreen',
      name: 'green',
      score: 0,
    } as IPlayer,
    blue: {
      hexFillStyle: 'lightblue',
      name: 'blue',
      score: 0,
    } as IPlayer,
  };
}

const initialPlayersTurnOrder = Object.values(getInitialPlayers()).map(
  (player: IPlayer) => player.name
);

function getInitialTokens(): ITokens {
  return {
    0: {
      6: {
        fillStyle: 'green',
        player: 'green',
        x: 0,
        y: 6,
      },
    },
    1: {
      0: {
        fillStyle: 'red',
        player: 'red',
        x: 1,
        y: 0,
      },
    },
    2: {
      6: {
        fillStyle: 'blue',
        player: 'blue',
        x: 2,
        y: 6,
      },
    },
  };
}

export type PlayerName = 'red' | 'green' | 'blue';

export interface IHexes {
  [xIndex: number]: {
    [yIndex: number]: IHexState;
  };
}

export interface IHexState {
  height: number;
  owner?: PlayerName;
  x: number;
  y: number;
}

export interface IToken {
  fillStyle: string;
  player: PlayerName;
  x: number;
  y: number;
}

export interface ITokens {
  [xIndex: number]: {
    [yIndex: number]: IToken;
  };
}

export interface IPlayer {
  hexFillStyle: string;
  name: PlayerName;
  score: number;
}

export interface IPlayers {
  [name: string]: IPlayer;
}

export interface IValidStackMoves {
  [xIndex: number]: {
    [yIndex: number]: boolean;
  };
}

export interface IValidTokenMove {
  from: {
    xIndex: number;
    yIndex: number;
  };
  to: {
    xIndex: number;
    yIndex: number;
  };
}

export interface IValidTokenMoves {
  [xIndex: number]: {
    [yIndex: number]: IValidTokenMove;
  };
}

export interface IGameState {
  activePlayer: PlayerName;
  hexes: IHexes;
  isEnd: boolean;
  players: IPlayers;
  playersTurnOrder: PlayerName[];
  tokens: ITokens;
  validStackMoves: IValidStackMoves;
  validTokenMoves: IValidTokenMoves;
}

export function getInitialGameState(): IGameState {
  return {
    activePlayer: 'green',
    hexes: getInitialHexes(),
    isEnd: false,
    players: getInitialPlayers(),
    playersTurnOrder: initialPlayersTurnOrder,
    tokens: getInitialTokens(),
    validStackMoves: {},
    validTokenMoves: {},
  };
}
