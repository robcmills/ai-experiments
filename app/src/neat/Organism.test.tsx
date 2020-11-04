import { defaultPopulationParameters } from 'neat/Population';
import { Network } from 'neat/Network';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Organism } from 'neat/Organism';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { Genome } from 'neat/Genome';

/*
 * Parent 1                        Parent 2
 * 1    2    3    4    5    8      1    2    3    4    5    6    7    9    10
 * 1->4 2->4 3->4 2->5 5->4 1->5   1->4 2->4 3->4 2->5 5->4 5->6 6->4 3->5 1->6
 *      dis                             dis            dis
 *
 *        4                              4
 *       /|\                            /|\
 *      / 5 \                          / 6 \
 *     / /|  \                        / / \ \
 *     |/ 2   3                       |/   5 \
 *     1                              1   / \|
 *                                       2   3
 *
 *  Offspring
 *  1    2    3    4    5    6    7    8    9    10
 *  1->4 2->4 3->4 2->5 5->4 5->6 6->4 1->5 3->5 1->6
 *       dis            dis
 *
 *          4
 *         /|\
 *        / 6 \
 *       / /|  |
 *       |/ 5  |
 *       / /|\ |
 *       |/ 2 \|
 *       1     3
 */
function buildParent1(): Organism {
  const network1: Network = NetworkFactory.build({
    numInputs: 3,
    numOutputs: 1,
  });
  const neuron5 = new Neuron({ type: NeuronType.Hidden });
  network1.addNeuron(neuron5);
  const synapse4 = new Synapse({
    from: network1.neuronMap.get(2),
    to: network1.neuronMap.get(5),
  });
  const synapse5 = new Synapse({
    from: network1.neuronMap.get(5),
    to: network1.neuronMap.get(4),
  });
  const synapse8 = new Synapse({
    index: 8,
    from: network1.neuronMap.get(1),
    to: network1.neuronMap.get(5),
  });
  network1.synapseMap.get(2).disable();
  network1.addSynapses([synapse4, synapse5]);
  network1.synapseMap.set(8, synapse8);
  neuron5.inputs = [network1.synapseMap.get(1), network1.synapseMap.get(2)];
  neuron5.outputs = [network1.synapseMap.get(4)];
  const genome1 = new Genome({ network: network1 });
  return new Organism({ fitness: 1, genome: genome1 });
}

// 1    2    3    4    5    6    7    9    10
// 1->4 2->4 3->4 2->5 5->4 5->6 6->4 3->5 1->6
//      dis            dis
function buildParent2(): Organism {
  const network2: Network = NetworkFactory.build({
    numInputs: 3,
    numOutputs: 1,
  });
  const neuron5 = new Neuron({ type: NeuronType.Hidden });
  const neuron6 = new Neuron({ type: NeuronType.Hidden });
  network2.addNeuron(neuron5);
  network2.addNeuron(neuron6);
  const synapse4 = new Synapse({
    from: network2.neuronMap.get(2),
    to: network2.neuronMap.get(5),
  });
  const synapse5 = new Synapse({
    enabled: false,
    from: network2.neuronMap.get(5),
    to: network2.neuronMap.get(4),
  });
  const synapse6 = new Synapse({
    from: network2.neuronMap.get(5),
    to: network2.neuronMap.get(6),
  });
  const synapse7 = new Synapse({
    index: 7,
    from: network2.neuronMap.get(6),
    to: network2.neuronMap.get(4),
  });
  const synapse9 = new Synapse({
    index: 9,
    from: network2.neuronMap.get(3),
    to: network2.neuronMap.get(5),
  });
  const synapse10 = new Synapse({
    index: 10,
    from: network2.neuronMap.get(1),
    to: network2.neuronMap.get(6),
  });
  network2.synapseMap.get(2).disable();
  network2.addSynapses([synapse4, synapse5, synapse6, synapse7]);
  network2.synapseMap.set(9, synapse9);
  network2.synapseMap.set(10, synapse10);
  neuron5.inputs = [network2.synapseMap.get(2), network2.synapseMap.get(3)];
  neuron5.outputs = [network2.synapseMap.get(6)];
  neuron6.inputs = [network2.synapseMap.get(1), network2.synapseMap.get(5)];
  neuron6.outputs = [network2.synapseMap.get(4)];
  const genome2 = new Genome({ network: network2 });
  return new Organism({ fitness: 1, genome: genome2 });
}

test('Organism::crossover', () => {
  const params = { ...defaultPopulationParameters };
  const parent1: Organism = buildParent1();
  expect(parent1.genome.toString()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4 8:1->5'
  );
  const parent2: Organism = buildParent2();
  expect(parent2.genome.toString()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4* 6:5->6 7:6->4 9:3->5 10:1->6'
  );
  const child: Organism = Organism.crossover(parent1, parent2, params);
  console.log('child.genome', child.genome.toString());
});
