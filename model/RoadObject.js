const { object } = require('../app/lib/crab');
const { ROAD_OBJECT, HAS_ROAD_OBJECT } = require('./Symbols');
const { getFeatureInfo } = require('../WMS');
const BBOX = require('../BBOX');
const { dir } = require('../util');

const ID = 'IdentificatorWegobject';
const GetById = `GetWegobjectBy${ID}`;

const CRABMapping = ({ aard: kind, center, bounds: { min, max } }) => ({
  kind,
  center: [center.x, center.y],
  bounds: [[min.x, min.y], [max.x, max.y]],
  [HAS_ROAD_OBJECT]: true,
});

const DEFAULTS = {
  id: undefined,
  [HAS_ROAD_OBJECT]: false,
};

class RoadObject {
  static get(id) {
    return new RoadObject(id).get();
  }

  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(x)) this.id = x;
  }

  async [ROAD_OBJECT]() {
    const result = await object(GetById, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    const layers = 'GRB_WBN';
    const point = ([x, y]) => ({ x, y });
    const { center } = this;
    const bbox = new BBOX([point(center)]);
    bbox.grow(0.1);
    const options = { layers, width: 2, height: 2, bbox, x: 1, y: 1 };
    const featureInfo = await getFeatureInfo(options);
    // dir(featureInfo);
    const { features: [wbn] } = featureInfo;
    // dir(wbn);
    const id = parseInt(wbn.id.replace(`${layers}.`, ''), 10);
    const type = wbn.properties.LBLTYPE;
    const polygon = wbn.geometry.coordinates[0].map(([x, y]) => [y, x]);
    Object.assign(this, { feature: { id }, type, polygon });
    return result;
  }

  async get() {
    if (!this[HAS_ROAD_OBJECT]) await this[ROAD_OBJECT]();
    return this;
  }
}

module.exports = RoadObject;
