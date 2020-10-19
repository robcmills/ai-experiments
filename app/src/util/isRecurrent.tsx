// Check whether the synapse creates a loop inside the network
import { Synapse } from 'neat/Synapse';

export function isRecurrent(synapse: Synapse, synapses: Synapse[]): boolean {
  const startNode = synapse.from;
  const stack = [synapse];

  // todo: optimize
  while (stack.length) {
    synapse = stack.shift()!;

    if (synapse.to.id === startNode.id) {
      return true;
    }

    stack.push(...synapses.filter((gene) => gene.from.id === synapse.to.id));
  }

  return false;
}
