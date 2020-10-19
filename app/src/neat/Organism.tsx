import { Genome } from 'neat/Genome';
import { Species } from 'neat/Species';
import { Network } from 'neat/Network';
import { IPopulationParameters } from 'neat/Population';
import { ascending, descending } from 'util/sortFunctions';
import { Synapse } from 'neat/Synapse';
import { randomBool } from 'util/random';
import { isRecurrent } from 'util/isRecurrent';

// todo: convert Genome to class property instead of extending
/**
 * Organisms are Genomes and Networks with fitness info.
 * i.e. The genotype and phenotype together
 */
export class Organism extends Genome {
  expectedOffspring: number = 0;
  fitness: number;
  generation: number = 0;
  kill: boolean = false;
  originalFitness: number = 0;
  species?: Species;

  private network?: Network;

  constructor(fitness: number = 0, generation: number = 0) {
    super();
    this.fitness = fitness;
    this.generation = generation;
  }

  copy(fitness: number = 0, generation: number = 0): Organism {
    let clone = super.copy() as Organism;
    clone.fitness = fitness;
    clone.originalFitness = this.originalFitness;
    clone.generation = generation;

    return clone;
  }

  // todo: why is this necessary?
  getNetwork() {
    if (!this.network) {
      const neurons = this.neurons; // .map(({ type, id }) => ({ type, id }));
      const synapses = this.synapses.sort(
        ascending((s: Synapse) => s.innovation)
      );
      // .map(({ from, to, weight, enabled }) => ({
      //   from: from.id,
      //   to: to.id,
      //   weight,
      //   enabled,
      // }));
      this.network = new Network({ neurons, synapses });
    }
    return this.network!;
  }

  // Mate 2 organisms
  static crossover(
    genome1: Organism,
    genome2: Organism,
    params: IPopulationParameters
  ): Organism {
    const child: Organism = new Organism();

    // [moreFit, lessFit]
    const [hFitParent, lFitParent] = [genome1, genome2].sort(
      descending((o: Organism) => o.fitness)
    );

    let innovationNumbers: Set<number> = new Set([
      ...hFitParent.synapses.map((s: Synapse) => s.innovation),
      ...lFitParent.synapses.map((s: Synapse) => s.innovation),
    ]);

    // Ensure that all inputs and outputs are added to the organism
    hFitParent.neurons.forEach((neuron) => {
      if (neuron.isInput || neuron.isOutput) {
        child.addNode(neuron.copy());
      }
    });

    // todo: remove
    // lFitParent.nodes.forEach(node => {
    //     switch (node.type) {
    //         case NodeType.Input:
    //         case NodeType.Output:
    //         case NodeType.Hidden:
    //             child.addNode(node.copy());
    //     }
    // });

    Array.from(innovationNumbers.values())
      .sort(ascending())
      .forEach((innovationNumber) => {
        const hConnection = hFitParent.synapseMap.get(innovationNumber)!;
        const lConnection = lFitParent.synapseMap.get(innovationNumber)!;

        const connection =
          hConnection && lConnection
            ? // Matching gene
              randomBool() &&
              params.feedForwardOnly &&
              !isRecurrent(hConnection, child.synapses)
              ? hConnection.copy()
              : lConnection.copy()
            : // excess/disjoint
              (hConnection || lConnection).copy();

        // Prevent the creation of RNNs if feed-forward only
        if (params.feedForwardOnly && isRecurrent(connection, child.synapses)) {
          return;
        }

        child.synapseMap.set(innovationNumber, connection);

        connection.from = connection.from.copy();
        connection.to = connection.to.copy();

        child.addNode(connection.from);
        child.addNode(connection.to);
      });

    return child;
  }

  // Puts the organism into compatible species
  static speciate(
    params: IPopulationParameters,
    organism: Organism,
    allSpecies: Species[]
  ) {
    const { compatibilityThreshold } = params;

    const found =
      allSpecies.length > 0 &&
      allSpecies.some((species: Species) => {
        if (!species.organisms.length) {
          return false;
        }
        const isCompatible =
          Genome.compatibility(organism, species.getSpecimen(), params) <
          compatibilityThreshold;
        if (isCompatible) {
          species.addOrganism(organism);
        }
        return isCompatible;
      });

    if (!found) {
      const species = new Species();
      species.addOrganism(organism);
      allSpecies.push(species);
    }
  }
}
