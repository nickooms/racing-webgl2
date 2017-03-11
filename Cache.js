const persistentCache = require('persistent-cache');
const { bold, magenta, yellow, green, gray, blue, cyan } = require('./Logging');

const cacheSymbol = Symbol('cache');

const genId = query => JSON.stringify(query)
  .replace(/\{|\}|"/g, '')
  .replace(/:/g, '=')
  .replace(/\//g, '_');

class Cache {
  constructor({ base = 'cache', name = 'cache', logging = true } = {}) {
    Object.assign(this, { base, name, logging });
    this[cacheSymbol] = persistentCache({ base, name });
  }

  log(operation, id) {
    if (this.logging) {
      const { base, name } = this;
      const path = base
        .replace(/cache\//g, '')
        .replace(/\//g, ' ');
      const action = `${cyan('[Cache]')} ${gray(operation)}`;
      let cacheName;
      let params;
      if (typeof id === 'string') {
        cacheName = blue(`[${path} ${name}]`);
        params = green(id);
      } else {
        cacheName = bold(magenta(`[${path}]`));
        params = `${bold(name)} { ${Object.entries(id).map(([key, value]) => {
          if (typeof value === 'number') return `${key}: ${yellow(value)}`;
          if (typeof value === 'string') return `${key}: ${green(`'${value}'`)}`;
          return `${key}: ${value}`;
        }).join(', ')} }`;
      }
      console.log(`${action} ${cacheName} ${params}`);
    }
  }

  ids() {
    return new Promise((resolve, reject) => {
      this[cacheSymbol].keys((err, keys) => {
        if (err) reject(new Error(err));
        resolve(keys);
      });
    });
  }

  has(key) {
    return new Promise((resolve, reject) => {
      this.ids()
      .then((keys) => {
        const hasKey = keys.includes(genId(key));
        resolve(hasKey);
      })
      .catch(err => reject(err));
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this[cacheSymbol].get(genId(key), (err, result) => {
        if (err) reject(err);
        if (result) this.log('Get', key);
        resolve(result);
      });
    });
  }

  put(key, object) {
    return new Promise((resolve, reject) => {
      this[cacheSymbol].put(genId(key), object, (err, result) => {
        if (err) reject(err);
        this.log('Put', key);
        resolve(result);
      });
    });
  }
}

module.exports = Cache;
