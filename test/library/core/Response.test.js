import Response from '@library/core/Response';

test('stage set/has/remove/get', () => {
  const res = Response
    .load()
    .setResults('foo', 'bar', 'zoo')
    .setResults('foo', 'zoo', ['foo', 'bar', 'zoo']);

  expect(res.hasResults('foo', 'bar')).toBe(true);
  expect(res.hasResults('bar', 'foo')).toBe(false);
  expect(res.getResults('foo', 'zoo', 1)).toBe('bar');

  res.removeResults('foo', 'bar');
  expect(res.hasResults('foo', 'bar')).toBe(false);
  expect(res.hasResults('foo', 'zoo')).toBe(true);
});

test('error set/has/message', () => {
  let res = Response.load();
  expect(res.isError()).toBe(false);

  res.setError(true, 'Some Message');
  expect(res.isError()).toBe(true);
  expect(res.getMessage()).toBe('Some Message');
});
