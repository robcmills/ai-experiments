export const toRad = (degrees: number) => degrees * (Math.PI / 180);
export const SIN_60 = Math.sin(toRad(60));

const initialHexes = [
  [-1, -1],
  [-1, -2],
  [-1, -3],
  [-1, 0],
  [-1, 1],
  [-1, 2],
  [-1, 3],
  [0, -1],
  [0, -2],
  [0, -3],
  [0, -4],
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, -2],
  [1, 0],
  [1, 2],
].map(([x, y]) => ({
  height: 0,
  x,
  y,
}));

const initialTokens = [
  {
    fillStyle: 'green',
    player: 'green',
    x: 1,
    y: 2,
  },
  {
    fillStyle: 'green',
    player: 'green',
    x: -1,
    y: 2,
  },
  {
    fillStyle: 'green',
    player: 'green',
    x: 0,
    y: -4,
  },
  {
    fillStyle: 'blue',
    player: 'blue',
    x: -1,
    y: -2,
  },
  {
    fillStyle: 'blue',
    player: 'blue',
    x: 1,
    y: -2,
  },
  {
    fillStyle: 'blue',
    player: 'blue',
    x: 0,
    y: 4,
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

export interface IGameState {
  canvas: {
    height: number;
    width: number;
  };
  center: {
    x: number;
    y: number;
  };
  hexFillStyle: string;
  hexLineWidth: number;
  hexRadius: number;
  hexStrokeStyle: string;
  hexes: IHexState[];
  tokens: IToken[];
  tokenRadius: number;
}

export const initialGameState: IGameState = {
  canvas: {
    height: 256,
    width: 256,
  },
  center: {
    x: 128,
    y: 128,
  },
  hexes: initialHexes,
  hexFillStyle: 'lightgray',
  hexLineWidth: 2,
  hexStrokeStyle: 'white',
  hexRadius: 16,
  tokens: initialTokens,
  tokenRadius: 4,
};
