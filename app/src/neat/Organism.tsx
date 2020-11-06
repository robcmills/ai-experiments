import { Genome } from 'neat/Genome';
import { Species } from 'neat/Species';
import { IPopulationParameters } from 'neat/Population';
import { ascending, descending } from 'util/sortFunctions';
import { Synapse } from 'neat/Synapse';
import { randomBool } from 'util/random';
import { isRecurrent } from 'util/isRecurrent';

/**
 * Organisms are Genomes with fitness info.
 * i.e. The genotype and phenotype together
 */
export class Organism {
  expectedOffspring = 0;
  fitness = 0;
  generation = 0;
  genome: Genome = new Genome();
  kill = false;
  originalFitness = 0;
  species?: Species;

  constructor(organism?: Partial<Organism>) {
    Object.assign(this, organism);
  }

  copy(): Organism {
    let clone = new Organism(this);
    clone.genome = this.genome.copy();
    return clone;
  }

  static crossover(
    parent1: Organism,
    parent2: Organism,
    params: IPopulationParameters,
    getRandomBool = randomBool
  ): Organism {
    const child: Organism = new Organism();

    const [moreFitParent, lessFitParent] = [parent1, parent2].sort(
      descending((o: Organism) => o.fitness)
    );

    // Crossover Neurons
    const neuronIndexSet = new Set([
      ...parent1.genome.network.neurons.map((n) => n.index),
      ...parent2.genome.network.neurons.map((n) => n.index),
    ]);
    Array.from(neuronIndexSet.values())
      .sort(ascending())
      .forEach((index) => {
        const moreFitParentNeuron = moreFitParent.genome.network.neuronMap.get(
          index
        );
        const lessFitParentNeuron = lessFitParent.genome.network.neuronMap.get(
          index
        );
        const isMatching = !!moreFitParentNeuron && !!lessFitParentNeuron;
        let donorNeuron;
        if (isMatching) {
          donorNeuron = getRandomBool()
            ? moreFitParentNeuron
            : lessFitParentNeuron;
        } else {
          donorNeuron = moreFitParentNeuron || lessFitParentNeuron;
        }
        const childNeuron = donorNeuron.copy();
        childNeuron.inputs = [];
        childNeuron.outputs = [];
        child.genome.network.addNeuron(childNeuron);
      });

    // Crossover Synapses
    const synapseIndexSet = new Set([
      ...parent1.genome.network.synapses.map((s) => s.index),
      ...parent2.genome.network.synapses.map((s) => s.index),
    ]);
    Array.from(synapseIndexSet.values())
      .sort(ascending())
      .forEach((index) => {
        const moreFitParentSynapse = moreFitParent.genome.network.synapseMap.get(
          index
        );
        const lessFitParentSynapse = lessFitParent.genome.network.synapseMap.get(
          index
        );
        const isMatching = !!moreFitParentSynapse && !!lessFitParentSynapse;
        let donorSynapse;
        if (isMatching) {
          donorSynapse = getRandomBool()
            ? moreFitParentSynapse
            : lessFitParentSynapse;
        } else {
          donorSynapse = moreFitParentSynapse || lessFitParentSynapse;
        }
        const childSynapse = donorSynapse.copy();
        childSynapse.from = child.genome.network.neuronMap.get(
          childSynapse.from.index
        );
        child.genome.network.neuronMap
          .get(childSynapse.from.index)
          .outputs.push(childSynapse);
        childSynapse.to = child.genome.network.neuronMap.get(
          childSynapse.to.index
        );
        child.genome.network.neuronMap
          .get(childSynapse.to.index)
          .inputs.push(childSynapse);
        child.genome.network.addSynapse(childSynapse);
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
