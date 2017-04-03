const { list } = require('../app/lib/crab');
const RoadObject = require('./RoadObject');
const Street = require('./Street');
const { SorteerVeld } = require('./Constants');
const { STREET, ROAD_OBJECTS, HAS_ROAD_OBJECTS } = require('./Symbols');

const BY_STREET = 'ListWegobjectenByStraatnaamId';

const DEFAULTS = {
  [STREET]: new Street.constructor(),
  [HAS_ROAD_OBJECTS]: false,
};

class RoadObjects extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor() {
    super();
    Object.assign(this, DEFAULTS);
  }

  async get() {
    const street = await this.street;
    if (street.id) await this[ROAD_OBJECTS]();
    return this;
  }

  async [ROAD_OBJECTS]() {
    if (!this[HAS_ROAD_OBJECTS]) {
      const result = await list(BY_STREET, { StraatnaamId: this.street.id, SorteerVeld });
      await Promise.all(result.map(async ({ id }) => {
        const roadObject = new RoadObject(id);
        await roadObject.get();
        this.push(roadObject);
        return roadObject;
      }));
      this[HAS_ROAD_OBJECTS] = true;
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

module.exports = RoadObjects;
