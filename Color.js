const style = require('ansi-styles');
// const chalk = require('chalk');

class Color {
  constructor(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  hex() {
    return Color.hex(this.number);
  }

  get number() {
    const { red, blue, green, alpha } = this;
    return (alpha << 24) | (blue << 16) | (green << 8) | red;
  }

  static hex(c) {
    const { color, bgColor } = style;
    // const bgBlack = bgColor.ansi.rgb(0, 0, 0);
    const hasAlpha = c > 0xffffff;
    const v = hasAlpha ? c : c | 0xff000000;
    const r = v & 0xff;
    const g = (v >> 8) & 0xff;
    const b = (v >> 16) & 0xff;
    // const rgb = color.ansi.rgb(r, g, b);
    const rgbBg = bgColor.ansi.rgb(r, g, b);
    const inverse = color.ansi.rgb(0xff - r, 0xff - g, 0xff - b);
    const s = c.toString(16);
    const hex = `#${'0'.repeat((hasAlpha ? 8 : 6) - s.length)}${s}`;
    return `${rgbBg}${inverse}  ${hex}  ${color.close}${bgColor.close}`;
  }
}

module.exports = Color;
