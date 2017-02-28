const flatten = array =>
  array.reduce((a, obj) => a.concat(Array.isArray(obj) ? flatten(obj) : obj), []);
