import { Organism } from 'neat/Organism';
import { Species } from 'neat/Species';
import { descending } from 'util/sortFunctions';
import { Fitness } from 'neat/Fitness';
import { INeatParams } from 'neat/NeatParams';

export class Population {
  generation: number = 1;
  organisms: Organism[] = [];
  params: INeatParams;
  species: Species[] = [];

  constructor(population: Partial<Population>) {
    Object.assign(this, population);
  }

  populate(organism: Organism) {
    for (let i = 0; i < this.params.populationSize; i++) {
      const organismCopy = organism.copy();
      organismCopy.genome.mutateWeights(this.params);
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
      Organism.speciate(this.params, organism, this.species)
    );
  }

  epoch() {
    this.generation++;
    const { species, params, generation } = this;
    const organisms = [...this.organisms];

    // Adjust compatibility threshold
    if (
      params.adjustCompatibilityThreshold &&
      species.length !== params.compatibilityModifierTarget
    ) {
      params.compatibilityThreshold +=
        -params.compatibilityModifier *
        (species.length > params.compatibilityModifierTarget ? -1 : 1);

      params.compatibilityThreshold = Math.max(
        params.compatibilityThreshold,
        params.compatibilityModifier
      );
    }

    // Adjust fitness of species' organisms
    let overallAverage = 0;
    species.forEach((species) => {
      species.adjustFitness(params);
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
        (species.averageFitness / overallAverage) * this.params.populationSize
      );
      species.reproduce({
        generation,
        params: params,
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
      const { params } = this;
      try {
        while (!Number.isFinite(maxRuns) || maxRuns--) {
          for (const organism of this.organisms) {
            const network = organism.genome.network;
            organism.fitness = fitness({
              network,
              organism,
              population: this!,
            });
            if (organism.fitness >= params.fitnessThreshold) {
              return resolve(organism);
            }
          }
          this.epoch();
          resolve(this.getSuperChamp());

          if (delay) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
