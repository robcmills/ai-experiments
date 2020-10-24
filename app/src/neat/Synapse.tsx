import { Neuron } from 'neat/Neuron';

export class Synapse {
  enabled = true;
  from: Neuron;
  innovation = 0;
  to: Neuron;
  weight = 0;

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
