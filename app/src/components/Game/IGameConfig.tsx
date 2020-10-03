export interface IGameConfig {
  canvas: { height: number; width: number };
  center: { x: number; y: number };
  drawHexIndexes: boolean;
  drawValidMoves: boolean;
  font: string;
  fontSize: string;
  hexFillStyle: string;
  hexLineWidth: number;
  hexRadius: number;
  hexStrokeStyle: string;
  maxScore: number;
  tokenRadius: number;
  validStackMoveFillStyle: string;
  validTokenMovesFillStyle: string;
}
export const gameConfig: IGameConfig = {
  canvas: { height: 256, width: 256 },
  center: { x: 64, y: 64 },
  drawHexIndexes: false,
  drawValidMoves: false,
  font: 'sans-serif',
  fontSize: '10px',
  hexFillStyle: 'lightgray',
  hexLineWidth: 2,
  hexRadius: 16,
  hexStrokeStyle: 'white',
  maxScore: 16,
  tokenRadius: 4,
  validStackMoveFillStyle: 'gold',
  validTokenMovesFillStyle: 'orange',
};
