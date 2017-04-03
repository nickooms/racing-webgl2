class BBOX {
  constructor({ points = [] }) {
    const xValues = points.map(([x]) => x);
    const yValues = points.map(([, y]) => y);
    this.min = { x: Math.min(...xValues), y: Math.min(...yValues) };
    this.max = { x: Math.max(...xValues), y: Math.max(...yValues) };
  }

  grow({ percent }) {
    if (percent) {
      const scale = Math.max(this.width, this.height) * (percent / 100);
      this.min.x -= scale;
      this.min.y -= scale;
      this.max.x += scale;
      this.max.y += scale;
    }
    return this;
  }

  get left() {
    return this.min.x;
  }

  get top() {
    return this.min.y;
  }

  get width() {
    return this.max.x - this.min.x;
  }

  get height() {
    return this.max.y - this.min.y;
  }
}

export default BBOX;
