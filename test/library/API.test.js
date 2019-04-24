import API from '@library/API';
import app from '@library/AppHandler';

var api = {};
var settings = app.config('settings');

test('API instance', async () => {
  // load Bitcoin Blockchain Service
  api = new API(settings);
  expect(api).toBeInstanceOf(API);
});

test('API Authenticated', async () => {
  let authenticated = api.authenticated();

  expect(authenticated.authRequest).toBe(true);
});

test('API Encrypted', async () => {
  let encrypted = api.encrypted();

  expect(encrypted.encryptRequest).toBe(true);
});

test('API Upload', async () => {
  let upload = api.upload();
  expect(upload.uploadRequest).toBe(true);

  upload = api.upload(false);
  expect(upload.uploadRequest).toBe(false);
});

test('API Get Request', async () => {
  let result = await api.get('http://httpbin.org/get?test=tesst');

  expect(result).not.toBeNull();

  // response status should be defined
  expect(result.status).toBeDefined();

  expect(result.status).toBe(200);

  expect(result.data.args.test).toBeDefined();
  expect(result.data.args.test).toBe('tesst');
});

test('API Post Request', async () => {
  let result = await api.post('http://httpbin.org/post');

  expect(result).not.toBeNull();

  // response status should be defined
  expect(result.status).toBeDefined();

  expect(result.status).toBe(200);
});
