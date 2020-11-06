import { defaultPopulationParameters } from 'neat/Population';
import { Organism } from 'neat/Organism';
import { buildParent1, buildParent2 } from 'neat/helpers/crossoverHelpers';

test('Organism::crossover', () => {
  const params = { ...defaultPopulationParameters };
  const parent1: Organism = buildParent1();
  expect(parent1.genome.toStringSynapses()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4 6:1->5'
  );
  const parent2: Organism = buildParent2();
  expect(parent2.genome.toStringSynapses()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4* 6:5->6 7:6->4 8:3->5 9:1->6'
  );
  const child: Organism = Organism.crossover(
    parent1,
    parent2,
    params,
    () => false
  );
  expect(child.genome.toStringNeurons()).toEqual(
    '1:inputs:[]:outputs:[1->4,1->6] ' +
      '2:inputs:[]:outputs:[2->4*,2->5] ' +
      '3:inputs:[]:outputs:[3->4,3->5] ' +
      '4:inputs:[1->4,2->4*,3->4,5->4*,6->4]:outputs:[] ' +
      '5:inputs:[2->5,3->5]:outputs:[5->4*,5->6] ' +
      '6:inputs:[5->6,1->6]:outputs:[6->4]'
  );
  expect(child.genome.toStringSynapses()).toEqual(
    '1:1->4 2:2->4* 3:3->4 4:2->5 5:5->4* 6:5->6 7:6->4 8:3->5 9:1->6'
  );
});
