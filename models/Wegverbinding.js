const mongoose = require('mongoose');
require('mongoose-geojson-schema');
require('../db');

const { Schema } = mongoose;

const WegverbindingSchema = new Schema({
  id: { type: Number, required: true },
  geometry: Schema.Types.LineString,
  fromStraatId: { type: Number },
  toStraatId: { type: Number },
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
  collection: 'wegverbinding',
});

WegverbindingSchema.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

const Wegverbinding = mongoose.model('Wegverbinding', WegverbindingSchema);

module.exports = Wegverbinding;
