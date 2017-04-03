const { LOADED, DEFAULTS, CRAB_CLASS_PLURAL } = require('./Symbols');

const arrayList = ({ crab: { plural } }) => class extends Array {
  static get [CRAB_CLASS_PLURAL]() {
    return plural;
  }

  static get [DEFAULTS]() {
    return { [LOADED]: false };
  }

  static get [Symbol.species]() {
    return Array;
  }

  constructor() {
    super();
    Object.assign(this, arrayList[DEFAULTS]);
  }
};

module.exports = arrayList;
