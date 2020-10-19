import { IPopulationParameters } from 'neat/Population';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { getRandomItem } from 'util/getRandomItem';
import { isRecurrent } from 'util/isRecurrent';
import { random } from 'util/random';
import { uuid } from 'util/uuid';
import { mean } from 'util/mean';

export class Genome {
  id: string;
  neuronMap: Map<string, Neuron> = new Map();
  synapseMap: Map<number, Synapse> = new Map();

  constructor(id: string = uuid()) {
    this.id = id;
  }

  get neurons(): Neuron[] {
    return Array.from(this.neuronMap.values());
  }

  get synapses(): Synapse[] {
    return Array.from(this.synapseMap.values());
  }

  get enabledSynapses(): Synapse[] {
    return this.synapses.filter((s) => s.enabled);
  }

  // Compute the compatibility distance between two genomes
  static compatibility(
    genome1: Genome,
    genome2: Genome,
    params: IPopulationParameters
  ): number {
    // TODO memoizing? consider add an id and use it for that purpose
    let innovationNumbers: Set<number> = new Set([
      ...genome1.synapses.map((s: Synapse) => s.innovation),
      ...genome2.synapses.map((s: Synapse) => s.innovation),
    ]);

    let excess = Math.abs(genome1.synapseMap.size - genome2.synapseMap.size);
    let disjoint = -excess;
    const matching: Array<number> = [];
    const N = Math.max(genome1.synapseMap.size, genome2.synapseMap.size, 1);

    innovationNumbers.forEach((innovation) => {
      const gene1 = genome1.synapseMap.get(innovation);
      const gene2 = genome2.synapseMap.get(innovation);

      if (gene1 && gene2) {
        matching.push(Math.abs(gene1.weight - gene2.weight));
      } else if (!gene1 || !gene2) {
        disjoint++;
      }
    });

    return (
      (excess * params.excessCoefficient +
        disjoint * params.disjointCoefficient) /
        N +
      mean(...matching) * params.weightDifferenceCoefficient
    );
  }

  copy(): Genome {
    const genome: Genome = new Genome();

    this.synapseMap.forEach((gene, key) => {
      genome.synapseMap.set(key, gene.copy());
    });

    this.neuronMap.forEach((node, key) => {
      genome.neuronMap.set(key, node.copy());
    });

    return genome;
  }

  connectionExists(neuron1: Neuron, neuron2: Neuron): boolean {
    return this.synapses.some(
      (synapse) =>
        synapse.from.id === neuron1.id && synapse.to.id === neuron2.id
    );
  }

  addConnection(config: IPopulationParameters, connection: Synapse) {
    connection.innovation = config.innovation.next().value;
    this.synapseMap.set(connection.innovation, connection);
  }

  // todo: rename to addNeuron
  addNode(neuron: Neuron) {
    if (!this.neuronMap.has(neuron.id)) {
      this.neuronMap.set(neuron.id, neuron);
    }
  }

  mutateAddConnection(params: IPopulationParameters): void {
    let maxTries = params.addConnectionTries;
    let neurons = this.neurons;
    const synapses = this.synapses;

    while (maxTries--) {
      const from = getRandomItem(neurons.filter((n) => !n.isOutput));

      const to = getRandomItem(
        neurons.filter(
          (node) =>
            // don't allow sensors to get input
            !node.isInput &&
            // exclude self loops
            node !== from &&
            // consider connections between output nodes recurrent
            (from.type === NeuronType.Output
              ? node.type !== NeuronType.Output
              : true)
        )
      );

      const synapse = new Synapse({
        from,
        to,
        weight: random(-params.mutationPower, params.mutationPower),
      });

      const isValid =
        // connection already exists
        !this.connectionExists(from, to) &&
        // is a RNN
        (!params.feedForwardOnly || !isRecurrent(synapse, synapses));

      if (isValid) {
        this.addConnection(params, synapse);
        return;
      }
    }
  }

  mutateAddNode(params: IPopulationParameters): void {
    if (!this.synapseMap.size) return;

    const synapse: Synapse = getRandomItem(this.enabledSynapses);
    const neuron: Neuron = new Neuron(NeuronType.Hidden);

    synapse.disable();

    this.addConnection(params, new Synapse({ from: synapse.from, to: neuron }));
    this.addConnection(
      params,
      new Synapse({ from: neuron, to: synapse.to, weight: synapse.weight })
    );
    this.addNode(neuron);
  }

  // Enable first disabled gene
  reEnableGene(): void {
    for (const synapse of this.synapses) {
      if (!synapse.enabled) {
        synapse.enabled = true;
        return;
      }
    }
  }

  // Mutate a connection by enabling/disabling
  mutateToggleEnable(times: number = 1) {
    while (times--) {
      const synapse: Synapse = getRandomItem(this.synapses);

      if (synapse.enabled) {
        const isSafe = this.synapses.some(
          (s: Synapse) =>
            s.from !== synapse.from ||
            !s.enabled ||
            s.innovation === synapse.innovation
        );
        synapse.enabled = !isSafe;
      } else {
        synapse.enabled = true;
      }
    }
  }

  // Mutate all connections
  mutateConnectionsWeights({
    mutationPower,
    genomeWeightPerturbed,
  }: IPopulationParameters) {
    this.synapses.forEach((synapse: Synapse) => {
      const r = random(mutationPower, -mutationPower);
      if (synapse.enabled) {
        random() < genomeWeightPerturbed
          ? (synapse.weight += r)
          : (synapse.weight = r);
      }
    });
  }

  mutateGenome(params: IPopulationParameters) {
    if (random() < params.mutateAddNodeProbability) {
      this.mutateAddNode(params);
    } else if (random() < params.mutateAddConnectionProbability) {
      this.mutateAddConnection(params);
    } else {
      if (random() < params.mutateConnectionWeightsProbability) {
        this.mutateConnectionsWeights(params);
      }
      if (random() < params.mutateToggleEnableProbability) {
        this.mutateToggleEnable();
      }
      if (random() < params.reEnableGeneProbability) {
        this.reEnableGene();
      }
    }
    return this;
  }
}
