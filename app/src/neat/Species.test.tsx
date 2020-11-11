import { defaultNeatParams } from 'neat/NeatParams';
import { Network } from 'neat/Network';
import { NetworkFactory } from 'neat/NetworkFactory';
import { Species } from 'neat/Species';

test('Species::adjustFitness', () => {
  const params = { ...defaultNeatParams };
  const species = new Species();
  const network: Network = NetworkFactory.build({
    innovator: params.innovator,
    numInputs: 2,
    numOutputs: 1,
  });
  expect(true);
});
