require('mongoose-geojson-schema');
const mongoose = require('mongoose');

const { list, object } = require('../app/lib/crab');
const Point = require('./Point');

const { Schema } = mongoose;
const SorteerVeld = 0;

const WegsegmentSchema = new Schema({
  id: { type: Number, required: true },
  geometrie: Schema.Types.LineString,
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
  collection: 'wegsegment',
});

WegsegmentSchema.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

const geoJSON = ({ id, geometrie: { lineString } }) => ({
  id,
  geometrie: {
    type: 'LineString',
    coordinates: lineString.map(Point.toArray),
  },
});

WegsegmentSchema.statics = {
  fromFeature: async feature => mongoose.model('Wegsegment')
    .findOneAndUpdate({ id: feature.id }, geoJSON(feature), { upsert: true, new: true }),
  byId: async (id) => {
    const Wegsegment = mongoose.model('Wegsegment');
    const wegsegment = await object('GetWegsegmentByIdentificatorWegsegment', {
      IdentificatorWegsegment: id,
    });
    const result = await Wegsegment.fromFeature(wegsegment);
    return result;
  },
  byStraat: async (straatId) => {
    const Wegsegment = mongoose.model('Wegsegment');
    const wegsegmentenList = await list('ListWegsegmentenByStraatnaamId', {
      StraatnaamId: straatId,
      SorteerVeld,
    });
    const wegsegmenten = await Promise.all(wegsegmentenList.map(async ({ id }) => {
      const wegsegment = await Wegsegment.byId(id);
      return wegsegment;
    }));
    return wegsegmenten;
  },
};

WegsegmentSchema.virtual('line').get(function() {
  return this.geometrie.coordinates.map(([x, y]) => ({ x, y }));
});

const Wegsegment = mongoose.model('Wegsegment', WegsegmentSchema);

module.exports = Wegsegment;
