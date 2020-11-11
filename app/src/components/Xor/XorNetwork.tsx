import { Network } from 'neat/Network';
import { defaultNeatParams, INeatParams } from 'neat/NeatParams';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Organism } from 'neat/Organism';
import { Population } from 'neat/Population';

const xorTrainingData = [
  [[0, 0], [0]],
  [[0, 1], [1]],
  [[1, 0], [1]],
  [[1, 1], [0]],
];

const params: INeatParams = {
  ...defaultNeatParams,
};

export class XorNetwork {
  network: Network = NetworkFactory.build({
    innovator: params.innovator,
    numInputs: 2,
    numOutputs: 1,
  });
  organism: Organism = new Organism();
  population: Population = new Population({ params });

  fitness({ network }: { network: Network }) {
    let fitness = 2;
    xorTrainingData.sort(() => Math.random() - 0.5);
    xorTrainingData.forEach(([inputs, expected]) => {
      const [output] = network.activate(inputs);
      fitness -= Math.abs(output - expected[0]);
    });
    fitness = fitness ** 2;
    return fitness;
  }

  run() {
    this.organism.genome.network = this.network;
    this.population.populate(this.organism);
    this.population.run(this.fitness, 100).then((organism) => {
      xorTrainingData.forEach(([inputs, expected]) => {
        const [output] = organism.genome.network.activate(inputs);
        console.log('inputs', inputs, 'expected', expected, 'output', output);
      });
    });
  }
}
