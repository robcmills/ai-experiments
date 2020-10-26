import { Genome } from 'neat/Genome';
import { Species } from 'neat/Species';
import { IPopulationParameters } from 'neat/Population';
import { ascending, descending } from 'util/sortFunctions';
import { Synapse } from 'neat/Synapse';
import { randomBool } from 'util/random';
import { isRecurrent } from 'util/isRecurrent';

/**
 * Organisms are Genomes and Networks with fitness info.
 * i.e. The genotype and phenotype together
 */
export class Organism {
  expectedOffspring = 0;
  fitness = 0;
  generation = 0;
  genome: Genome;
  kill = false;
  originalFitness = 0;
  species?: Species;

  // constructor(genome: Genome) {
  //   this.genome = genome;
  // }

  copy(): Organism {
    let clone = new Organism();
    clone.expectedOffspring = this.expectedOffspring;
    clone.fitness = this.fitness;
    clone.generation = this.generation;
    clone.genome = this.genome.copy();
    clone.kill = this.kill;
    clone.originalFitness = this.originalFitness;
    clone.species = this.species;
    return clone;
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
      ...hFitParent.genome.network.synapses.map((s: Synapse) => s.innovation),
      ...lFitParent.genome.network.synapses.map((s: Synapse) => s.innovation),
    ]);

    // Ensure that all inputs and outputs are added to the organism
    hFitParent.genome.network.neurons.forEach((neuron) => {
      if (neuron.isInput || neuron.isOutput) {
        child.genome.network.addNeuron(neuron.copy());
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
        const hConnection = hFitParent.genome.network.synapseMap.get(
          innovationNumber
        )!;
        const lConnection = lFitParent.genome.network.synapseMap.get(
          innovationNumber
        )!;

        const connection =
          hConnection && lConnection
            ? // Matching gene
              randomBool() &&
              params.feedForwardOnly &&
              !isRecurrent(hConnection, child.genome.network.synapses)
              ? hConnection.copy()
              : lConnection.copy()
            : // excess/disjoint
              (hConnection || lConnection).copy();

        // Prevent the creation of RNNs if feed-forward only
        if (
          params.feedForwardOnly &&
          isRecurrent(connection, child.genome.network.synapses)
        ) {
          return;
        }

        child.genome.network.synapseMap.set(innovationNumber, connection);

        connection.from = connection.from.copy();
        connection.to = connection.to.copy();

        child.genome.network.addNeuron(connection.from);
        child.genome.network.addNeuron(connection.to);
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
          Genome.compatibility(
            organism.genome,
            species.getSpecimen().genome,
            params
          ) < compatibilityThreshold;
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
