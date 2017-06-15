const { object } = require('../app/lib/crab');
const { PLOT, HAS_PLOT } = require('./Symbols');
const { getFeatureInfo } = require('../WMS');
const BBOX = require('../BBOX');

const ID = 'IdentificatorPerceel';
const GetById = `GetPerceelBy${ID}`;

const CRABMapping = ({ center }) => ({
  center,
  [HAS_PLOT]: true,
});

const DEFAULTS = {
  id: undefined,
  [HAS_PLOT]: false,
};

class Plot {
  constructor(x) {
    Object.assign(this, DEFAULTS);
    if (typeof x === 'string') this.id = x;
  }

  async [PLOT]() {
    const result = await object(GetById, { [ID]: this.id.replace('_', '/') });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async get() {
    if (!this[HAS_PLOT]) {
      await this[PLOT]();
      const bbox = new BBOX([this.center]);
      bbox.grow(0.1);
      const { features } = await getFeatureInfo({
        layers: 'GRB_ADP',
        width: 2,
        height: 2,
        bbox,
        x: 1,
        y: 1,
      });
      this.polygon = features[0].geometry.coordinates[0].map(([x, y]) => [y, x]);
    }
    return this;
  }
}

module.exports = Plot;
