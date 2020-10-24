import React from 'react';
import { Network } from 'neat/Network';
import { Neuron } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';

/*
 1   2
  \ /
   3
 */
const neuron1 = new Neuron({ id: '1' });
const neuron2 = new Neuron({ id: '2' });
const neuron3 = new Neuron({ id: '3' });
const synapse1 = new Synapse({ from: neuron1, to: neuron3 });
const synapse2 = new Synapse({ from: neuron2, to: neuron3 });
neuron1.outputs = [synapse1];
neuron2.outputs = [synapse2];
neuron3.inputs = [synapse1, synapse2];
const network = new Network();
network.addNeurons([neuron1, neuron2, neuron3]);
network.addSynapses([synapse1, synapse2]);

test('Network::copy', () => {
  const networkCopy = network.copy();
  networkCopy.synapses.forEach((synapseCopy) => {
    // Ensure copied synapses are not referentially equal to original network.
    expect(synapseCopy).not.toBe(
      network.synapseMap.get(synapseCopy.innovation)
    );
  });
  networkCopy.neurons.forEach((neuronCopy) => {
    // Ensure copied neurons are not referentially equal to original network.
    expect(neuronCopy).not.toBe(network.neuronMap.get(neuronCopy.id));
    neuronCopy.inputs.forEach((input: Synapse) => {
      // Ensure copied neurons' inputs are referentially equal to copied network.
      expect(input).toBe(networkCopy.synapseMap.get(input.innovation));
    });
    neuronCopy.outputs.forEach((output: Synapse) => {
      // Ensure copied neurons' outputs are referentially equal to copied network.
      expect(output).toBe(networkCopy.synapseMap.get(output.innovation));
    });
  });
  // Ensure inputs and outputs have been populated.
  expect(networkCopy.inputs.length).toEqual(network.inputs.length);
  expect(networkCopy.outputs.length).toEqual(network.outputs.length);
});

// test('Network::activate', () => {
//   Todo
// });
