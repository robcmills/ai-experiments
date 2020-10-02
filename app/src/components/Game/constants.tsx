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
].map(([x, y]) => ({
  height: 0,
  x,
  y,
}));

const initialPlayers = [
  {
    name: 'green',
    score: 0,
  },
  {
    name: 'blue',
    score: 0,
  },
];

const initialTokens = [
  {
    fillStyle: 'green',
    player: 'green',
    x: 2,
    y: 6,
  },
  {
    fillStyle: 'green',
    player: 'green',
    x: 0,
    y: 6,
  },
  {
    fillStyle: 'green',
    player: 'green',
    x: 1,
    y: 0,
  },
  {
    fillStyle: 'blue',
    player: 'blue',
    x: 0,
    y: 2,
  },
  {
    fillStyle: 'blue',
    player: 'blue',
    x: 2,
    y: 2,
  },
  {
    fillStyle: 'blue',
    player: 'blue',
    x: 1,
    y: 8,
  },
];

export interface IHexState {
  height: number;
  x: number;
  y: number;
}

export interface IToken {
  fillStyle: string;
  player: string;
  x: number;
  y: number;
}

export interface IPlayer {
  name: string;
  score: number;
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
  hexes: IHexState[];
  players: IPlayer[];
  tokens: IToken[];
  tokenRadius: number;
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
  players: initialPlayers,
  tokens: initialTokens,
  tokenRadius: 4,
};
