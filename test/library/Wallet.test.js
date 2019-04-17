import Wallet from '@library/Wallet';
import { Ethereum } from '@library/blockchain';

var key = '';
var generated = {};
var wallet = {};

test('Load NonExistent Wallet', async () => {
  // load NonExistent Wallet
  expect(() => {
    new Wallet('NonExistent').generate();
  }).toThrow(new Error('404 Not Found. (currency: NonExistent)'));
});

test('Load Wallet and generate address', async () => {
  // load Ethereum Wallet
  wallet = new Wallet('Ethereum');

  // generate address
  let address = await wallet.generate();

  // address should not be null
  expect(address).not.toBeNull();

  // ethereum address should be defined
  expect(address.address).toBeDefined();

  generated = address;
});

test('get Wallet Balance', async () => {
  // get balance
  let balance = await wallet.getBalance(generated.address);

  expect(balance).toBe('0');
});

test('Load Wallet Address given Private Key', async () => {
  // load address
  let address = await wallet.import(generated.key);

  // they should be the same
  expect(address.address).toBe(generated.address);
});
