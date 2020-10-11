import { Link } from 'network/Link';
import { relu } from 'network/activations';

export enum NeuronType {
  Bias,
  Input,
  Hidden,
  Output,
}

export class Neuron {
  activation = 0;
  bias: number = 0;
  id: number;
  in: Link[] = [];
  out: Link[] = [];
  squash = relu;
  state = 0;
  type: NeuronType = NeuronType.Hidden;

  constructor({ id, type }: { id: number; type?: NeuronType }) {
    this.id = id;
    if (type) this.type = type;
  }
}

/**
 * When a neuron activates, it computes its state from all its input connections and 'squashes'
 * it using its activation function, and returns the output (activation).
 *
 * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful
 * for neurons in the input layer.
 */
export const activateNeuron = (neuron: Neuron, input?: number) => {
  if (input !== undefined && Number.isFinite(input)) {
    neuron.activation = input;
  } else if (neuron.type === NeuronType.Input) {
    neuron.activation = 0;
  } else {
    neuron.in.forEach((link: Link) => {
      neuron.state += link.from.activation * link.weight;
    });
    neuron.activation = neuron.squash(neuron.state);
  }
  return neuron.activation;
};

export const connectNeurons = (from: Neuron, to: Neuron): Link => {
  const link = new Link({ from, to });
  from.out.push(link);
  to.in.push(link);
  return link;
};
