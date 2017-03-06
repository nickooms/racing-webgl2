const mongoose = require('mongoose');

const { Schema } = mongoose;

const PointSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
}, { versionKey: false });

PointSchema.statics.fromArray = ([x, y]) => {
  const Point = mongoose.model('Point');
  return new Point({ x, y });
};

const Point = mongoose.model('Point', PointSchema);

module.exports = Point;
