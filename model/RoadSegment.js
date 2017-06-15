const { object } = require('../app/lib/crab');
const { ROAD_SEGMENT, HAS_ROAD_SEGMENT } = require('./Symbols');

const ID = 'IdentificatorWegsegment';
const GetById = `GetWegsegmentBy${ID}`;

const CRABMapping = ({ geometrie: { lineString } }) => ({
  polyLine: lineString.map(({ x, y }) => [x, y]),
  [HAS_ROAD_SEGMENT]: true,
});

const DEFAULTS = {
  id: undefined,
  [HAS_ROAD_SEGMENT]: false,
};

class RoadSegment {
  static get(id) {
    return new RoadSegment(id).get();
  }

  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
  }

  async [ROAD_SEGMENT]() {
    const result = await object(GetById, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async get() {
    if (!this[HAS_ROAD_SEGMENT]) await this[ROAD_SEGMENT]();
    return this;
  }
}

module.exports = RoadSegment;
