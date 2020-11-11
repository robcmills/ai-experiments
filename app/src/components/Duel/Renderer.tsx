import { config } from 'components/Duel/config';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.parent.append(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.canvas.height = config.canvasHeight;
    this.canvas.width = config.canvasWidth;
  }
}
