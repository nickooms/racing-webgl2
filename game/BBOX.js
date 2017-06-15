export default class BBOX {
  constructor(points) {
    this.min = { x: Infinity, y: Infinity };
    this.max = { x: -Infinity, y: -Infinity };
    this.add(points);
  }

  grow(size = 1) {
    this.min.x = this.min.x - size;
    this.min.y = this.min.y - size;
    this.max.x = this.max.x + size;
    this.max.y = this.max.y + size;
  }

  get center() {
    return {
      x: (this.min.x + this.max.x) / 2,
      y: (this.min.y + this.max.y) / 2,
    };
  }

  get width() {
    return this.max.x - this.min.x;
  }

  get w() {
    return this.width;
  }

  get height() {
    return this.max.y - this.min.y;
  }

  get h() {
    return this.height;
  }

  get left() {
    return this.min.x;
  }

  get top() {
    return this.max.y;
  }

  add(points) {
    points.forEach(({ x, y }) => {
      this.min = { x: Math.min(this.min.x, x), y: Math.min(this.min.y, y) };
      this.max = { x: Math.max(this.max.x, x), y: Math.max(this.max.y, y) };
    });
  }
}
