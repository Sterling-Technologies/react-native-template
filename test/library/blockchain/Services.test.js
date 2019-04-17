import Service from '@library/blockchain/Service';
import { Ethereum } from '@library/blockchain';

test('Blockchain Service test good', async () => {
  // load Ethereum Blockchain Service
  let service = Service.load('Ethereum')
  expect(service).toBeInstanceOf(Ethereum)
});

test('Blockchain Service test exception', async () => {
  // load NonExistent Blockchain Service
  expect(() => {
      Service.load('NonExistent')
  }).toThrow(new Error('404 Not Found. (currency: NonExistent)'))
});
