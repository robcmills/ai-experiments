import { IValidMove } from 'components/Game/IGameState';

export function isEqualMove(moveA: IValidMove, moveB: IValidMove) {
  return (
    moveA.type === moveB.type &&
    moveA.to.xIndex === moveB.to.xIndex &&
    moveA.to.yIndex === moveB.to.yIndex
  );
}
