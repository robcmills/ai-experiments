import { Network } from 'neat/Network';
import { defaultNeatParams, INeatParams } from 'neat/NeatParams';
import { NetworkFactory } from 'neat/NetworkFactory';

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
