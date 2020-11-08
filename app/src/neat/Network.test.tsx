import React from 'react';
import { Network } from 'neat/Network';
import { Synapse } from 'neat/Synapse';
import { NetworkFactory } from 'neat/NetworkFactory';
import { getInnovator } from 'util/innovator';

/*
 1   2
  \ /
   3
 */
const network: Network = NetworkFactory.build({
  innovator: getInnovator(),
  numInputs: 2,
  numOutputs: 1,
});

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
    expect(neuronCopy).not.toBe(network.neuronMap.get(neuronCopy.index));
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

test('Network::activate', () => {
  expect(network.activate([0, 0])).toEqual([0]);
  expect(network.activate([1, 1])).toEqual([2]);

  network.synapses.forEach((synapse) => (synapse.weight = 1));

  expect(network.activate([1, 1])).toEqual([4]);
  expect(network.activate([2, 3])).toEqual([9]);
});
