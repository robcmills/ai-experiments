import { Neuron } from 'neat/Neuron';

export interface ISynapseContructorParams {
  enabled: boolean;
  from: Neuron;
  innovation: number;
  to: Neuron;
  weight: number;
}

export class Synapse {
  enabled: boolean;
  from: Neuron;
  innovation: number;
  to: Neuron;
  weight: number;

  constructor(params: Partial<ISynapseContructorParams>) {
    Object.assign(this, params);
  }

  disable() {
    this.enabled = false;
  }

  copy(): Synapse {
    return new Synapse({
      enabled: this.enabled,
      from: this.from,
      innovation: this.innovation,
      to: this.to,
      weight: this.weight,
    });
  }
}
