const { list } = require('../app/lib/crab');
const RoadSegment = require('./RoadSegment');
const Street = require('./Street');
const { SorteerVeld } = require('./Constants');
const { STREET, ROAD_SEGMENTS, HAS_ROAD_SEGMENTS } = require('./Symbols');

const BY_STREET = 'ListWegsegmentenByStraatnaamId';

const DEFAULTS = {
  [STREET]: new Street.constructor(),
  [HAS_ROAD_SEGMENTS]: false,
};

class RoadSegments extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor() {
    super();
    Object.assign(this, DEFAULTS);
  }

  async get() {
    const street = await this.street;
    if (street.id) await this[ROAD_SEGMENTS]();
    return this;
  }

  async [ROAD_SEGMENTS]() {
    if (!this[HAS_ROAD_SEGMENTS]) {
      const result = await list(BY_STREET, { StraatnaamId: this.street.id, SorteerVeld });
      await Promise.all(result.map(async ({ id }) => {
        const roadSegment = await RoadSegment.get(id);
        // await roadSegment.get();
        this.push(roadSegment);
        return roadSegment;
      }));
      this[HAS_ROAD_SEGMENTS] = true;
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

module.exports = RoadSegments;
