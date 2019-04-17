import Service from '@library/blockchain/Service';
import { Bitcoin } from '@library/blockchain';

var key = '';
var generated = {};
var service = {};

test('Bitcoin service calling', async () => {
  // load Bitcoin Blockchain Service
  service = Service.load('Bitcoin');
  expect(service).toBeInstanceOf(Bitcoin);
});

test('Bitcoin generate wallet address', async () => {
  // generate address
  let address = await service.generate();

  // address should not be null
  expect(address).not.toBeNull();

  // bitcoin address should be defined
  expect(address.address).toBeDefined();

  generated = address;
});

test('Bitcoin loadFromPrivateKey', async () => {
  // load address
  let wallet = await service.loadFromPrivateKey(generated.key);

  // they should be the same
  expect(wallet.address).toBe(generated.address);
});

test('Bitcoin signTransaction', async () => {
  // prepare data
  let data = {
    key: 'cP99ZLw9DX2CboXdPRNXA82tZXie7khRR2rDEBSNKrL41YVbbhXD',
    to: generated.address,
    value: '100000'
  };

  // sign transaction
  let sign = await service.signTransaction(data);

  // should provide signed transaction
  expect(sign).not.toBeNull();
});
