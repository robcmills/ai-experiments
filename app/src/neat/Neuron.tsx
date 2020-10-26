import { uuid } from 'util/uuid';
import { Synapse } from 'neat/Synapse';
import { relu } from 'network/activations';

export enum NeuronType {
  Bias,
  Input,
  Hidden,
  Output,
}

export class Neuron {
  activation = 0;
  id: string = uuid();
  inputs: Synapse[] = [];
  outputs: Synapse[] = [];
  squash = relu;
  state = 0;
  type: NeuronType = NeuronType.Hidden;

  constructor(neuron?: Partial<Neuron>) {
    Object.assign(this, neuron);
  }

  get isInput() {
    return this.type === NeuronType.Input || this.type === NeuronType.Bias;
  }

  get isOutput() {
    return this.type === NeuronType.Output;
  }

  copy(): Neuron {
    return new Neuron(this);
  }

  /**
   * When a neuron activates, it computes its state from all its input connections and 'squashes'
   * it using its activation function, and returns the output (activation).
   *
   * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful
   * for neurons in the input layer.
   */
  activate(input?: number) {
    if (input !== undefined && Number.isFinite(input)) {
      this.activation = input;
    } else if (this.type === NeuronType.Input) {
      this.activation = 0;
    } else {
      this.inputs.forEach((synapse: Synapse) => {
        this.state += synapse.from.activation * synapse.weight;
      });
      this.activation = this.squash(this.state);
    }
    return this.activation;
  }
}
