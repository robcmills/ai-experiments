import { Network } from 'neat/Network';
// import {
//   defaultPopulationParameters,
//   IPopulationParameters,
//   Population,
// } from 'neat/Population';
// import { Neuron, NeuronType } from 'neat/Neuron';
// import { Synapse } from 'neat/Synapse';
// import { Organism } from 'neat/Organism';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Genome } from 'neat/Genome';
import {
  defaultPopulationParameters,
  IPopulationParameters,
} from 'neat/Population';

const xorTrainingData = [
  [[0, 0], [0]],
  [[0, 1], [1]],
  [[1, 0], [1]],
  [[1, 1], [0]],
];

const params: IPopulationParameters = {
  ...defaultPopulationParameters,
  adjustCompatibilityThreshold: true,
  compatibilityModifierTarget: 30,
  disjointCoefficient: 0.5,
  excessCoefficient: 2,
  feedForwardOnly: true,
  fitnessThreshold: 15.9,
  populationSize: 10,
  weightDifferenceCoefficient: 1,
};

export class XorNetwork {
  network: Network = NetworkFactory.build({
    innovation: params.innovation,
    numInputs: 2,
    numOutputs: 1,
  });

  constructor() {
    const genome = new Genome();
    genome.network = this.network;
    genome.mutateAddNode(params);
  }

  computeFitness() {
    let fitness = 2;
    xorTrainingData.sort(() => Math.random() - 0.5);
    xorTrainingData.forEach(([inputs, expected]) => {
      const [output] = this.network.activate(inputs);
      fitness -= Math.abs(output - expected[0]);
    });
    return fitness ** 2;
  }

  // run() {
  //   const organism = new Organism(this.network);
  //   console.log('organism', organism);
  //   const population = new Population(params);
  //   population.populate(organism);
  //   console.log('population', population);
  // }
}
