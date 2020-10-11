import { Network } from 'network/Network';
import { Neuron } from 'network/Neuron';
import { Link } from 'network/Link';

const CIRCLE_END_ANGLE = 2 * Math.PI;
const LINK_LINE_WIDTH = 1;
const LINK_STROKE_STYLE = 'lightgray';
const NETWORK_WIDTH = 100;
const NEURON_LINE_WIDTH = 2;
const NEURON_FILL_STYLE = 'lightblue';
const NEURON_RADIUS = 10;
const NEURON_STROKE_STYLE = 'dimgray';
const OFFSET_X = 50;
const OFFSET_Y = 50;

interface LayoutNeuron {
  x: number;
  y: number;
  neuron: Neuron;
}

interface NeuronMap {
  [id: number]: LayoutNeuron;
}

interface Point2D {
  x: number;
  y: number;
}

export class NetworkVisualizer {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  context: CanvasRenderingContext2D = this.canvas.getContext('2d');
  network: Network;
  neuronMap: NeuronMap = {};

  constructor(parent: HTMLElement) {
    parent.appendChild(this.canvas);
  }

  calculateLayout() {
    this.network.inputs.forEach((neuron: Neuron, index: number) => {
      this.neuronMap[neuron.id] = {
        neuron,
        x: OFFSET_X,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      };
    });
    this.network.outputs.forEach((neuron: Neuron, index: number) => {
      this.neuronMap[neuron.id] = {
        neuron,
        x: OFFSET_X + NETWORK_WIDTH,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      };
    });
  }

  drawLine({ from, to }: { from: Point2D; to: Point2D }) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.closePath();
    this.context.strokeStyle = LINK_STROKE_STYLE;
    this.context.lineWidth = LINK_LINE_WIDTH;
    this.context.stroke();
  }

  drawLinks() {
    this.network.links.forEach((link: Link, index: number) => {
      const from = this.neuronMap[link.from.id];
      const to = this.neuronMap[link.to.id];
      this.drawLine({
        from: { x: from.x, y: from.y },
        to: { x: to.x, y: to.y },
      });
    });
  }

  drawInputNodes() {
    this.network.inputs.forEach((neuron: Neuron, index: number) => {
      this.drawNeuron({
        x: OFFSET_X,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      });
    });
  }

  drawOutputNodes() {
    this.network.outputs.forEach((neuron: Neuron, index: number) => {
      this.drawNeuron({
        x: OFFSET_X + NETWORK_WIDTH,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      });
    });
  }

  drawNeuron({ x, y }: { x: number; y: number }) {
    this.context.beginPath();
    this.context.arc(x, y, NEURON_RADIUS, 0, CIRCLE_END_ANGLE);
    this.context.closePath();
    this.context.fillStyle = NEURON_FILL_STYLE;
    this.context.fill();
    this.context.strokeStyle = NEURON_STROKE_STYLE;
    this.context.lineWidth = NEURON_LINE_WIDTH;
    this.context.stroke();
  }

  visualize(network: Network) {
    console.log('visualize', network);
    this.network = network;
    this.calculateLayout();
    this.drawLinks();
    this.drawInputNodes();
    this.drawOutputNodes();
  }
}
