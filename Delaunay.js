const EPSILON = 1.0 / 1048576.0;

function supertriangle(vertices) {
  let xmin = Number.POSITIVE_INFINITY;
  let ymin = Number.POSITIVE_INFINITY;
  let xmax = Number.NEGATIVE_INFINITY;
  let ymax = Number.NEGATIVE_INFINITY;
  let i;
  for (i = vertices.length; i--;) {
    if (vertices[i][0] < xmin) xmin = vertices[i][0];
    if (vertices[i][0] > xmax) xmax = vertices[i][0];
    if (vertices[i][1] < ymin) ymin = vertices[i][1];
    if (vertices[i][1] > ymax) ymax = vertices[i][1];
  }
  const dx = xmax - xmin;
  const dy = ymax - ymin;
  const dmax = Math.max(dx, dy);
  const xmid = xmin + (dx * 0.5);
  const ymid = ymin + (dy * 0.5);
  return [
    [xmid - (20 * dmax), ymid - dmax],
    [xmid, ymid + (20 * dmax)],
    [xmid + (20 * dmax), ymid - dmax],
  ];
}

function circumcircle(vertices, i, j, k) {
  const x1 = vertices[i][0];
  const y1 = vertices[i][1];
  const x2 = vertices[j][0];
  const y2 = vertices[j][1];
  const x3 = vertices[k][0];
  const y3 = vertices[k][1];
  const fabsy1y2 = Math.abs(y1 - y2);
  const fabsy2y3 = Math.abs(y2 - y3);
  let xc;
  let yc;
  let m1;
  let m2;
  let mx1;
  let mx2;
  let my1;
  let my2;
  if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON) throw new Error('Eek! Coincident points!');
  if (fabsy1y2 < EPSILON) {
    m2 = -((x3 - x2) / (y3 - y2));
    mx2 = (x2 + x3) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (x2 + x1) / 2.0;
    yc = (m2 * (xc - mx2)) + my2;
  } else if (fabsy2y3 < EPSILON) {
    m1 = -((x2 - x1) / (y2 - y1));
    mx1 = (x1 + x2) / 2.0;
    my1 = (y1 + y2) / 2.0;
    xc = (x3 + x2) / 2.0;
    yc = (m1 * (xc - mx1)) + my1;
  } else {
    m1 = -((x2 - x1) / (y2 - y1));
    m2 = -((x3 - x2) / (y3 - y2));
    mx1 = (x1 + x2) / 2.0;
    mx2 = (x2 + x3) / 2.0;
    my1 = (y1 + y2) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = ((m1 * mx1) - ((m2 * mx2) + (my2 - my1))) / (m1 - m2);
    yc = (fabsy1y2 > fabsy2y3) ? (m1 * (xc - mx1)) + my1 : (m2 * (xc - mx2)) + my2;
  }
  const dx = x2 - xc;
  const dy = y2 - yc;
  return { i, j, k, x: xc, y: yc, r: (dx * dx) + (dy * dy) };
}

function dedup(edges) {
  let i;
  let j;
  let a;
  let b;
  let m;
  let n;
  for (j = edges.length; j;) {
    b = edges[--j];
    a = edges[--j];
    for (i = j; i;) {
      n = edges[--i];
      m = edges[--i];
      if ((a === m && b === n) || (a === n && b === m)) {
        edges.splice(j, 2);
        edges.splice(i, 2);
        break;
      }
    }
  }
}

const Delaunay = {
  triangulate(vertices, key) {
    const n = vertices.length;
    let i;
    let j;
    let dx;
    let dy;
    let a;
    let b;
    let c;
    if (n < 3) return [];
    const verts = vertices.slice(0);
    if (key) {
      for (i = n; i--;) {
        verts[i] = verts[i][key];
      }
    }
    const indices = new Array(n);
    for (i = n; i--;) indices[i] = i;
    indices.sort((i1, i2) => verts[i2][0] - verts[i1][0]);
    const st = supertriangle(verts);
    verts.push(st[0], st[1], st[2]);
    const open = [circumcircle(verts, n + 0, n + 1, n + 2)];
    const closed = [];
    const edges = [];
    for (i = indices.length; i--; edges.length = 0) {
      c = indices[i];
      for (j = open.length; j--;) {
        dx = verts[c][0] - open[j].x;
        if (dx > 0.0 && dx * dx > open[j].r) {
          closed.push(open[j]);
          open.splice(j, 1);
          continue;
        }
        dy = vertices[c][1] - open[j].y;
        if (((dx * dx) + (dy * dy)) - open[j].r > EPSILON) continue;
        edges.push(open[j].i, open[j].j, open[j].j, open[j].k, open[j].k, open[j].i);
        open.splice(j, 1);
      }
      dedup(edges);
      for (j = edges.length; j;) {
        b = edges[--j];
        a = edges[--j];
        open.push(circumcircle(verts, a, b, c));
      }
    }
    for (i = open.length; i--;) closed.push(open[i]);
    open.length = 0;
    for (i = closed.length; i--;) {
      if (closed[i].i < n && closed[i].j < n && closed[i].k < n) {
        open.push(closed[i].i, closed[i].j, closed[i].k);
      }
    }
    return open;
  },
  contains(tri, p) {
    if ((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
       (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
       (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
       (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1])) {
      return null;
    }
    const a = tri[1][0] - tri[0][0];
    const b = tri[2][0] - tri[0][0];
    const c = tri[1][1] - tri[0][1];
    const d = tri[2][1] - tri[0][1];
    const i = (a * d) - (b * c);
    if (i === 0.0) return null;
    const u = ((d * (p[0] - tri[0][0])) - (b * (p[1] - tri[0][1]))) / i;
    const v = ((a * (p[1] - tri[0][1])) - (c * (p[0] - tri[0][0]))) / i;
    if (u < 0.0 || v < 0.0 || (u + v) > 1.0) return null;
    return [u, v];
  },
};

module.exports = Delaunay;
