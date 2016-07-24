'use strict';

module.exports = function convertTo(typedVar, ...input) {
  return {
    'boolean': (v) => v == 'true', // eslint-disable-line eqeqeq
    'function': (v) => v[0],
    'number': Number,
    'object': (v) => Array.isArray(typedVar) ? [].concat(...v) : createObject(v),
    'string': String,
    'undefined': () => console.warn('typedVar is undefined')
  }[typeof typedVar](input);
};

function createObject(keysAndValues) {
  if (keysAndValues.length === 1) {
    if (typeof keysAndValues[0] === 'string') {
      throw new Error('key value *pairs* must be specified');
    }
    return keysAndValues[0];
  }
  return keysAndValues.reduce((result, value, index, array) => {
    // eslint-disable-next-line no-prototype-builtins
    if (index % 2 === 0 && result.hasOwnProperty(value)) {
      throw new Error('duplicated key: "' + value + '"');
    } else if (index % 2 !== 0) {
      result[array[index - 1]] = value;
    }
    return result;
  }, {});
}
