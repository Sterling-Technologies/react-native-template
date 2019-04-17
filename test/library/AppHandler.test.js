import app from '@library/AppHandler';

test('config', () => {
  let settings = app.config('settings.dev');

  expect(settings.resend_code_timer).toBe(30);
});

test('logger', async () => {
  let triggered = false;
  app.addLogger((...args) => {
    triggered = true;
    expect(args[0]).toBe('message');
    expect(args[1]).toBe('success');
  });

  await app.log('message', 'success');

  expect(triggered).toBe(true);
});
