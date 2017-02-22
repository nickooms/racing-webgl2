const floodfill = require('./floodfill');
const GeoCanvas = require('./GeoCanvas');
const BBOX = require('./BBOX');

const WHITE = 0xffffff;
const RED = 0x0000ff;
const GREEN = 0x00ff00;
const LIGHT_GRAY = 0xcccccc;
const DARK_GRAY = 0xb7b7b7;

class GRBCanvas extends GeoCanvas {
  static fillColor(color) {
    switch (color & WHITE) {
      case DARK_GRAY:
      case RED:
        return 0xff0000ff;
      case LIGHT_GRAY:
      case GREEN:
        return 0xff00ff00;
      default:
        return null;
    }
  }

  flood(coordinate) {
    const pixel = this.pixel(coordinate);
    const color = this.color(pixel);
    const fillColor = GRBCanvas.fillColor(color);
    if (fillColor) {
      const fill = floodfill(this, pixel, fillColor);
      if (fill) {
        const { fillCanvas, image, x, y, w, h } = fill;
        fillCanvas.image = image;
        const min = fillCanvas.coordinate({ x, y: y + h });
        const max = fillCanvas.coordinate({ x: x + w, y });
        const bboxDetail = new BBOX([min, max]);
        return { fillCanvas, bboxDetail, fillColor };
      }
    }
    return null;
  }
}

module.exports = GRBCanvas;
