let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WegbaanSchema = new Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  straatId: { type: Number, required: true },
  position: { type: Array, required: true },
  center: { type: Array, required: true },
  normal: { type: Array, required: true },
  texcoord: { type: Array, required: true },
  indices: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false
});

WegbaanSchema.pre('save', next => {
  now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

module.exports = mongoose.model('wegbaan', WegbaanSchema);
