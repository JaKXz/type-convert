import test from 'ava';
import * as td from 'testdouble';
import convertTo from './';

test.before(() => {
  td.replace(console, 'warn', td.function());
});

test('should convertTo a number', (t) => {
  t.is(convertTo(1, '1'), 1);
});

test('should convertTo a string', (t) => {
  t.is(convertTo('15', 14), '14');
});

test('should convertTo a boolean', (t) => {
  t.false(convertTo(true, 'false'));
  t.true(convertTo(false, 'true'));
});

test('should handle arrays', (t) => {
  t.deepEqual(convertTo([], 1, 2, 3), [1, 2, 3]);
});

test('should return the value if no conversion is needed', (t) => {
  t.true(convertTo(true, true));
  t.is(convertTo(1, 3), 3);
  t.is(convertTo('string', 'foo'), 'foo');
  t.deepEqual(convertTo([], ['foo']), ['foo']);
  t.deepEqual(convertTo({}, {foo: 'bar'}), {foo: 'bar'}, 'should not mutate the given object');
});

test('should pass functions through', (t) => {
  const bar = convertTo(() => {}, (v) => v);
  t.is(bar('foo'), 'foo');
});

test('should handle objects', (t) => {
  t.deepEqual(convertTo({}, 'key', 'value'), {
    key: 'value'
  });
});

test('should handle objects with multiple key value pairs', (t) => {
  t.deepEqual(convertTo({}, 'key', 1, 'key2', 2), {
    key: 1,
    key2: 2
  });
});

test('should throw when only given one key', (t) => {
  t.throws(
    () => convertTo({}, 'key'),
    /key value \*pairs\* must be specified/
  );
});

test('should throw when given duplicate keys', (t) => {
  t.throws(
    () => convertTo({}, 'key', 'value', 'key', 'anotherValue'),
    /duplicated key: "key"/
  );
});

test('should warn when given undefined', (t) => {
  t.is(convertTo(undefined, 'bar'), undefined);
  td.verify(console.warn('typedVar is undefined'));
});

test('should warn when given null', (t) => {
  t.is(convertTo(null, 'foo'), null);
  t.is(convertTo(null, 'foo', {bar: 'baz'}), null);
  td.verify(console.warn('typedVar is null'));
});
