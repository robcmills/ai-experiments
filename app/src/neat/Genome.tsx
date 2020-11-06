import { IPopulationParameters } from 'neat/Population';
import { Neuron, NeuronType } from 'neat/Neuron';
import { Synapse } from 'neat/Synapse';
import { getRandomItem } from 'util/getRandomItem';
import { isRecurrent } from 'util/isRecurrent';
import { random } from 'util/random';
import { mean } from 'util/mean';
import { Network } from 'neat/Network';
import { isConnected } from 'util/isConnected';

export class Genome {
  network: Network = new Network();

  constructor(genome?: Partial<Genome>) {
    Object.assign(this, genome);
  }

  copy(): Genome {
    const genome: Genome = new Genome();
    genome.network = this.network.copy();
    return genome;
  }

  mutateAddSynapse(params: IPopulationParameters): void {
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
        !!from &&
        !!to &&
        !isConnected(from, to) &&
        (!params.feedForwardOnly || !isRecurrent(synapse, synapses));

      if (isValid) {
        this.network.addSynapse(synapse);
        return;
      }
    }
  }

  mutateAddNode(): void {
    if (!this.network.synapseMap.size) {
      return;
    }
    const synapse: Synapse = getRandomItem(this.network.enabledSynapses);
    synapse.disable();
    const neuron: Neuron = new Neuron({ type: NeuronType.Hidden });
    const synapseBefore = new Synapse({
      from: synapse.from,
      to: neuron,
      weight: 1,
    });
    const synapseAfter = new Synapse({
      from: neuron,
      to: synapse.to,
      weight: synapse.weight,
    });
    synapse.from.outputs.push(synapseBefore);
    synapse.to.inputs.push(synapseAfter);
    neuron.inputs = [synapseBefore];
    neuron.outputs = [synapseAfter];
    this.network.addSynapse(synapseBefore);
    this.network.addSynapse(synapseAfter);
    this.network.addNeuron(neuron);
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
            s.from !== synapse.from || !s.enabled || s.index === synapse.index
        );
        synapse.enabled = !isSafe;
      } else {
        synapse.enabled = true;
      }
    }
  }

  mutateWeights(
    { mutationPower, genomeWeightPerturbed }: IPopulationParameters,
    randomNumberGenerator = random
  ) {
    this.network.enabledSynapses.forEach((synapse: Synapse) => {
      const mutation = randomNumberGenerator(-mutationPower, mutationPower);
      randomNumberGenerator() < genomeWeightPerturbed
        ? (synapse.weight += mutation)
        : (synapse.weight -= mutation);
    });
  }

  mutate(params: IPopulationParameters) {
    if (random() < params.mutateAddNodeProbability) {
      this.mutateAddNode();
    } else if (random() < params.mutateAddConnectionProbability) {
      this.mutateAddSynapse(params);
    } else {
      if (random() < params.mutateConnectionWeightsProbability) {
        this.mutateWeights(params);
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

  toStringNeurons(): string {
    return this.network.neurons
      .map((n) => `${n.index}:${n.activation}`)
      .join(' ');
  }

  toStringSynapses(): string {
    return this.network.synapses
      .map(
        (s) =>
          `${s.index}:${s.from.index}->${s.to.index}${s.enabled ? '' : '*'}`
      )
      .join(' ');
  }

  get weights() {
    return this.network.synapses.map((s: Synapse) => s.weight);
  }

  // Compute the compatibility distance between two genomes
  static compatibility(
    genome1: Genome,
    genome2: Genome,
    params: IPopulationParameters
  ): number {
    // TODO: Memoize? Consider add an id and use it for that purpose
    let innovationNumbers: Set<number> = new Set([
      ...genome1.network.synapses.map((s: Synapse) => s.index),
      ...genome2.network.synapses.map((s: Synapse) => s.index),
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
