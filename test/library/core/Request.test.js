import Request from '@library/core/Request';

test('stage set/has/remove/get', () => {
  const req = Request
    .load()
    .setStage('foo', 'bar', 'zoo')
    .setStage('foo', 'zoo', ['foo', 'bar', 'zoo']);

  expect(req.hasStage('foo', 'bar')).toBe(true);
  expect(req.hasStage('bar', 'foo')).toBe(false);
  expect(req.getStage('foo', 'zoo', 1)).toBe('bar');

  req.removeStage('foo', 'bar');
  expect(req.hasStage('foo', 'bar')).toBe(false);
  expect(req.hasStage('foo', 'zoo')).toBe(true);
});
