import { Network } from 'network/Network';
import { connectNeurons, Neuron, NeuronType } from 'network/Neuron';

const xorTrainingData = [
  [[0, 0], [0]],
  [[0, 1], [1]],
  [[1, 0], [1]],
  [[1, 1], [0]],
];

export class XorNetwork {
  network: Network = new Network();

  constructor() {
    const inputSize = 2;
    const outputSize = 1;
    let neuronId = 0;

    for (let i = 0; i < inputSize; i++) {
      const neuron = new Neuron({ id: neuronId++, type: NeuronType.Input });
      this.network.inputs.push(neuron);
      this.network.neuronMap.set(neuron.id, neuron);
    }
    for (let i = 0; i < outputSize; i++) {
      const neuron = new Neuron({ id: neuronId++, type: NeuronType.Output });
      this.network.outputs.push(neuron);
      this.network.neuronMap.set(neuron.id, neuron);
    }

    this.network.inputs.forEach((from: Neuron) => {
      this.network.outputs.forEach((to: Neuron) => {
        this.network.links.push(connectNeurons(from, to));
      });
    });
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

  run() {}
}
