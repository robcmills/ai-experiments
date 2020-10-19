import { Organism } from 'neat/Organism';
import { IPopulationParameters, Population } from 'neat/Population';
import { getRandomItem } from 'util/getRandomItem';
import { descending } from 'util/sortFunctions';
import { random } from 'util/random';
import { gaussian } from 'util/gaussian';
import { wrap } from 'util/wrap';
import { Genome } from 'neat/Genome';

export class Species {
  // The organisms of the species
  organisms: Organism[] = [];
  // Representative of the species (random)
  specimen?: Organism;
  // Mark the species for extinction
  extinct: boolean = false;
  // Species' age
  age: number = 0;
  // Age from last improvement
  ageOfLastImprovement: number = 0;
  // Max fitness ever
  maxFitness: number = 0;
  // Average fitness
  averageFitness: number = 0;
  // Number of expected offspring in proportion to the sum of adjusted fitnesses
  expectedOffspring: number = 0;

  // todo: clean up and test
  // Returns a semi-random species, tending towards more fit species
  static pick(sortedSpecies: Species[]) {
    const random = Math.min(Math.round(gaussian().next().value as number), 1);
    const index = wrap(0, sortedSpecies.length - 1, random);
    // const multiplier = Math.min(gaussian().next().value / 4, 1);
    // const index = Math.floor(multiplier * (species.length - 1) + 0.5);
    return sortedSpecies[index];
  }

  addOrganism(organism: Organism) {
    if (!this.specimen) {
      this.specimen = organism;
    }
    this.organisms.push(organism);
    organism.species = this;
  }

  removeOrganism(organism: Organism) {
    const index = this.organisms.indexOf(organism);
    if (index >= 0) this.organisms.splice(index, 1);
  }

  // todo: necessary?
  getSpecimen(): Organism {
    return this.specimen!;
  }

  getChampion(): Organism {
    return this.organisms[0];
  }

  adjustFitness(params: IPopulationParameters): void {
    let totalFitness = 0;
    this.extinct = this.age - this.ageOfLastImprovement + 1 > params.dropoffAge;

    this.organisms.forEach((organism: Organism) => {
      organism.originalFitness = organism.fitness;
      if (this.extinct) {
        // Penalty for a long period of stagnation (divide fitness by 100)
        organism.fitness *= 0.01;
      }
      if (this.age <= 10) {
        // Boost young organisms
        organism.fitness *= params.ageSignificance;
      }
      organism.fitness =
        Math.max(organism.fitness, 0.0001) / this.organisms.length;
      totalFitness += organism.originalFitness;
    });

    this.organisms.sort(descending((i: Organism) => i.fitness));
    this.specimen = getRandomItem(this.organisms);

    this.averageFitness = totalFitness / this.organisms.length;

    // update age of last improvement
    if (this.organisms[0].originalFitness > this.maxFitness) {
      this.maxFitness = this.organisms[0].originalFitness;
      this.ageOfLastImprovement = this.age;
    }

    const removeFrom = Math.floor(
      this.organisms.length * params.survivalThreshold + 1
    );

    for (let i = removeFrom; i < this.organisms.length; i++) {
      this.organisms[i].kill = true;
    }
  }

  /**
   * Perform mating and mutation to form next generation.
   * The sorted_species is ordered to have best species in the beginning.
   * Returns list of child organisms as a result of reproduction of all organisms in this species.
   */
  reproduce({
    generation,
    params,
    population,
    sortedSpecies,
  }: {
    generation: number;
    params: IPopulationParameters;
    population: Population;
    sortedSpecies: Species[];
  }): void {
    const { organisms, expectedOffspring } = this;

    if (expectedOffspring && !organisms.length) return;

    const [...children]: Organism[] = organisms;
    const champ: Organism = children[0];
    let champAdded = false;

    let superChamp: Organism | null = population.getSuperChamp();

    for (let i = 0; i < expectedOffspring; i++) {
      let child: Organism;

      if (
        superChamp &&
        superChamp === champ &&
        superChamp!.expectedOffspring > 0
      ) {
        // If we have a population champion, finish off some special clones
        let organism = superChamp!.copy(0, generation);
        if (superChamp!.expectedOffspring === 1) {
          organism.mutateGenome(params);
        }
        superChamp!.expectedOffspring--;
        child = organism;
      } else if (!champAdded && expectedOffspring > 5) {
        // Champion of species with more than 5 networks is copied unchanged
        child = champ.copy(0, generation);
        champAdded = true;
      } else if (random() < params.mutateOnlyProbability) {
        // Mutate only
        child = getRandomItem(children).copy(0, generation);
        child.mutateGenome(params);
      } else {
        // Mate
        const mom = getRandomItem(children);
        let dad;
        if (random() > params.interSpeciesMateRate) {
          dad = getRandomItem(children);
        } else {
          // Interspecies mate
          let tries = 0;
          let randomSpecies: Species = this;
          while (randomSpecies === this && tries++ < 5) {
            const species = Species.pick(sortedSpecies);
            if (species.organisms.length) {
              randomSpecies = species;
            }
          }
          dad = randomSpecies.getChampion();
        }

        child = Organism.crossover(dad, mom, params);

        if (
          random() < params.mutateOnlyProbability ||
          Genome.compatibility(mom, dad, params) === 0
        )
          child.mutateGenome(params);
      }

      child.generation = generation;
      Organism.speciate(params, child, population.species);
    }
  }
}
