import { Neuron } from 'network/Neuron';
import { Link } from 'network/Link';

export class Network {
  inputs: Neuron[] = [];
  links: Link[] = [];
  neuronMap: Map<number, Neuron> = new Map();
  outputs: Neuron[] = [];
}
