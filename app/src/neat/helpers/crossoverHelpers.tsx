import { Organism } from 'neat/Organism';
import { Network } from 'neat/Network';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { Genome } from 'neat/Genome';
import { Innovator } from 'util/innovator';

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

export function buildParent1(innovator: Innovator): Organism {
  const network1: Network = NetworkFactory.build({
    innovator,
    numInputs: 3,
    numOutputs: 1,
  });
  const neuron5 = new Neuron({ type: NeuronType.Hidden });
  network1.addNeuron(neuron5);
  network1.synapseMap.get(2).disable();
  const synapse4 = new Synapse({
    from: network1.neuronMap.get(2),
    to: network1.neuronMap.get(5),
  });
  network1.neuronMap.get(2).outputs.push(synapse4);
  neuron5.inputs.push(synapse4);
  const synapse5 = new Synapse({
    from: network1.neuronMap.get(5),
    to: network1.neuronMap.get(4),
  });
  network1.neuronMap.get(4).inputs.push(synapse5);
  neuron5.outputs.push(synapse5);
  const synapse8 = new Synapse({
    innovation: 8,
    from: network1.neuronMap.get(1),
    to: network1.neuronMap.get(5),
  });
  network1.neuronMap.get(1).outputs.push(synapse8);
  neuron5.inputs.push(synapse8);
  network1.addSynapses([synapse4, synapse5], innovator);
  network1.synapseMap.set(synapse8.innovation, synapse8);
  const genome1 = new Genome({ network: network1 });
  return new Organism({ fitness: 1, genome: genome1 });
}

export function buildParent2(innovator: Innovator): Organism {
  const network2: Network = NetworkFactory.build({
    innovator,
    numInputs: 3,
    numOutputs: 1,
  });
  const neuron5 = new Neuron({ type: NeuronType.Hidden });
  const neuron6 = new Neuron({ type: NeuronType.Hidden });
  network2.addNeuron(neuron5);
  network2.addNeuron(neuron6);
  network2.synapseMap.get(2).disable();
  const synapse4 = new Synapse({
    from: network2.neuronMap.get(2),
    to: network2.neuronMap.get(5),
  });
  network2.neuronMap.get(2).outputs.push(synapse4);
  neuron5.inputs.push(synapse4);
  const synapse5 = new Synapse({
    enabled: false,
    from: network2.neuronMap.get(5),
    to: network2.neuronMap.get(4),
  });
  neuron5.outputs.push(synapse5);
  network2.neuronMap.get(4).inputs.push(synapse5);
  const synapse6 = new Synapse({
    from: network2.neuronMap.get(5),
    to: network2.neuronMap.get(6),
  });
  neuron5.outputs.push(synapse6);
  neuron6.inputs.push(synapse6);
  const synapse7 = new Synapse({
    from: network2.neuronMap.get(6),
    to: network2.neuronMap.get(4),
  });
  neuron6.outputs.push(synapse7);
  network2.neuronMap.get(4).inputs.push(synapse7);
  const synapse9 = new Synapse({
    innovation: 9,
    from: network2.neuronMap.get(3),
    to: network2.neuronMap.get(5),
  });
  network2.neuronMap.get(3).outputs.push(synapse9);
  neuron5.inputs.push(synapse9);
  const synapse10 = new Synapse({
    innovation: 10,
    from: network2.neuronMap.get(1),
    to: network2.neuronMap.get(6),
  });
  network2.neuronMap.get(1).outputs.push(synapse10);
  neuron6.inputs.push(synapse10);
  network2.addSynapses([synapse4, synapse5, synapse6, synapse7], innovator);
  network2.synapseMap.set(synapse9.innovation, synapse9);
  network2.synapseMap.set(synapse10.innovation, synapse10);
  const genome2 = new Genome({ network: network2 });
  return new Organism({ fitness: 1, genome: genome2 });
}
