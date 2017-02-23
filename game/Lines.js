class Lines {
  static toBufferInfoArrays(lines) {
    return {
      position: flatten(lines.map(([from, to]) => [
        Point2D.to3D(from, BOTTOM),
        Point2D.to3D(to, BOTTOM),
        Point2D.to3D(to, TOP),
        Point2D.to3D(from, TOP)
      ])),
      normal: flatten(lines.map(([from, to]) => {
        const p0 = v3.create(...Point2D.to3D(from, BOTTOM));
        const p1 = v3.create(...Point2D.to3D(to, BOTTOM));
        const p2 = v3.create(...Point2D.to3D(to, TOP));
        const p3 = v3.create(...Point2D.to3D(from, TOP));
        const n0 = v3.normalize(v3.cross(v3.subtract(p1, p0), v3.subtract(p2, p0)));
        const n1 = v3.normalize(v3.cross(v3.subtract(p0, p1), v3.subtract(p2, p1)));
        const n2 = v3.normalize(v3.cross(v3.subtract(p0, p2), v3.subtract(p1, p2)));
        const n3 = v3.normalize(v3.cross(v3.subtract(p0, p3), v3.subtract(p2, p3)));
        return [
          [n0[0], n0[1], n0[2]].map(Float.toFixed3),
          [n1[0], n1[1], n1[2]].map(Float.toFixed3).map(Float.toNegative),
          [n2[0], n2[1], n2[2]].map(Float.toFixed3),
          [n3[0], n3[1], n3[2]].map(Float.toFixed3),
        ];
      })),
      texcoord: flatten(lines.map(line => TEXCOORD)),
      indices: flatten(lines.map((line, index) => [INDICES.map(x => x + index * 4)]))
    };
  }
  static toDistances(lines) {
    return lines.map(Line.toDistance);
  }
}
