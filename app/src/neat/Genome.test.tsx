import { Network } from 'neat/Network';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Genome } from 'neat/Genome';
import { defaultPopulationParameters } from 'neat/Population';

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
