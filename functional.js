const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data);

const pipe = (...functions) => data =>
  functions.reduce((value, func) => func(value), data);

const flatten = a =>
  a.reduce((arr, obj) =>
    arr.concat(Array.isArray(obj) ? flatten(obj) : obj), []);

module.exports = { compose, pipe, flatten };
