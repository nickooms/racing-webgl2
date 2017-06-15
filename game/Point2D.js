export default class Point2D {
  static to3D = ([x, z], y) => [x, y, z];

  static toX = ([x]) => x;

  static toY = ([, y]) => y;
}
