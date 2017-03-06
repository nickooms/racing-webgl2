const mongoose = require('mongoose');

const { Schema } = mongoose;

const WegknoopTypeSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
  collection: 'wegknooptype',
});

WegknoopTypeSchema.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

module.exports = mongoose.model('WegknoopType', WegknoopTypeSchema);
