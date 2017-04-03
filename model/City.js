const { object } = require('../app/lib/crab');
const Streets = require('./Streets');
const { CITY, HAS_CITY, STREETS } = require('./Symbols');

const ID = 'GemeenteId';
const GET_BY_ID = `GetGemeenteBy${ID}`;

const CRABMapping = crab => ({
  name: crab.namen[crab.taal.id],
  names: crab.namen,
  language: crab.taal.id,
  languages: crab.talen,
  [HAS_CITY]: true,
});

const DEFAULTS = {
  id: undefined,
  name: undefined,
  names: undefined,
  language: undefined,
  languages: undefined,
  [HAS_CITY]: false,
  [STREETS]: new Streets(),
};

class City {
  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
    if (typeof x === 'string') this.id = +x;
    if (this.id) {
      const streets = this[STREETS];
      streets.city = this;
    }
  }

  async [CITY]() {
    const result = await object(GET_BY_ID, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return this;
  }

  async get() {
    if (!this[HAS_CITY]) await this[CITY]();
    return this;
  }

  get Streets() {
    const streets = this[STREETS];
    return streets.get();
  }
}

module.exports = City;
