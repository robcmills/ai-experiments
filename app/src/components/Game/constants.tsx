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

const initialHexes = [
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

const initialPlayers = {
  green: {
    hexFillStyle: 'lightgreen',
    name: 'green',
    score: 0,
  },
  blue: {
    hexFillStyle: 'lightblue',
    name: 'blue',
    score: 0,
  },
};

const initialTokens: ITokens = {
  0: {
    2: {
      fillStyle: 'blue',
      player: 'blue',
      x: 0,
      y: 2,
    },
    6: {
      fillStyle: 'green',
      player: 'green',
      x: 0,
      y: 6,
    },
  },
  1: {
    0: {
      fillStyle: 'green',
      player: 'green',
      x: 1,
      y: 0,
    },
    8: {
      fillStyle: 'blue',
      player: 'blue',
      x: 1,
      y: 8,
    },
  },
  2: {
    2: {
      fillStyle: 'blue',
      player: 'blue',
      x: 2,
      y: 2,
    },
    6: {
      fillStyle: 'green',
      player: 'green',
      x: 2,
      y: 6,
    },
  },
};

export interface IHexes {
  [xIndex: number]: {
    [yIndex: number]: IHexState;
  };
}

export interface IHexState {
  height: number;
  owner?: string;
  x: number;
  y: number;
}

export interface IToken {
  fillStyle: string;
  player: string;
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
  name: string;
  score: number;
}

export interface IPlayers {
  [name: string]: IPlayer;
}

export interface IValidMoves {
  [xIndex: number]: {
    [yIndex: number]: boolean;
  };
}

export interface IGameState {
  activePlayer: string;
  canvas: {
    height: number;
    width: number;
  };
  center: {
    x: number;
    y: number;
  };
  font: string;
  fontSize: string;
  hexFillStyle: string;
  hexLineWidth: number;
  hexRadius: number;
  hexStrokeStyle: string;
  hexes: IHexes;
  isEnd: boolean;
  players: IPlayers;
  tokens: ITokens;
  tokenRadius: number;
  validStackMoveFillStyle: string;
  validStackMoves: IValidMoves;
  validTokenMoves: IValidMoves;
  validTokenMovesFillStyle: string;
}

export const initialGameState: IGameState = {
  activePlayer: 'green',
  canvas: {
    height: 256,
    width: 256,
  },
  center: {
    x: 64,
    y: 64,
  },
  font: 'sans-serif',
  fontSize: '10px',
  hexes: initialHexes,
  hexFillStyle: 'lightgray',
  hexLineWidth: 2,
  hexStrokeStyle: 'white',
  hexRadius: 16,
  isEnd: false,
  players: initialPlayers,
  tokens: initialTokens,
  tokenRadius: 4,
  validStackMoveFillStyle: 'gold',
  validStackMoves: {},
  validTokenMoves: {},
  validTokenMovesFillStyle: 'orange',
};
