class Point2D {
  static to3D([x, z], y) {
    return [x, y, z];
  }
  static toX(point) {
    return point[0];
  }
  static toY(point) {
    return point[1];
  }
}
