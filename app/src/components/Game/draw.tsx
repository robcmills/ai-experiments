import { SIN_60 } from 'components/Game/IGameState';

export function drawCircle({
  context,
  fill,
  lineWidth,
  radius,
  stroke,
  x,
  y,
}: {
  context: CanvasRenderingContext2D;
  fill?: string;
  lineWidth?: number;
  radius: number;
  stroke?: string;
  x: number;
  y: number;
}): void {
  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  context.fillStyle = fill;
  context.beginPath();
  context.arc(x, y, radius, startAngle, endAngle);
  context.closePath();

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (lineWidth && stroke) {
    context.lineWidth = lineWidth;
    context.strokeStyle = stroke;
    context.stroke();
  }
}

export function drawHex({
  context,
  fill,
  lineWidth,
  radius,
  stroke,
  x,
  y,
}: {
  context: CanvasRenderingContext2D;
  fill?: string;
  lineWidth?: number;
  radius: number;
  stroke?: string;
  x: number;
  y: number;
}) {
  /*
    sin θ = opposite/hypotenuse        _________
    cos θ = adjacent/hypotenuse       / |       \
    tan θ = opposite/adjacent    hyp /  | opp    \
                                    /θ__|         \
                                    \ adj         /
                                     \           /
                                      \_________/
   */
  const adjacent = radius / 2;
  const opposite = SIN_60 * radius;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + adjacent, y + opposite);
  context.lineTo(x - adjacent, y + opposite);
  context.lineTo(x - radius, y);
  context.lineTo(x - adjacent, y - opposite);
  context.lineTo(x + adjacent, y - opposite);
  context.lineTo(x + radius, y);
  context.closePath();

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (lineWidth && stroke) {
    context.lineWidth = lineWidth;
    context.strokeStyle = stroke;
    context.stroke();
  }
}

// export function drawLine({
//   context,
//   lineWidth,
//   stroke,
//   x1,
//   y1,
//   x2,
//   y2,
// }: {
//   context: CanvasRenderingContext2D;
//   lineWidth?: number;
//   stroke?: string;
//   x1: number;
//   y1: number;
//   x2: number;
//   y2: number;
// }) {
//   context.beginPath();
//   context.moveTo(x1, y1);
//   context.lineTo(x2, y2);
//   context.closePath();
//
//   if (lineWidth && stroke) {
//     context.lineWidth = lineWidth;
//     context.strokeStyle = stroke;
//     context.stroke();
//   }
// }
