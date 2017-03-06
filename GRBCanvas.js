const floodfill = require('./floodfill');
const GeoCanvas = require('./GeoCanvas');
const BBOX = require('./BBOX');
const { getFeatureInfo } = require('./WMS');

const WHITE = 0xffffff;
const RED = 0x0000ff;
const GREEN = 0x00ff00;
const LIGHT_GRAY = 0xcccccc;
const DARK_GRAY = 0xb7b7b7;

const Red = { fill: 0xff0000ff, colors: [DARK_GRAY, RED] };
const Green = { fill: 0xff00ff00, colors: [LIGHT_GRAY, GREEN] };

class GRBCanvas extends GeoCanvas {
  static fillColor(color, matchColors) {
    const rgb = color & WHITE;
    const filtered = matchColors.filter(({ colors }) => colors.indexOf(rgb) !== -1);
    return filtered && filtered.length && filtered[0].fill;
  }

  flood(coordinate, fillColors = [Red, Green]) {
    const pixel = this.pixel(coordinate);
    const color = this.color(pixel);
    const fillColor = GRBCanvas.fillColor(color, fillColors);
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

  featureInfo(layers, pixel) {
    return getFeatureInfo({
      width: this.width,
      height: this.height,
      layers,
      bbox: this.bbox,
      x: pixel.x,
      y: pixel.y,
    });
  }
}

Object.assign(GRBCanvas, { WHITE, RED, GREEN, LIGHT_GRAY, DARK_GRAY, Red, Green });

module.exports = GRBCanvas;
