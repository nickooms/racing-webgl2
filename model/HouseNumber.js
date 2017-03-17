const { list, object } = require('../app/lib/crab');

const SorteerVeld = 0;

const GotCRAB = Symbol('GotCRAB');
const GetCRAB = Symbol('GetCRAB');
const GotBuildings = Symbol('GotBuildings');
const GetBuildings = Symbol('GetBuildings');
const GetById = 'GetHuisnummerByHuisnummerId';
const ID = 'HuisnummerId';

const CRABMapping = crab => ({
  number: crab.nummer,
  [GotCRAB]: true,
});

const DEFAULTS = {
  id: undefined,
  [GotCRAB]: false,
  [GotBuildings]: false,
};

class HouseNumber {
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

  async [GetBuildings]() {
    const buildings = await Buildings.byHouseNumbers();
    this.buildings = buildings;
    this[GotCRAB] = true;
    return this;
  }

  async get({ buildings = false } = {}) {
    if (!this[GotCRAB]) await this[GetCRAB]();
    if (buildings && !this[GotBuildings]) await this[GetBuildings]();
    return this;
  }
}

module.exports = HouseNumber;
