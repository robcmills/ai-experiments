import { Neuron } from 'network/Neuron';

export class Link {
  enabled: boolean = true;
  from: Neuron;
  to: Neuron;
  weight: number = 0;

  constructor(link: Partial<Link>) {
    Object.assign(this, link);
  }
}
