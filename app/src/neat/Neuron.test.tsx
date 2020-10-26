import React from 'react';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';

test('Neuron::activate(input)', () => {
  const neuron = new Neuron({ type: NeuronType.Input });

  expect(neuron.activate(0)).toEqual(0);
  expect(neuron.activation).toEqual(0);

  expect(neuron.activate(0.5)).toEqual(0.5);
  expect(neuron.activation).toEqual(0.5);

  expect(neuron.activate(1)).toEqual(1);
  expect(neuron.activation).toEqual(1);
});

test('Neuron::activate(output)', () => {
  const output = new Neuron({ type: NeuronType.Output });
  const hidden = [0, 1, 2].map((activation) => new Neuron({ activation }));
  output.inputs = [0, 1, 2].map(
    (weight, index) => new Synapse({ from: hidden[index], weight })
  );

  // Using default relu activation
  expect(output.activate()).toEqual(5);
  expect(output.activation).toEqual(5);
});
