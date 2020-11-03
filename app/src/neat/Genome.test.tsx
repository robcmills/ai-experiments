import { Network } from 'neat/Network';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Genome } from 'neat/Genome';
import { defaultPopulationParameters } from 'neat/Population';
import { createNumberGenerator } from 'util/createNumberGenerator';

test('Genome::mutateAddNode', () => {
  const params = { ...defaultPopulationParameters };
  const network: Network = NetworkFactory.build({
    numInputs: 2,
    numOutputs: 1,
  });
  const genome: Genome = new Genome({ network });
  genome.mutateAddNode();
  expect(genome.network.neuronMap.size).toEqual(4);
  expect(genome.network.synapseMap.size).toEqual(4);
});

test('Genome::mutateAddConnection', () => {
  const params = { ...defaultPopulationParameters };
  const network: Network = NetworkFactory.build({
    numInputs: 2,
    numOutputs: 1,
  });
  const genome: Genome = new Genome({ network });
  expect(genome.network.synapseMap.size).toEqual(2);
  genome.mutateAddSynapse(params);
  // Default network is already fully connected
  expect(genome.network.synapseMap.size).toEqual(2);
  genome.mutateAddNode();
  genome.mutateAddNode();
  genome.mutateAddSynapse(params);
  expect(genome.network.synapseMap.size).toEqual(7);
});

test('Genome::mutateWeights', () => {
  const params = { ...defaultPopulationParameters };
  const network: Network = NetworkFactory.build({
    numInputs: 2,
    numOutputs: 1,
  });
  const genome: Genome = new Genome({ network });
  expect(genome.weights).toEqual([1, 1]);
  genome.mutateWeights(params, createNumberGenerator([1, 0, 2, 0]));
  expect(genome.weights).toEqual([2, 3]);
});
