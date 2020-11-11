import { defaultNeatParams } from 'neat/NeatParams';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Organism } from 'neat/Organism';
import { Population } from 'neat/Population';
import { Genome } from 'neat/Genome';

test('Species::adjustFitness', () => {
  const params = {
    ...defaultNeatParams,
    populationSize: 10,
  };
  const population = new Population({ params });
  const organism = new Organism({
    genome: new Genome({
      network: NetworkFactory.build({
        innovator: params.innovator,
        numInputs: 2,
        numOutputs: 1,
      }),
    }),
  });
  population.populate(organism);
  const species = population.species[0];
  expect(species.organisms.length).toEqual(10);
  species.adjustFitness(params);
  expect(species.extinct).toBe(false);
  // console.log('averageFitness', species.averageFitness);
  expect(species.averageFitness).toBe(0);
  // species.organisms.forEach((organism) => {
  //   console.log(organism.originalFitness, organism.fitness);
  // });
  expect(species.maxFitness).toBe(0);
  expect(species.organisms.map((o) => o.fitness)).toEqual([
    0.00001,
    0.00001,
    0.00001,
    0.00001,
    0.00001,
    0.00001,
    0.00001,
    0.00001,
    0.00001,
    0.00001,
  ]);
  expect(species.organisms.map((o) => (o.kill ? 1 : 0))).toEqual([
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]);
});
