class FloatArray {
  static toPoint([x, y]) {
    return { x, y };
  }
  static toPoints([...points]) {
    return points
      .map(FloatArray.toPoint)
      .map(Points.toPointsArray)
      .reduce(ObjectsArray.toObject, {});
  }
  static toBBOX([min, max]) {
    return {
      min: FloatArray.toPoint(min),
      max: FloatArray.toPoint(max),
    };
  }
  static toPoints([...points]) {
    return points
      .map(FloatArray.toPoint)
      .map(Points.toPointsArray)
      .reduce(ObjectsArray.toObject, {})
  }
}
