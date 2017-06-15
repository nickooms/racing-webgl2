const { object } = require('../app/lib/crab');
const { BUILDING, HAS_BUILDING } = require('./Symbols');

const ID = 'IdentificatorGebouw';
const GetById = `GetGebouwBy${ID}`;

const CRABMapping = ({ aard: type, status, geometrie }) => ({
  type,
  status,
  polygon: geometrie.polygon.map(({ x, y }) => [y, x]),
  [HAS_BUILDING]: true,
});

const DEFAULTS = {
  id: undefined,
  [HAS_BUILDING]: false,
};

class Building {
  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
    if (typeof x === 'string') this.id = +x;
  }

  async [BUILDING]() {
    const result = await object(GetById, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async get() {
    if (!this[HAS_BUILDING]) await this[BUILDING]();
    return this;
  }
}

module.exports = Building;
