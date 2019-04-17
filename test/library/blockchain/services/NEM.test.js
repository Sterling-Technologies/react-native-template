import Service from '@library/blockchain/Service';
import { NEM } from '@library/blockchain';

var key = '';
var generated = {};
var service = {};

test('NEM service calling', async () => {
  // load NEM Blockchain Service
  service = Service.load('NEM');
  expect(service).toBeInstanceOf(NEM);
});

test('NEM generate wallet address', async () => {
  // generate address
  let address = await service.setDev().generate();

  // address should not be null
  expect(address).not.toBeNull();

  // NEM address should be defined
  expect(address.address).toBeDefined();

  generated = address;
});

test('NEM loadFromPrivateKey', async () => {
  // load address
  let wallet = await service.setDev().loadFromPrivateKey(generated.key);

  // they should be the same
  expect(wallet.address).toBe(generated.address);
});

test('NEM signTransaction', () => {
  // prepare data
  let data = {
    key: '0xa4777743ca8ea824727e5cb2de8433a881659c01175c2474a3a006371458bbf5',
    to: generated.address,
    value: '100000'
  };

  // sign the transaction
  //let sign = await service.signTransaction(data);

  // should provide signed transaction
  //expect(sign).not.toBeNull();
});
