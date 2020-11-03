import { Organism } from 'neat/Organism';
import { Species } from 'neat/Species';
import { descending } from 'util/sortFunctions';
import { Fitness } from 'neat/Fitness';

export interface IPopulationParameters {
  addConnectionTries: number; // Number of attempts to find an open link
  adjustCompatibilityThreshold: boolean; // Whether to adjust the threshold used to compute compatibility
  ageSignificance: number; // Fitness boost for young ages (less than 10)
  compatibilityModifier: number; // Compatibility threshold modifier for each generation. Set to 0 to disable.
  compatibilityModifierTarget: number; // Number of species to increase/decrease the compatibility threshold
  compatibilityThreshold: number; // Threshold to consider two species different
  disjointCoefficient: number; // Disjoint coefficient used to compute compatibility
  dropoffAge: number; // When Species starts to be penalized
  excessCoefficient: number; // Excess coefficient used to compute compatibility
  feedForwardOnly: boolean; // If true, only feed-forward networks are allowed
  fitnessThreshold: number; // Threshold to consider the network valid
  genomeWeightPerturbed: number; // Chance for genome weight to be uniformly perturbed
  interSpeciesMateRate: number; // Probability of a mate being outside species
  mutateAddConnectionProbability: number; // Probability of an "add connection" mutation
  mutateAddNodeProbability: number; // Probability of an "add node" mutation
  mutateConnectionWeightsProbability: number; // Probability for genome to have its weights mutated
  mutateOnlyProbability: number; // Probability of a non-mating reproduction
  mutateToggleEnableProbability: number; // Probability of a genome being toggled
  mutationPower: number; // The power of a connection weight mutation
  populationSize: number; // Size of population
  reEnableGeneProbability: number; // Probability for a disabled connection to be re-enabled
  survivalThreshold: number; // Percent of average fitness for survival
  weightDifferenceCoefficient: number; // Weight difference coefficient used to compute compatibility
}

export const defaultPopulationParameters: IPopulationParameters = {
  addConnectionTries: 20,
  adjustCompatibilityThreshold: false,
  ageSignificance: 1,
  compatibilityModifier: 0.3,
  compatibilityModifierTarget: 10,
  compatibilityThreshold: 3.0,
  disjointCoefficient: 1.0,
  dropoffAge: 15,
  excessCoefficient: 1.0,
  feedForwardOnly: true,
  fitnessThreshold: 0.9,
  genomeWeightPerturbed: 0.9,
  interSpeciesMateRate: 0.001,
  mutateAddConnectionProbability: 0.05,
  mutateAddNodeProbability: 0.03,
  mutateConnectionWeightsProbability: 0.9,
  mutateOnlyProbability: 0.2,
  mutateToggleEnableProbability: 0,
  mutationPower: 2.5,
  populationSize: 100,
  reEnableGeneProbability: 0.05,
  survivalThreshold: 0.2,
  weightDifferenceCoefficient: 1,
};

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
      organismCopy.genome.mutateWeights(this.parameters);
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

    // Adjust fitness of species' organisms
    let overallAverage = 0;
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

    this.speciate();
  }

  run(
    fitness: Fitness,
    maxRuns: number = Infinity,
    delay: number = 0
  ): Promise<Organism> {
    return new Promise(async (resolve, reject) => {
      const { parameters } = this;
      while (!Number.isFinite(maxRuns) || maxRuns--) {
        for (const organism of this.organisms) {
          const network = organism.genome.network;
          organism.fitness = await fitness({
            network,
            organism,
            population: this!,
          });
          if (organism.fitness >= parameters.fitnessThreshold) {
            return resolve(organism);
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
