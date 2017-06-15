const { list } = require('../app/lib/crab');
const RoadObject = require('./RoadObject');
const Street = require('./Street');
const { SorteerVeld } = require('./Constants');
// const BBOX = require('../BBOX');
// const { getFeatureInfo } = require('../WMS');
const { STREET, ROAD_OBJECTS, HAS_ROAD_OBJECTS } = require('./Symbols');
// const { dir } = require('../util');

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
    // const layers = 'GRB_WBN';
    // const point = ([x, y]) => ({ x, y });
    if (street.id) {
      await this[ROAD_OBJECTS]();
      /* const features = await Promise.all(this.map(async (roadObject) => {
        const { center } = roadObject;
        const bbox = new BBOX([point(center)]);
        bbox.grow(0.1);
        const options = { layers, width: 2, height: 2, bbox, x: 1, y: 1 };
        const { features: [feature] } = await getFeatureInfo(options);
        const id = parseInt(feature.id.replace(`${layers}.`, ''), 10);
        const type = feature.properties.LBLTYPE;
        const polygon = feature.geometry.coordinates[0].map(([x, y]) => [y, x]);
        const object = { id, type, polygon };
        // dir(object);
        // this.polygon = features[0].geometry.coordinates[0].map(([x, y]) => [y, x]);
        return Object.assign(roadObject, object);
      }));*/
      // dir(features);
    }
    return this;
  }

  async [ROAD_OBJECTS]() {
    if (!this[HAS_ROAD_OBJECTS]) {
      const result = await list(BY_STREET, { StraatnaamId: this.street.id, SorteerVeld });
      await Promise.all(result.map(async ({ id }) => {
        const roadObject = await RoadObject.get(id);
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
