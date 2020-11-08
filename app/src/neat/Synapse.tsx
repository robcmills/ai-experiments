import { Neuron } from 'neat/Neuron';

export class Synapse {
  enabled = true;
  from: Neuron;
  innovation: number;
  to: Neuron;
  weight = 1;

  constructor(synapse: Partial<Synapse>) {
    Object.assign(this, synapse);
  }

  copy(): Synapse {
    return new Synapse(this);
  }

  disable() {
    this.enabled = false;
  }
}
