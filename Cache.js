const persistentCache = require('persistent-cache');
const { color: { green, blue, cyan, close } } = require('ansi-styles');

const cacheSymbol = Symbol('cache');

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
      const action = `${blue.open}Cache${close} ${operation}`;
      const cacheName = `${cyan.open}[${path} ${name}]${close}`;
      console.log(`${action} ${cacheName} ${green.open}${id}${close}`);
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
        const hasKey = keys.includes(key);
        resolve(hasKey);
      })
      .catch(err => reject(err));
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this[cacheSymbol].get(key, (err, result) => {
        if (err) reject(err);
        if (result) this.log('Get', key);
        resolve(result);
      });
    });
  }

  put(key, object) {
    return new Promise((resolve, reject) => {
      this[cacheSymbol].put(key, object, (err, result) => {
        if (err) reject(err);
        this.log('Put', key);
        resolve(result);
      });
    });
  }
}

module.exports = Cache;
