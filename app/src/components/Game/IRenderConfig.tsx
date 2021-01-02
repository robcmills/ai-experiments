export interface IRenderConfig {
  canvas: { height: number; width: number };
  center: { x: number; y: number };
  dpr: number;
  drawHexIndexes: boolean;
  drawValidMoves: boolean;
  font: string;
  fontSize: string;
  hexFillStyle: string;
  hexLineWidth: number;
  hexRadius: number;
  hexStrokeStyle: string;
  hoveredFalloffDistance: number;
  hoveredStackLineWidth: number;
  hoveredStackStrokeStyle: string;
  hoveredTokenLineWidth: number;
  hoveredTokenStrokeStyle: string;
  tokenRadius: number;
  validStackMoveFillStyle: string;
  validTokenMovesFillStyle: string;
}
export const renderConfig: IRenderConfig = {
  canvas: { height: 256, width: 256 },
  center: { x: 64, y: 64 },
  dpr: window.devicePixelRatio || 1,
  drawHexIndexes: false,
  drawValidMoves: true,
  font: 'monospace',
  fontSize: '9px',
  hexFillStyle: 'lightgray',
  hexLineWidth: 2,
  hexRadius: 16,
  hexStrokeStyle: 'white',
  hoveredFalloffDistance: 32,
  hoveredStackLineWidth: 1,
  hoveredStackStrokeStyle: 'yellow',
  hoveredTokenLineWidth: 1,
  hoveredTokenStrokeStyle: 'yellow',
  tokenRadius: 4,
  validStackMoveFillStyle: 'gold',
  validTokenMovesFillStyle: 'orange',
};
