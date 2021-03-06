const { list } = require('../app/lib/crab');
const HouseNumber = require('./HouseNumber');
const Street = require('./Street');
const { SorteerVeld } = require('./Constants');
const { STREET, HOUSE_NUMBERS, HAS_HOUSE_NUMBERS } = require('./Symbols');

const BY_STREET = 'ListHuisnummersByStraatnaamId';

const DEFAULTS = {
  [STREET]: new Street.constructor(),
  [HAS_HOUSE_NUMBERS]: false,
};

class HouseNumbers extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor() {
    super();
    Object.assign(this, DEFAULTS);
  }

  async get() {
    const street = await this.street;
    if (street.id) await this[HOUSE_NUMBERS]();
    return this;
  }

  async [HOUSE_NUMBERS]() {
    if (!this[HAS_HOUSE_NUMBERS]) {
      const result = await list(BY_STREET, { StraatnaamId: this.street.id, SorteerVeld });
      await Promise.all(result.map(async ({ id }) => {
        const houseNumber = new HouseNumber(id);
        await houseNumber.get();
        this.push(houseNumber);
        return houseNumber;
      }));
      this[HAS_HOUSE_NUMBERS] = true;
    }
  }

  get street() {
    const street = this[STREET];
    if (street.id) street.get();
    return street;
  }

  set street(value) {
    this[STREET] = value;
  }
}

module.exports = HouseNumbers;
