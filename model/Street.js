const { /* list,*/ object } = require('../app/lib/crab');
const HouseNumbers = require('./HouseNumbers');
const Plots = require('./Plots');
// const HouseNumber = require('./HouseNumber');

// const SorteerVeld = 0;

const GetCRAB = Symbol('GetCRAB');
const GetById = 'GetStraatnaamByStraatnaamId';
const ID = 'StraatnaamId';

const CRABMapping = crab => ({
  name: crab.namen[crab.taal.id],
  names: crab.namen,
  language: crab.taal.id,
  languages: crab.talen,
  label: crab.label,
  city: crab.gemeente.id,
});

const DEFAULTS = {
  id: undefined,
  name: undefined,
  names: undefined,
  language: undefined,
  languages: undefined,
  label: undefined,
  city: undefined,
  houseNumbers: undefined,
};

class Street {
  constructor(objectOrId) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(objectOrId)) {
      this.id = objectOrId;
    }
  }

  async [GetCRAB]() {
    const result = await object(GetById, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async get() {
    await this[GetCRAB]();
    return this;
  }

  async getHouseNumbers() {
    this.houseNumbers = await HouseNumbers.byStreet(this.id);
    return this;
  }

  async getPlots() {
    if (this.houseNumbers === undefined) await this.getHouseNumbers();
    this.plots = await Plots.byHouseNumbers(this.houseNumbers);
  }
}

const test = async () => {
  const street = new Street(7338);
  await street.get();
  await street.getPlots();
  // await street.getHouseNumbers();
  // await street.houseNumbers.get();
  console.log(street);
};

// test();

module.exports = Street;
