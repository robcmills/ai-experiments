// Check whether the synapse creates a loop inside the network
import { Synapse } from 'neat/Synapse';

export function isRecurrent(synapse: Synapse, synapses: Synapse[]): boolean {
  return [
    synapse,
    ...synapses.filter((s) => s.from.index === synapse.to.index),
  ].some((s) => s.to.index === synapse.from.index);
}
