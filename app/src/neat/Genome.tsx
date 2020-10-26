import { IPopulationParameters } from 'neat/Population';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { getRandomItem } from 'util/getRandomItem';
import { isRecurrent } from 'util/isRecurrent';
import { random } from 'util/random';
import { mean } from 'util/mean';
import { Network } from 'neat/Network';

export class Genome {
  network: Network = new Network();

  copy(): Genome {
    const genome: Genome = new Genome();
    genome.network = this.network.copy();
    return genome;
  }

  connectionExists(neuron1: Neuron, neuron2: Neuron): boolean {
    return this.network.synapses.some(
      (synapse) =>
        synapse.from.id === neuron1.id && synapse.to.id === neuron2.id
    );
  }

  addSynapse(config: IPopulationParameters, synapse: Synapse) {
    synapse.innovation = config.innovation.next().value;
    this.network.synapseMap.set(synapse.innovation, synapse);
  }

  addNeuron(neuron: Neuron) {
    this.network.neuronMap.set(neuron.id, neuron);
  }

  mutateAddConnection(params: IPopulationParameters): void {
    let maxTries = params.addConnectionTries;
    let neurons = this.network.neurons;
    const synapses = this.network.synapses;

    while (maxTries--) {
      const from = getRandomItem(neurons.filter((n) => !n.isOutput));
      const to = getRandomItem(neurons.filter((n) => !n.isInput && n !== from));

      const synapse = new Synapse({
        from,
        to,
        weight: random(-params.mutationPower, params.mutationPower),
      });

      const isValid =
        !this.connectionExists(from, to) &&
        (!params.feedForwardOnly || !isRecurrent(synapse, synapses));

      if (isValid) {
        this.addSynapse(params, synapse);
        return;
      }
    }
  }

  mutateAddNode(params: IPopulationParameters): void {
    if (!this.network.synapseMap.size) {
      return;
    }
    const synapse: Synapse = getRandomItem(this.network.enabledSynapses);
    synapse.disable();
    const neuron: Neuron = new Neuron({ type: NeuronType.Hidden });
    this.addSynapse(
      params,
      new Synapse({ from: synapse.from, to: neuron, weight: 1 })
    );
    this.addSynapse(
      params,
      new Synapse({ from: neuron, to: synapse.to, weight: synapse.weight })
    );
    this.addNeuron(neuron);
  }

  // Enable first disabled gene
  reEnableGene(): void {
    for (const synapse of this.network.synapses) {
      if (!synapse.enabled) {
        synapse.enabled = true;
        return;
      }
    }
  }

  // Mutate a connection by enabling/disabling
  mutateToggleEnable(times: number = 1) {
    while (times--) {
      const synapse: Synapse = getRandomItem(this.network.synapses);

      if (synapse.enabled) {
        const isSafe = this.network.synapses.some(
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
    this.network.synapses.forEach((synapse: Synapse) => {
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

  // Compute the compatibility distance between two genomes
  static compatibility(
    genome1: Genome,
    genome2: Genome,
    params: IPopulationParameters
  ): number {
    // TODO: Memoize? Consider add an id and use it for that purpose
    let innovationNumbers: Set<number> = new Set([
      ...genome1.network.synapses.map((s: Synapse) => s.innovation),
      ...genome2.network.synapses.map((s: Synapse) => s.innovation),
    ]);

    let excess = Math.abs(
      genome1.network.synapseMap.size - genome2.network.synapseMap.size
    );
    let disjoint = -excess;
    const matching: Array<number> = [];
    const N = Math.max(
      genome1.network.synapseMap.size,
      genome2.network.synapseMap.size,
      1
    );

    innovationNumbers.forEach((innovation) => {
      const gene1 = genome1.network.synapseMap.get(innovation);
      const gene2 = genome2.network.synapseMap.get(innovation);

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
}
