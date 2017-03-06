const mongoose = require('mongoose');

const Point = require('./Point');

const { Schema } = mongoose;

const LineSchema = new Schema({
  points: [Point.schema],
}, { versionKey: false });

const Line = mongoose.model('Line', LineSchema);

module.exports = Line;
