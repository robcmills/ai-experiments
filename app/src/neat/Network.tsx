import { activateNeuron } from 'network/Neuron';
import { Synapse } from 'neat/Synapse';
import { Neuron, NeuronType } from 'neat/Neuron';

export class Network {
  inputs: Neuron[] = [];
  neuronMap: Map<string, Neuron> = new Map();
  outputs: Neuron[] = [];
  state: [any, any] = [{}, {}]; // todo: understand state
  synapseMap: Map<number, Synapse> = new Map();

  constructor({
    neurons,
    synapses,
  }: {
    neurons: Neuron[];
    synapses: Synapse[];
  }) {
    const inputs: Neuron[] = [];
    const outputs: Neuron[] = [];

    neurons.forEach(({ type, id }) => {
      const neuron = new Neuron(type, id);
      this.neuronMap.set(id, neuron);
      switch (type) {
        case NeuronType.Bias:
        case NeuronType.Input:
          inputs.push(neuron);
          break;
        case NeuronType.Output:
          outputs.push(neuron);
          break;
      }
      this.state[0][neuron.id] = 0;
      this.state[1][neuron.id] = 0;
    });

    synapses
      .filter(({ enabled }) => enabled)
      .forEach((s) => {
        const from = this.neuronMap.get(s.from.id)!;
        const to = this.neuronMap.get(s.to.id)!;
        const synapse = new Synapse({
          from,
          to,
          weight: s.weight,
          enabled: s.enabled,
        });
        from.out.push(synapse);
        to.in.push(synapse);
      });

    this.inputs = inputs;
    this.outputs = outputs;
  }

  activate(inputs: number[]): number[] {
    this.inputs.forEach((neuron: Neuron, index: number) => {
      neuron.activate(inputs[index]);
    });
    const activations: number[] = [];
    this.outputs.forEach((neuron: Neuron) => {
      activations.push(neuron.activate());
    });
    return activations;
  }
}
