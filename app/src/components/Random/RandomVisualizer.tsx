import { random } from 'util/random';

interface Point2D {
  x: number;
  y: number;
}

const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_STROKE_STYLE = 'lightgray';

export class RandomVisualizer {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  context: CanvasRenderingContext2D = this.canvas.getContext('2d');

  constructor(parent: HTMLElement) {
    parent.appendChild(this.canvas);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.context.scale(dpr, dpr);
    this.context.translate(0.5, 0.5);
  }

  drawAxis() {
    this.context.translate(50, 150);
    this.drawLine({
      from: { x: 0, y: 0 },
      to: { x: 250, y: 0 },
    });
    this.drawLine({
      from: { x: 0, y: -100 },
      to: { x: 0, y: 0 },
    });
  }

  drawLine({
    from,
    lineWidth,
    strokeStyle,
    to,
  }: {
    from: Point2D;
    lineWidth?: number;
    strokeStyle?: string;
    to: Point2D;
  }) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.closePath();
    this.context.strokeStyle = strokeStyle || DEFAULT_STROKE_STYLE;
    this.context.lineWidth = lineWidth || DEFAULT_LINE_WIDTH;
    this.context.stroke();
  }

  drawRandom() {
    let i = 0;
    while (i++ < 250) {
      this.drawLine({
        from: { x: i, y: 0 },
        to: { x: i, y: random() * -100 },
        strokeStyle: 'lightblue',
      });
    }
  }

  run() {
    this.drawAxis();
    this.drawRandom();
  }
}
