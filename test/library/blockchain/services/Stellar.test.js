import Service from '@library/blockchain/Service';
import { Stellar } from '@library/blockchain';

var key = '';
var generated = {};
var service = {};

test('Stellar service calling', async () => {
  // load Stellar Blockchain Service
  service = Service.load('Stellar');
  expect(service).toBeInstanceOf(Stellar);
});

test('Stellar generate wallet address', async () => {
  // generate address
  let address = await service.setDev().generate();

  // address should not be null
  expect(address).not.toBeNull();

  // Stellar address should be defined
  expect(address.address).toBeDefined();

  generated = address;
});

test('Stellar loadFromPrivateKey', async () => {
  // load address
  let wallet = await service.setDev().loadFromPrivateKey(generated.key);

  // they should be the same
  expect(wallet.address).toBe(generated.address);
});

test('Stellar signTransaction', () => {
  // prepare data
  let data = {
    key: 'SDLHRTRRMJPMMWSP7JXDUNXXJNXAIBIQP35HATXEJOQB4ZVVZWRXGBOH',
    to: generated.address,
    value: '100000000'
  };

  // sign the transaction
  //let sign = await service.signTransaction(data);

  // should provide signed transaction
  //expect(sign).not.toBeNull();
});
