import { Organism } from 'neat/Organism';
import { buildParent1, buildParent2 } from 'neat/helpers/crossoverHelpers';
import { getInnovator } from 'util/innovator';
import { defaultNeatParams } from 'neat/NeatParams';
import { Species } from 'neat/Species';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Genome } from 'neat/Genome';

test('Organism::crossover', () => {
  const parent1: Organism = buildParent1(getInnovator());
  expect(parent1.genome.toStringSynapses()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4 8:1->5'
  );
  const parent2: Organism = buildParent2(getInnovator());
  expect(parent2.genome.toStringSynapses()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4* 6:5->6 7:6->4 9:3->5 10:1->6'
  );
  const child: Organism = Organism.crossover(parent1, parent2, () => false);
  expect(child.genome.toStringNeurons()).toEqual(
    '1:inputs:[]:outputs:[1->4,1->5,1->6] ' +
      '2:inputs:[]:outputs:[2->4*,2->5] ' +
      '3:inputs:[]:outputs:[3->4,3->5] ' +
      '4:inputs:[1->4,2->4*,3->4,5->4*,6->4]:outputs:[] ' +
      '5:inputs:[2->5,1->5,3->5]:outputs:[5->4*,5->6] ' +
      '6:inputs:[5->6,1->6]:outputs:[6->4]'
  );
  expect(child.genome.toStringSynapses()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4* 6:5->6 7:6->4 8:1->5 9:3->5 10:1->6'
  );
});

test('Organism::speciate', () => {
  const params = {
    ...defaultNeatParams,
    compatibilityThreshold: 1,
  };
  const organism1 = new Organism({
    genome: new Genome({
      network: NetworkFactory.build({
        innovator: params.innovator,
        numInputs: 2,
        numOutputs: 1,
      }),
    }),
  });
  const organism2 = new Organism({
    genome: new Genome({
      network: NetworkFactory.build({
        innovator: params.innovator,
        numInputs: 1,
        numOutputs: 2,
      }),
    }),
  });
  const organism1Clone = organism1.copy();
  const species: Species[] = [];

  // If species array is empty expect a new Species to be created and organism added to it
  Organism.speciate(params, organism1, species);
  expect(species[0].organisms[0]).toBe(organism1);

  // Expect a clone to be added to same species
  Organism.speciate(params, organism1Clone, species);
  expect(species[0].organisms[1]).toBe(organism1Clone);

  // Expect an incompatible organism to be put into a different species
  Organism.speciate(params, organism2, species);
  expect(species[1].organisms[0]).toBe(organism2);
});
