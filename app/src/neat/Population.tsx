import { Organism } from 'neat/Organism';
import { Species } from 'neat/Species';
import { descending } from 'util/sortFunctions';
import { Fitness } from 'neat/Fitness';

export interface IPopulationParameters {
  // When Species starts to be penalized
  dropoffAge: number;
  // Excess coefficient used to compute compatibility
  excessCoefficient: number;
  // Disjoint coefficient used to compute compatibility
  disjointCoefficient: number;
  // Weight difference coefficient used to compute compatibility
  weightDifferenceCoefficient: number;
  // Threshold to consider two species different
  compatibilityThreshold: number;
  // Compatibility threshold modifier for each generation. Set to 0 to disable.
  compatibilityModifier: number;
  // Number of species to increase/decrease the compatibility threshold
  compatibilityModifierTarget: number;
  // Whether to adjust the threshold used to compute compatibility
  adjustCompatibilityThreshold: boolean;
  // The power of a connection weight mutation
  mutationPower: number;
  // Probability for a disabled connection to be re-enabled
  reEnableGeneProbability: number;
  // Probability for genome to have its weights mutated
  mutateConnectionWeightsProbability: number;
  // Chance for genome weight to be uniformly perturbed
  genomeWeightPerturbed: number;
  // Fitness boost for young ages (less than 10)
  ageSignificance: number;
  // Percent of average fitness for survival
  survivalThreshold: number;
  // Size of population
  populationSize: number;
  // Probability of a non-mating reproduction
  mutateOnlyProbability: number;
  // Probability of an "add node" mutation
  mutateAddNodeProbability: number;
  // Probability of an "add connection" mutation
  mutateAddConnectionProbability: number;
  // Probability of a genome being toggled
  mutateToggleEnableProbability: number;
  // Probability of a mate being outside species
  interSpeciesMateRate: number;
  // Threshold to consider the network valid
  fitnessThreshold: number;
  // Number of attempts to find an open link
  addConnectionTries: number;
  // Generator of innovation numbers
  innovation: IterableIterator<number>;
  // If true, only feed-forward networks are allowed
  feedForwardOnly: boolean;
}

export class Population {
  generation: number = 1;
  organisms: Organism[] = [];
  parameters: IPopulationParameters;
  species: Species[] = [];

  constructor(parameters: IPopulationParameters) {
    this.parameters = parameters;
  }

  populate(organism: Organism) {
    for (let i = 0; i < this.parameters.populationSize; i++) {
      const organismCopy = organism.copy();
      organismCopy.mutateConnectionsWeights(this.parameters);
      this.addOrganism(organismCopy);
    }
    this.speciate();
  }

  getSuperChamp(): Organism | null {
    return this.organisms.length
      ? this.organisms.reduce((champ, organism) =>
          organism.originalFitness > champ.originalFitness ? organism : champ
        )
      : null;
  }

  addOrganism(organism: Organism) {
    this.organisms.push(organism);
  }

  removeOrganism(organism: Organism) {
    const index = this.organisms.indexOf(organism);
    if (index >= 0) this.organisms.splice(index, 1);
  }

  speciate(): void {
    this.organisms.forEach((organism) =>
      Organism.speciate(this.parameters, organism, this.species)
    );
  }

  epoch() {
    this.generation++;

    const { species, parameters, generation } = this;

    const organisms = [...this.organisms];

    // Adjust compatibility threshold
    if (
      parameters.adjustCompatibilityThreshold &&
      species.length !== parameters.compatibilityModifierTarget
    ) {
      parameters.compatibilityThreshold +=
        -parameters.compatibilityModifier *
        (species.length > parameters.compatibilityModifierTarget ? -1 : 1);

      parameters.compatibilityThreshold = Math.max(
        parameters.compatibilityThreshold,
        parameters.compatibilityModifier
      );
    }

    let overallAverage = 0;
    // Adjust fitness of species' organisms
    species.forEach((species) => {
      species.adjustFitness(parameters);
      overallAverage += species.averageFitness;
    });

    organisms.forEach((organism, i) => {
      // Remove all organisms marked for death
      if (organism.kill) {
        this.removeOrganism(organism);
        organism.species!.removeOrganism(organism);
      } else {
        organism.expectedOffspring = Math.round(
          organism.originalFitness / overallAverage
        );
      }
    });

    const sortedSpecies = [...species].sort(
      descending((i: Species) => i.maxFitness)
    );

    // Reproduce all species
    sortedSpecies.forEach((species) => {
      species.expectedOffspring = Math.round(
        (species.averageFitness / overallAverage) *
          this.parameters.populationSize
      );
      species.reproduce({
        generation,
        params: parameters,
        population: this,
        sortedSpecies,
      });
    });

    // Remove all the organism from the old generation
    [...this.organisms].forEach((organism) => {
      this.removeOrganism(organism);
      organism.species!.removeOrganism(organism);
    });

    // Add species' organisms to current generation
    this.species = species.filter((species) => {
      // Remove empty species
      if (!species.organisms.length) return false;
      // Add organisms to population
      else this.organisms.push(...species.organisms);

      species.age++;

      return true;
    });

    // this.speciate();
  }

  run(
    fitness: Fitness,
    maxRuns: number = Infinity,
    delay: number = 0
  ): Promise<Organism> {
    return new Promise(async (resolve, reject) => {
      const { parameters } = this;
      while (!Number.isFinite(maxRuns) || maxRuns--) {
        for (const org of this.organisms) {
          const net = org.getNetwork();
          org.fitness = await fitness({
            network: net,
            organism: org,
            population: this!,
          });
          if (org.fitness >= parameters.fitnessThreshold) {
            return resolve(org);
          }
        }
        this!.epoch();

        if (delay) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      reject();
    });
  }
}
