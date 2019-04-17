import Service from '@library/blockchain/Service';
import { Ethereum } from '@library/blockchain';
import AppHandler from '@library/AppHandler';

var key = '';
var generated = {};
var service = {};

test('Ethereum service calling', async () => {
  // load Ethereum Blockchain Service
  service = Service.load('Ethereum');
  expect(service).toBeInstanceOf(Ethereum);
});

test('Ethereum generate wallet address', async () => {
  // generate address
  let address = await service.generate();

  // address should not be null
  expect(address).not.toBeNull();

  // Ethereum address should be defined
  expect(address.address).toBeDefined();

  generated = address;
});

test('Ethereum get balance', async () => {
  // get balance
  let balance = await service.getBalance(generated.address);

  expect(balance).toBe('0');
});

test('Ethereum loadFromPrivateKey', async () => {
  // load address
  let wallet = await service.loadFromPrivateKey(generated.key);

  // they should be the same
  expect(wallet.address).toBe(generated.address);
});

test('Ethereum signTransaction', async () => {
  // prepare data
  let data = {
    key: '0x81ba33c25520155b937d644b5153f29a7e281cf16934ee623fae93612311bd76',
    to: generated.address,
    value: '10000000000'
  };

  // sign the transaction
  let sign = await service.signTransaction(data);

  // should provide signed transaction
  expect(sign).not.toBeNull();
});
