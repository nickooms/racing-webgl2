const { list } = require('../app/lib/crab');
const Street = require('./Street');
const City = require('./City');
const { SorteerVeld } = require('./Constants');
const { CITY, STREETS, HAS_STREETS, HAS_STREET } = require('./Symbols');

const BY_CITY = 'ListStraatnamenByGemeenteId';

const DEFAULTS = {
  [CITY]: new City.constructor(),
  [HAS_STREETS]: false,
  [HAS_STREET]: false,
};

class Streets extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor() {
    super();
    Object.assign(this, DEFAULTS);
  }

  async get() {
    const city = await this.city;
    if (city.id) await this[STREETS]();
    return this;
  }

  async [STREETS]() {
    if (!this[HAS_STREETS]) {
      const results = await list(BY_CITY, { GemeenteId: this.city.id, SorteerVeld });
      results.forEach(({ id, namen, talen, taal, label }) => {
        const street = new Street.constructor();
        street.id = id;
        street.names = namen;
        street.languages = talen;
        street.language = taal.id;
        street.name = namen[taal.id];
        street.label = label;
        this.push(street);
        return street;
      });
      this[HAS_STREETS] = true;
    }
    return this;
  }

  get city() {
    const city = this[CITY];
    return city;
  }

  set city(value) {
    this[CITY] = value;
  }
}

module.exports = Streets;
