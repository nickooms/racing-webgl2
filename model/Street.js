const { object } = require('../app/lib/crab');
const HouseNumbers = require('./HouseNumbers');
const RoadObjects = require('./RoadObjects');
const RoadSegments = require('./RoadSegments');
const City = require('./City');
const {
  STREET,
  CITY, CITY_ID, HAS_CITY,
  HAS_STREET,
  HOUSE_NUMBERS,
  ROAD_OBJECTS, ROAD_OBJECT,
  ROAD_SEGMENTS, ROAD_SEGMENT
} = require('./Symbols');

const ID = 'StraatnaamId';
const GET_BY_ID = `GetStraatnaamBy${ID}`;

const CRABMapping = crab => ({
  name: crab.namen[crab.taal.id],
  names: crab.namen,
  language: crab.taal.id,
  languages: crab.talen,
  label: crab.label,
  [CITY_ID]: crab.gemeente.id,
  [HAS_STREET]: true,
});

const DEFAULTS = {
  id: undefined,
  name: undefined,
  names: undefined,
  language: undefined,
  languages: undefined,
  label: undefined,
  [HAS_CITY]: false,
  [HAS_STREET]: false,
  [CITY_ID]: undefined,
  [HOUSE_NUMBERS]: new HouseNumbers(),
  [ROAD_OBJECTS]: new RoadObjects(),
  [ROAD_SEGMENTS]: new RoadSegments(),
};

class Street {
  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
    if (typeof x === 'string') this.id = +x;
    if (this.id) {
      const houseNumbers = this[HOUSE_NUMBERS];
      houseNumbers.street = this;
      const roadObjects = this[ROAD_OBJECTS];
      roadObjects.street = this;
      const roadSegments = this[ROAD_SEGMENTS];
      roadSegments.street = this;
    }
  }

  async [STREET]() {
    const result = await object(GET_BY_ID, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return this;
  }

  async get() {
    if (!this[HAS_STREET]) await this[STREET]();
    return this;
  }

  get HouseNumbers() {
    const houseNumbers = this[HOUSE_NUMBERS];
    return houseNumbers.get();
  }

  get RoadObjects() {
    const roadObjects = this[ROAD_OBJECTS];
    return roadObjects.get();
  }

  get RoadSegments() {
    const roadSegments = this[ROAD_SEGMENTS];
    return roadSegments.get();
  }

  async [CITY]() {
    if (!this[HAS_STREET]) await this[STREET].get();
    if (!this[HAS_CITY]) {
      this[CITY] = new City(this[CITY_ID]);
      await this[CITY]();
    }
  }
  get City() {
    if (!this[HAS_CITY]) this[CITY] = new City(this[CITY_ID]);
    const city = this[CITY];
    return city.get();
  }
}

module.exports = Street;
