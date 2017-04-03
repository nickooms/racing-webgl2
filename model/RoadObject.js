const { object } = require('../app/lib/crab');
const { ROAD_OBJECT, HAS_ROAD_OBJECT } = require('./Symbols');

const ID = 'IdentificatorWegobject';
const GetById = `GetWegobjectBy${ID}`;

const CRABMapping = ({ aard: type, center, bounds: { min, max } }) => ({
  type,
  center: [center.x, center.y],
  bounds: [[min.x, min.y], [max.x, max.y]],
  [HAS_ROAD_OBJECT]: true,
});

const DEFAULTS = {
  id: undefined,
  [HAS_ROAD_OBJECT]: false,
};

class RoadObject {
  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
  }

  async [ROAD_OBJECT]() {
    const result = await object(GetById, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async get() {
    if (!this[HAS_ROAD_OBJECT]) await this[ROAD_OBJECT]();
    return this;
  }
}

module.exports = RoadObject;
