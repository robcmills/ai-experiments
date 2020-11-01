import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { Network } from 'neat/Network';

interface INetworkFactoryBuildParams {
  innovation: IterableIterator<number>;
  numInputs?: number;
  numOutputs?: number;
}

export class NetworkFactory {
  // Builds a fully connected network with no hidden layers
  static build(params?: INetworkFactoryBuildParams): Network {
    const { innovation, numInputs = 2, numOutputs = 1 } = params || {};
    const inputs: Neuron[] = [];
    for (let i = 0; i < numInputs; i++) {
      inputs.push(new Neuron({ type: NeuronType.Input }));
    }
    const outputs: Neuron[] = [];
    for (let i = 0; i < numOutputs; i++) {
      outputs.push(new Neuron({ type: NeuronType.Output }));
    }

    const synapses: Synapse[] = [];
    inputs.forEach((input) => {
      outputs.forEach((output) => {
        const synapse = new Synapse({
          index: innovation.next().value,
          from: input,
          to: output,
        });
        synapses.push(synapse);
        input.outputs.push(synapse);
        output.inputs.push(synapse);
      });
    });

    const network = new Network();
    network.addNeurons(inputs.concat(outputs));
    network.addSynapses(synapses);

    return network;
  }
}
