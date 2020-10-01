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

export interface IHexState {
  height: number;
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
  hexFillStyle: 'gray',
  hexLineWidth: 2,
  hexStrokeStyle: 'white',
  hexRadius: 16,
};
