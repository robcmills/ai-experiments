import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { Network } from 'neat/Network';
import { Innovator } from 'util/innovator';

interface INetworkFactoryBuildParams {
  innovator: Innovator;
  numInputs?: number;
  numOutputs?: number;
}

export class NetworkFactory {
  // Builds a fully connected network with no hidden layers
  static build(params?: INetworkFactoryBuildParams): Network {
    const { numInputs = 2, numOutputs = 1 } = params || {};
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
    network.addSynapses(synapses, params.innovator);

    return network;
  }
}
