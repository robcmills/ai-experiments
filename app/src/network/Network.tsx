import { activateNeuron, Neuron } from 'network/Neuron';
import { Link } from 'network/Link';

export class Network {
  inputs: Neuron[] = [];
  links: Link[] = [];
  neuronMap: Map<number, Neuron> = new Map();
  outputs: Neuron[] = [];

  activate(inputs: number[]): number[] {
    this.inputs.forEach((neuron: Neuron, index: number) => {
      activateNeuron(neuron, inputs[index]);
    });
    const activations: number[] = [];
    this.outputs.forEach((neuron: Neuron) => {
      activateNeuron(neuron);
      activations.push(neuron.activation);
    });
    return activations;
  }
}
