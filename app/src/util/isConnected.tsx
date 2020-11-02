import { Neuron } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';

export function isConnected(neuron1: Neuron, neuron2: Neuron) {
  return neuron1.outputs.some((synapse: Synapse) => synapse.to === neuron2);
}
