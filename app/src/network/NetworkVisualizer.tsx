import { Network } from 'neat/Network';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';

const CIRCLE_END_ANGLE = 2 * Math.PI;
const FONT = 'monospace';
const FONT_LINE_HEIGHT = 8;
const FONT_SIZE = `${FONT_LINE_HEIGHT}px`;
const SYNAPSE_LINE_WIDTH = 1;
const SYNAPSE_STROKE_STYLE = 'lightgray';
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
  [id: string]: LayoutNeuron;
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
    const dpr = window.devicePixelRatio || 1;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.context.scale(dpr, dpr);
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
    this.context.strokeStyle = SYNAPSE_STROKE_STYLE;
    this.context.lineWidth = SYNAPSE_LINE_WIDTH;
    this.context.stroke();
  }

  drawSynapses() {
    this.network.synapses.forEach((synapse: Synapse, index: number) => {
      const from = this.neuronMap[synapse.from.id];
      const to = this.neuronMap[synapse.to.id];
      this.drawLine({
        from: { x: from.x, y: from.y },
        to: { x: to.x, y: to.y },
      });
    });
  }

  drawInputNodes() {
    this.network.inputs.forEach((neuron: Neuron, index: number) => {
      this.drawNeuron({
        neuron,
        x: OFFSET_X,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      });
    });
  }

  drawOutputNodes() {
    this.network.outputs.forEach((neuron: Neuron, index: number) => {
      this.drawNeuron({
        neuron,
        x: OFFSET_X + NETWORK_WIDTH,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      });
    });
  }

  drawNeuron({ neuron, x, y }: { neuron: Neuron; x: number; y: number }) {
    // Draw circle
    this.context.beginPath();
    this.context.arc(x, y, NEURON_RADIUS, 0, CIRCLE_END_ANGLE);
    this.context.closePath();
    this.context.fillStyle = NEURON_FILL_STYLE;
    this.context.fill();
    this.context.strokeStyle = NEURON_STROKE_STYLE;
    this.context.lineWidth = NEURON_LINE_WIDTH;
    this.context.stroke();
    // Draw info
    let xOffset = NEURON_RADIUS * 1.5;
    if (neuron.type === NeuronType.Input) {
      xOffset *= -2;
    }
    this.context.fillStyle = 'black';
    this.context.font = `${FONT_SIZE} ${FONT}`;
    this.context.fillText(
      `i:${neuron.id}`,
      x + xOffset,
      y - NEURON_RADIUS - 2 + FONT_LINE_HEIGHT
    );
    this.context.fillText(
      `s:${neuron.state}`,
      x + xOffset,
      y - NEURON_RADIUS - 2 + FONT_LINE_HEIGHT * 2
    );
    this.context.fillText(
      `a:${neuron.activation}`,
      x + xOffset,
      y - NEURON_RADIUS - 2 + FONT_LINE_HEIGHT * 3
    );
  }

  visualize(network: Network) {
    console.log('visualize', network);
    this.network = network;
    this.calculateLayout();
    this.drawSynapses();
    this.drawInputNodes();
    this.drawOutputNodes();
  }
}
