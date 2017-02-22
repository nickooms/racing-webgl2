const crayola = require('./resources/crayola');

module.exports = class Random {
  static byte() {
    return parseInt(Math.random() * 256, 10);
  }
  static color() {
    return `rgb${crayola[parseInt(Math.random() * crayola.length, 10)].rgb}`;
  }
};
