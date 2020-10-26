import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { Network } from 'neat/Network';

interface INetworkFactoryBuildParams {
  numInputs?: number;
  numOutputs?: number;
}

export class NetworkFactory {
  static build(params?: INetworkFactoryBuildParams): Network {
    const { numInputs = 2, numOutputs = 1 } = params || {};
    let neuronId = 0;
    const inputs: Neuron[] = [];
    for (let i = 0; i < numInputs; i++) {
      inputs.push(new Neuron({ id: `${neuronId++}`, type: NeuronType.Input }));
    }
    const outputs: Neuron[] = [];
    for (let i = 0; i < numOutputs; i++) {
      outputs.push(
        new Neuron({ id: `${neuronId++}`, type: NeuronType.Output })
      );
    }

    const synapses: Synapse[] = [];
    let synapseInnovation = 0;
    inputs.forEach((input) => {
      outputs.forEach((output) => {
        const synapse = new Synapse({
          innovation: synapseInnovation++,
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
