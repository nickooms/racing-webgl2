class Points {
  static toDistance(point1, point2) {
    const x = Math.abs(point1[0] - point2[0]);
    const y = Math.abs(point1[1] - point2[1]);
    return Math.sqrt(x * x + y * y);
  }
  static toPointsArray({ x, y }, index) {
    return {
      [`x [Point ${index}]`]: x,
      [`y [Point ${index}]`]: y,
    };
  }
}
