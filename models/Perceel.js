const mongoose = require('mongoose');

const { Schema } = mongoose;

const PerceelSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  straatId: { type: Number, required: true },
  position: { type: Array, required: true },
  center: { type: Array, required: true },
  normal: { type: Array, required: true },
  texcoord: { type: Array, required: true },
  indices: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
  collection: 'perceel',
});

PerceelSchema.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

module.exports = mongoose.model('Perceel', PerceelSchema);
