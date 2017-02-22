const Canvas = require('canvas');

const ImageData = Symbol('ImageData');

module.exports = class extends Canvas {
  constructor(width, height, bbox, img) {
    super(width, height);
    this.bbox = bbox;
    this.ctx = this.getContext('2d');
    if (img) this.drawImage(img);
  }

  pixel({ x, y }) {
    const { bbox: { left, top, w, h }, width, height } = this;
    return {
      x: parseInt((x - left) * (width / w), 10),
      y: parseInt((top - y) * (height / h), 10),
    };
  }

  coordinate({ x, y }) {
    const { bbox: { left, top, w, h }, width, height } = this;
    return {
      x: left + (x * (w / width)),
      y: top - (y * (h / height)),
    };
  }

  get imagedata() {
    if (!this[ImageData]) {
      const { ctx, width, height } = this;
      this[ImageData] = ctx.getImageData(0, 0, width, height);
    }
    return this[ImageData];
  }

  get data() {
    return new Uint32Array(this.imagedata.data.buffer);
  }

  set image(img) {
    this.ctx.putImageData(img, 0, 0);
  }

  drawImage(img) {
    const { ctx, width, height } = this;
    ctx.drawImage(img, 0, 0, width, height);
  }

  color({ x, y }) {
    const { imagedata, width } = this;
    return new Uint32Array(imagedata.data.buffer)[(width * y) + x];
  }

  points(pixels) {
    const { ctx } = this;
    pixels.forEach(({ x, y }) => ctx.fillRect(x - 5, y - 5, 10, 10));
    return this;
  }

  polygon(corners) {
    const { ctx } = this;
    ctx.beginPath();
    Object.assign(ctx, {
      lineWidth: 5,
      strokeStyle: 'rgba(0, 0, 0, 0.5)'
    });
    corners.forEach(({ x, y }, i) => ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y));
    ctx.stroke();
    return this;
  }
};
