import { Organism } from 'neat/Organism';
import { Species } from 'neat/Species';
import { descending } from 'util/sortFunctions';
import { Fitness } from 'neat/Fitness';
import { INeatParams } from 'neat/NeatParams';

export class Population {
  generation: number = 1;
  organisms: Organism[] = [];
  parameters: INeatParams;
  species: Species[] = [];

  constructor(parameters: INeatParams) {
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
