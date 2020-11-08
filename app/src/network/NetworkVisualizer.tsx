import { Network } from 'neat/Network';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { INeatParams } from 'neat/NeatParams';

const CIRCLE_END_ANGLE = 2 * Math.PI;
const FONT = 'monospace';
const FONT_LINE_HEIGHT = 8;
const FONT_SIZE = `${FONT_LINE_HEIGHT}px`;
const SYNAPSE_LINE_WIDTH = 1;
const SYNAPSE_LINE_WIDTH_MIN = 0.5;
const SYNAPSE_LINE_WIDTH_MAX = 5;
const SYNAPSE_STROKE_STYLE = 'lightgray';
const SYNAPSE_STROKE_STYLE_POSITIVE = 'mediumseagreen';
const SYNAPSE_STROKE_STYLE_NEGATIVE = 'indianred';
const LAYER_GAP_WIDTH = 50;
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

interface Point2D {
  x: number;
  y: number;
}

export class NetworkVisualizer {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  context: CanvasRenderingContext2D = this.canvas.getContext('2d');
  network: Network;
  hiddenLayersIndices: Map<number, number> = new Map();
  neuronLayoutMap: Map<number, LayoutNeuron> = new Map();
  params: INeatParams;

  constructor(parent: HTMLElement) {
    parent.appendChild(this.canvas);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.context.scale(dpr, dpr);
  }

  calculateLayout() {
    this.calculateLayerLayout(this.network.inputs, 0);

    // Render all output Neurons always on the right
    const layerKeys = Array.from(this.hiddenLayersIndices.keys());
    const lastLayer = layerKeys[layerKeys.length - 1];
    let index = 0;
    this.network.outputs.forEach((neuron) => {
      this.neuronLayoutMap.set(neuron.index, {
        neuron,
        x: OFFSET_X + lastLayer * LAYER_GAP_WIDTH,
        y: OFFSET_Y + index * NEURON_RADIUS * 3,
      });
      index++;
    });
  }

  calculateLayerLayout(neuronLayer: Neuron[], layer: number) {
    let index = this.hiddenLayersIndices.get(layer);
    if (index === undefined) {
      // First
      this.hiddenLayersIndices.set(layer, 0);
      index = 0;
    }
    let nextLayer: Map<number, Neuron> = new Map();
    neuronLayer.forEach((neuron) => {
      if (neuron.isOutput) {
        return;
      }
      this.neuronLayoutMap.set(neuron.index, {
        neuron,
        x: OFFSET_X + layer * LAYER_GAP_WIDTH,
        y: OFFSET_Y + index * NEURON_RADIUS * 3 + layer * NEURON_RADIUS,
      });
      this.hiddenLayersIndices.set(layer, index++);
      neuron.enabledOutputs
        .map((s) => s.to)
        .forEach((neuron) => {
          nextLayer.set(neuron.index, neuron);
        });
    });
    if (nextLayer.size) {
      this.calculateLayerLayout(Array.from(nextLayer.values()), layer + 1);
    }
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
    this.context.strokeStyle = strokeStyle || SYNAPSE_STROKE_STYLE;
    this.context.lineWidth = lineWidth || SYNAPSE_LINE_WIDTH;
    this.context.stroke();
  }

  drawSynapses() {
    this.network.enabledSynapses.forEach((synapse: Synapse) => {
      const from = this.neuronLayoutMap.get(synapse.from.index);
      const to = this.neuronLayoutMap.get(synapse.to.index);
      const lineWidth = Math.max(
        SYNAPSE_LINE_WIDTH_MIN,
        Math.abs(
          (synapse.weight / this.params.mutationPower) * SYNAPSE_LINE_WIDTH_MAX
        )
      );
      let strokeStyle =
        synapse.weight > 0
          ? SYNAPSE_STROKE_STYLE_POSITIVE
          : SYNAPSE_STROKE_STYLE_NEGATIVE;
      if (synapse.weight === 0) {
        strokeStyle = SYNAPSE_STROKE_STYLE;
      }
      this.drawLine({
        from: { x: from.x, y: from.y },
        lineWidth,
        strokeStyle,
        to: { x: to.x, y: to.y },
      });
    });
  }

  drawNeurons() {
    Array.from(this.neuronLayoutMap.values()).forEach(({ neuron, x, y }) => {
      this.drawNeuron({ neuron, x, y });
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
      `i:${neuron.index}`,
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

  visualize(network: Network, params: INeatParams) {
    this.network = network;
    this.params = params;
    this.calculateLayout();
    this.drawSynapses();
    this.drawNeurons();
  }
}
