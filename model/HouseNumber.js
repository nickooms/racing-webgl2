const { list, object } = require('../app/lib/crab');
const Buildings = require('./Buildings');
const Plots = require('./Plots');

const SorteerVeld = 0;

const { ID, BUILDINGS, HAS_BUILDINGS, PLOTS, HAS_PLOTS, LIST_PLOTS } = require('./Symbols');

const GotCRAB = Symbol('GotCRAB');
const GetCRAB = Symbol('GetCRAB');
const GotPlots = Symbol('GotPlots');
const GetPlots = Symbol('GetPlots');
const GotBuildings = Symbol('GotBuildings');
const GetBuildings = Symbol('GetBuildings');
const Id = 'HuisnummerId';
const GetById = `GetHuisnummerBy${Id}`;

const CRABMapping = crab => ({
  number: crab.nummer,
  [GotCRAB]: true,
});

const DEFAULTS = {
  id: undefined,
  [GotCRAB]: false,
  [GotBuildings]: false,
  [GotPlots]: false,
  [HAS_BUILDINGS]: false,
  [HAS_PLOTS]: false,
};

class HouseNumber {
  static get [ID]() { return 'HuisnummerId'; }

  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
    if (typeof x === 'string') this.id = +x;
    if (this.id) {
      const buildings = this[BUILDINGS];
      buildings.houseNumber = this;
      const plots = this[PLOTS];
      plots.houseNumber = this;
    }
  }

  async [GetCRAB]() {
    const result = await object(GetById, { [Id]: this.id });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async [BUILDINGS]() {
    const buildings = await list(`ListGebouwenBy${Id}`, { [Id]: this.id, SorteerVeld });
    return buildings;
  }

  async [PLOTS]() {
    const plots = await list(`ListPercelenBy${Id}`, { [Id]: this.id, SorteerVeld });
    return plots;
  }

  get Buildings() {
    const buildings = this[BUILDINGS]();
    return buildings;
  }

  get Plots() {
    if (!this[HAS_PLOTS]) this[LIST_PLOTS] = this[PLOTS]();
    return this[LIST_PLOTS];
  }

  async [GetBuildings]() {
    const buildings = await Buildings.byHouseNumbers();
    this.buildings = buildings;
    return this;
  }

  async [GetPlots]() {
    const plots = await Plots.byHouseNumbers();
    this.plots = plots;
    return this;
  }

  async get() {
    if (!this[GotCRAB]) await this[GetCRAB]();
    return this;
  }
}

module.exports = HouseNumber;
