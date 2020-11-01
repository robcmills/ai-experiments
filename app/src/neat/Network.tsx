import { Synapse } from 'neat/Synapse';
import { Neuron, NeuronType } from 'neat/Neuron';

export class Network {
  inputs: Neuron[] = [];
  neuronIndex: number = 0;
  neuronMap: Map<string, Neuron> = new Map();
  outputs: Neuron[] = [];
  synapseIndex: number = 0;
  synapseMap: Map<number, Synapse> = new Map();

  get neurons(): Neuron[] {
    return Array.from(this.neuronMap.values());
  }

  get synapses(): Synapse[] {
    return Array.from(this.synapseMap.values());
  }

  get enabledSynapses(): Synapse[] {
    return this.synapses.filter((s) => s.enabled);
  }

  activate(inputs: number[]): number[] {
    this.inputs.forEach((neuron: Neuron, index: number) => {
      neuron.activate(inputs[index]);
    });
    this.neurons.forEach((neuron) => {
      if (!neuron.isInput && !neuron.isOutput) {
        neuron.activate();
      }
    });
    return this.outputs.map((neuron: Neuron) => neuron.activate());
  }

  addNeuron(neuron: Neuron) {
    if (!neuron.index) {
      throw new Error('Failed to addNeuron with no index');
    }
    if (this.neuronMap.has('' + neuron.index)) {
      throw new Error(
        'Failed to addNeuron with duplicate index: ' + neuron.index
      );
    }
    if (neuron.index < 0) {
      neuron.index = this.neuronIndex++;
    }
    this.neuronMap.set('' + neuron.index, neuron);
    switch (neuron.type) {
      case NeuronType.Bias:
      case NeuronType.Input:
        this.inputs.push(neuron);
        break;
      case NeuronType.Output:
        this.outputs.push(neuron);
        break;
    }
  }

  addNeurons(neurons: Neuron[]) {
    neurons.forEach((neuron) => {
      this.addNeuron(neuron);
    });
  }

  addSynapse(synapse: Synapse) {
    this.synapseMap.set(synapse.innovation, synapse);
  }

  addSynapses(synapses: Synapse[]) {
    synapses.forEach((synapse) => {
      this.addSynapse(synapse);
    });
  }

  copy(): Network {
    const networkCopy = new Network();
    this.neurons.forEach((neuron) => {
      networkCopy.addNeuron(neuron.copy());
    });
    this.synapses.forEach((synapse) => {
      const synapseCopy = synapse.copy();
      synapseCopy.from = this.neuronMap.get('' + synapseCopy.from.index);
      synapseCopy.to = this.neuronMap.get('' + synapseCopy.to.index);
      networkCopy.addSynapse(synapseCopy);
    });
    networkCopy.neurons.forEach((neuron) => {
      neuron.inputs = neuron.inputs.reduce((acc, synapse) => {
        acc.push(networkCopy.synapseMap.get(synapse.innovation));
        return acc;
      }, []);
      neuron.outputs = neuron.outputs.reduce((acc, synapse) => {
        acc.push(networkCopy.synapseMap.get(synapse.innovation));
        return acc;
      }, []);
    });
    return networkCopy;
  }
}
