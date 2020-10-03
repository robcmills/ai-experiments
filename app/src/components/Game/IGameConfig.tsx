export interface IGameConfig {
  drawHexIndexes: boolean;
  drawValidMoves: boolean;
  maxScore: number;
}
export const gameConfig: IGameConfig = {
  drawHexIndexes: false,
  drawValidMoves: false,
  maxScore: 16,
};
