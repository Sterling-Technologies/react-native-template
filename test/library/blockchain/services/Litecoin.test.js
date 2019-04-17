import Service from '@library/blockchain/Service';
import { Litecoin } from '@library/blockchain';

var key = '';
var generated = {};
var service = {};

test('Litecoin service calling', async () => {
  // load Litecoin Blockchain Service
  service = Service.load('Litecoin');
  expect(service).toBeInstanceOf(Litecoin);
});

test('Litecoin generate wallet address', async () => {
  // generate address
  let address = await service.generate();

  // address should not be null
  expect(address).not.toBeNull();

  // litecoin address should be defined
  expect(address.address).toBeDefined();

  generated = address;
});

test('Litecoin loadFromPrivateKey', async () => {
  // load address
  let wallet = await service.loadFromPrivateKey(generated.key);

  // they should be the same
  expect(wallet.address).toBe(generated.address);
});

test('Litecoin signTransaction', async () => {
  // prepare data
  let data = {
    key: 'cVcwqbCcfzY2Udc8WDscVVU8fF7atAnk9WQkNT6msP9q1txbzYez',
    to: generated.address,
    value: '100000'
  };

  // sign the transaction
  let sign = await service.signTransaction(data);

  // should provide signed transaction
  expect(sign).not.toBeNull();
});
