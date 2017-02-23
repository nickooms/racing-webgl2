class Polygon {
  static toLines(points) {
    return points.reduce((result, point, index, array) => {
      if (index + 1 === array.length) return result;
      result.push([point, array[index + 1]]);
      return result;
    }, []);
  }
  static toBBOX(points) {
    const x = points.map(Point2D.toX);
    const y = points.map(Point2D.toY);
    return ([
      [Math.min(...x), Math.min(...y)],
      [Math.max(...x), Math.max(...y)],
    ]);
  }
  static toMiddle(points) {
    return ([
      points.map(Point2D.toX).slice(1).reduce(Float.add) / (points.length - 1),
      points.map(Point2D.toY).slice(1).reduce(Float.add) / (points.length - 1)
    ]);
  }
  static toCentered(points) {
    const middle = Polygon.toMiddle(points);
    return points
      .map(([x, y]) => [x - Point2D.toX(middle), y - Point2D.toY(middle)])
      .map(([x, y]) => [x * SCALE, y * SCALE]);
  }
  static toCenteredLines(polygon) {
    const centered = Polygon.toCentered(polygon).map(point => point.map(Float.toFixed3));
    return Polygon.toLines(centered);
  }
}
