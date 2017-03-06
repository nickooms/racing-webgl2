const mongoose = require('mongoose');

const { Schema } = mongoose;

const WegknoopSchema = new Schema({
  id: { type: Number, required: true },
  type: { type: Schema.Types.ObjectId, ref: 'WegknoopType' },
  straatId: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
  collection: 'wegknoop',
});

WegknoopSchema.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

module.exports = mongoose.model('Wegknoop', WegknoopSchema);
