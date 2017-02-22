const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data);

const pipe = (...functions) => data =>
  functions.reduce((value, func) => func(value), data);

module.exports = { compose, pipe };
