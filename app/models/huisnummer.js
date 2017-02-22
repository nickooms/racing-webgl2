let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let HuisnummerSchema = new Schema(
  {
    nummer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
HuisnummerSchema.pre('save', next => {
  now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('huisnummer', HuisnummerSchema);
