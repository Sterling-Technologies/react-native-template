import EventEmitter from '@library/core/EventEmitter';

test('basic event', async () => {
  let emitter = EventEmitter.load();
  expect(emitter).toBeInstanceOf(EventEmitter);

  let triggered = false;
  emitter.on('do something', async x => {
    expect(x).toBe(1);
    triggered = true;
  });

  await emitter.trigger('do something', 1);
  expect(triggered).toBe(true);
});
