import attributes from './attributes.js';
import utils from './utils.js';
import m4 from './m4.js';
import v3 from './v3.js';

var getArray = attributes.getArray_;  // eslint-disable-line
var getNumComponents = attributes.getNumComponents_;  // eslint-disable-line

function augmentTypedArray(typedArray, numComponents) {
  let cursor = 0;
  typedArray.push = () => {
    for (var ii = 0; ii < arguments.length; ++ii) {
      var value = arguments[ii];
      if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
        for (var jj = 0; jj < value.length; ++jj) {
          typedArray[cursor++] = value[jj];
        }
      } else {
        typedArray[cursor++] = value;
      }
    }
  };
  typedArray.reset = function(opt_index) {
    cursor = opt_index || 0;
  };
  typedArray.numComponents = numComponents;
  Object.defineProperty(typedArray, 'numElements', {
    get: function() {
      return this.length / this.numComponents | 0;
    },
  });
  return typedArray;
}

function createAugmentedTypedArray(numComponents, numElements, opt_type) {
  var Type = opt_type || Float32Array;
  return augmentTypedArray(new Type(numComponents * numElements), numComponents);
}

function allButIndices(name) {
  return name !== "indices";
}

function deindexVertices(vertices) {
  var indices = vertices.indices;
  var newVertices = {};
  var numElements = indices.length;

  function expandToUnindexed(channel) {
    var srcBuffer = vertices[channel];
    var numComponents = srcBuffer.numComponents;
    var dstBuffer = createAugmentedTypedArray(numComponents, numElements, srcBuffer.constructor);
    for (var ii = 0; ii < numElements; ++ii) {
      var ndx = indices[ii];
      var offset = ndx * numComponents;
      for (var jj = 0; jj < numComponents; ++jj) {
        dstBuffer.push(srcBuffer[offset + jj]);
      }
    }
    newVertices[channel] = dstBuffer;
  }

  Object.keys(vertices).filter(allButIndices).forEach(expandToUnindexed);

  return newVertices;
}

function flattenNormals(vertices) {
  if (vertices.indices) {
    throw "can't flatten normals of indexed vertices. deindex them first";
  }

  var normals = vertices.normal;
  var numNormals = normals.length;
  for (var ii = 0; ii < numNormals; ii += 9) {
    // pull out the 3 normals for this triangle
    var nax = normals[ii + 0];
    var nay = normals[ii + 1];
    var naz = normals[ii + 2];

    var nbx = normals[ii + 3];
    var nby = normals[ii + 4];
    var nbz = normals[ii + 5];

    var ncx = normals[ii + 6];
    var ncy = normals[ii + 7];
    var ncz = normals[ii + 8];

    // add them
    var nx = nax + nbx + ncx;
    var ny = nay + nby + ncy;
    var nz = naz + nbz + ncz;

    // normalize them
    var length = Math.sqrt(nx * nx + ny * ny + nz * nz);

    nx /= length;
    ny /= length;
    nz /= length;

    // copy them back in
    normals[ii + 0] = nx;
    normals[ii + 1] = ny;
    normals[ii + 2] = nz;

    normals[ii + 3] = nx;
    normals[ii + 4] = ny;
    normals[ii + 5] = nz;

    normals[ii + 6] = nx;
    normals[ii + 7] = ny;
    normals[ii + 8] = nz;
  }

  return vertices;
}

function applyFuncToV3Array(array, matrix, fn) {
  var len = array.length;
  var tmp = new Float32Array(3);
  for (var ii = 0; ii < len; ii += 3) {
    fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
    array[ii    ] = tmp[0];
    array[ii + 1] = tmp[1];
    array[ii + 2] = tmp[2];
  }
}

function transformNormal(mi, v, dst) {
  dst = dst || v3.create();
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
  dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
  dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

  return dst;
}

function reorientDirections(array, matrix) {
  applyFuncToV3Array(array, matrix, m4.transformDirection);
  return array;
}

function reorientNormals(array, matrix) {
  applyFuncToV3Array(array, m4.inverse(matrix), transformNormal);
  return array;
}

function reorientPositions(array, matrix) {
  applyFuncToV3Array(array, matrix, m4.transformPoint);
  return array;
}

function reorientVertices(arrays, matrix) {
  Object.keys(arrays).forEach((name) => {
    const array = arrays[name];
    if (name.indexOf('pos') >= 0) {
      reorientPositions(array, matrix);
    } else if (name.indexOf('tan') >= 0 || name.indexOf('binorm') >= 0) {
      reorientDirections(array, matrix);
    } else if (name.indexOf('norm') >= 0) {
      reorientNormals(array, matrix);
    }
  });
  return arrays;
}

function createXYQuadVertices(size, xOffset, yOffset) {
  size = size || 2;
  xOffset = xOffset || 0;
  yOffset = yOffset || 0;
  size *= 0.5;
  return {
    position: {
      numComponents: 2,
      data: [
        xOffset + -1 * size, yOffset + -1 * size,
        xOffset +  1 * size, yOffset + -1 * size,
        xOffset + -1 * size, yOffset +  1 * size,
        xOffset +  1 * size, yOffset +  1 * size,
      ],
    },
    normal: [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ],
    texcoord: [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ],
    indices: [ 0, 1, 2, 2, 1, 3 ],
  };
}

function createPlaneVertices(
    width,
    depth,
    subdivisionsWidth,
    subdivisionsDepth,
    matrix) {
  width = width || 1;
  depth = depth || 1;
  subdivisionsWidth = subdivisionsWidth || 1;
  subdivisionsDepth = subdivisionsDepth || 1;
  matrix = matrix || m4.identity();
  var numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
  var positions = createAugmentedTypedArray(3, numVertices);
  var normals = createAugmentedTypedArray(3, numVertices);
  var texcoords = createAugmentedTypedArray(2, numVertices);
  for (var z = 0; z <= subdivisionsDepth; z++) {
    for (var x = 0; x <= subdivisionsWidth; x++) {
      var u = x / subdivisionsWidth;
      var v = z / subdivisionsDepth;
      positions.push(
          width * u - width * 0.5,
          0,
          depth * v - depth * 0.5);
      normals.push(0, 1, 0);
      texcoords.push(u, v);
    }
  }
  var numVertsAcross = subdivisionsWidth + 1;
  var indices = createAugmentedTypedArray(
      3, subdivisionsWidth * subdivisionsDepth * 2, Uint16Array);
  for (var z = 0; z < subdivisionsDepth; z++) {  // eslint-disable-line
    for (var x = 0; x < subdivisionsWidth; x++) {  // eslint-disable-line
      indices.push(
          (z + 0) * numVertsAcross + x,
          (z + 1) * numVertsAcross + x,
          (z + 0) * numVertsAcross + x + 1);
      indices.push(
          (z + 1) * numVertsAcross + x,
          (z + 1) * numVertsAcross + x + 1,
          (z + 0) * numVertsAcross + x + 1);
    }
  }
  var arrays = reorientVertices({
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices,
  }, matrix);
  return arrays;
}

function createSphereVertices(
    radius,
    subdivisionsAxis,
    subdivisionsHeight,
    opt_startLatitudeInRadians,
    opt_endLatitudeInRadians,
    opt_startLongitudeInRadians,
    opt_endLongitudeInRadians) {
  if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
    throw Error('subdivisionAxis and subdivisionHeight must be > 0');
  }
  opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
  opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
  opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
  opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

  var latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
  var longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

  var numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
  var positions = createAugmentedTypedArray(3, numVertices);
  var normals   = createAugmentedTypedArray(3, numVertices);
  var texcoords = createAugmentedTypedArray(2 , numVertices);

  for (var y = 0; y <= subdivisionsHeight; y++) {
    for (var x = 0; x <= subdivisionsAxis; x++) {
      var u = x / subdivisionsAxis;
      var v = y / subdivisionsHeight;
      var theta = longRange * u;
      var phi = latRange * v;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var ux = cosTheta * sinPhi;
      var uy = cosPhi;
      var uz = sinTheta * sinPhi;
      positions.push(radius * ux, radius * uy, radius * uz);
      normals.push(ux, uy, uz);
      texcoords.push(1 - u, v);
    }
  }

  var numVertsAround = subdivisionsAxis + 1;
  var indices = createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
  for (var x = 0; x < subdivisionsAxis; x++) {  // eslint-disable-line
    for (var y = 0; y < subdivisionsHeight; y++) {  // eslint-disable-line
      indices.push(
          (y + 0) * numVertsAround + x,
          (y + 0) * numVertsAround + x + 1,
          (y + 1) * numVertsAround + x);
      indices.push(
          (y + 1) * numVertsAround + x,
          (y + 0) * numVertsAround + x + 1,
          (y + 1) * numVertsAround + x + 1);
    }
  }
  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices,
  };
}

var CUBE_FACE_INDICES = [
  [3, 7, 5, 1],  // right
  [6, 2, 0, 4],  // left
  [6, 7, 3, 2],  // ??
  [0, 1, 5, 4],  // ??
  [7, 6, 4, 5],  // front
  [2, 3, 1, 0],  // back
];

function createCubeVertices(size) {
  size = size || 1;
  var k = size / 2;

  var cornerVertices = [
    [-k, -k, -k],
    [+k, -k, -k],
    [-k, +k, -k],
    [+k, +k, -k],
    [-k, -k, +k],
    [+k, -k, +k],
    [-k, +k, +k],
    [+k, +k, +k],
  ];

  var faceNormals = [
    [+1, +0, +0],
    [-1, +0, +0],
    [+0, +1, +0],
    [+0, -1, +0],
    [+0, +0, +1],
    [+0, +0, -1],
  ];

  var uvCoords = [
    [1, 0],
    [0, 0],
    [0, 1],
    [1, 1],
  ];

  var numVertices = 6 * 4;
  var positions = createAugmentedTypedArray(3, numVertices);
  var normals   = createAugmentedTypedArray(3, numVertices);
  var texcoords = createAugmentedTypedArray(2 , numVertices);
  var indices   = createAugmentedTypedArray(3, 6 * 2, Uint16Array);

  for (var f = 0; f < 6; ++f) {
    var faceIndices = CUBE_FACE_INDICES[f];
    for (var v = 0; v < 4; ++v) {
      var position = cornerVertices[faceIndices[v]];
      var normal = faceNormals[f];
      var uv = uvCoords[v];
      positions.push(position);
      normals.push(normal);
      texcoords.push(uv);
    }
    var offset = 4 * f;
    indices.push(offset + 0, offset + 1, offset + 2);
    indices.push(offset + 0, offset + 2, offset + 3);
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices,
  };
}

function createTruncatedConeVertices(
    bottomRadius,
    topRadius,
    height,
    radialSubdivisions,
    verticalSubdivisions,
    opt_topCap,
    opt_bottomCap) {
  if (radialSubdivisions < 3) {
    throw Error('radialSubdivisions must be 3 or greater');
  }

  if (verticalSubdivisions < 1) {
    throw Error('verticalSubdivisions must be 1 or greater');
  }

  var topCap = (opt_topCap === undefined) ? true : opt_topCap;
  var bottomCap = (opt_bottomCap === undefined) ? true : opt_bottomCap;

  var extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

  var numVertices = (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
  var positions = createAugmentedTypedArray(3, numVertices);
  var normals   = createAugmentedTypedArray(3, numVertices);
  var texcoords = createAugmentedTypedArray(2, numVertices);
  var indices   = createAugmentedTypedArray(3, radialSubdivisions * (verticalSubdivisions + extra) * 2, Uint16Array);

  var vertsAroundEdge = radialSubdivisions + 1;

  // The slant of the cone is constant across its surface
  var slant = Math.atan2(bottomRadius - topRadius, height);
  var cosSlant = Math.cos(slant);
  var sinSlant = Math.sin(slant);

  var start = topCap ? -2 : 0;
  var end = verticalSubdivisions + (bottomCap ? 2 : 0);

  for (var yy = start; yy <= end; ++yy) {
    var v = yy / verticalSubdivisions;
    var y = height * v;
    var ringRadius;
    if (yy < 0) {
      y = 0;
      v = 1;
      ringRadius = bottomRadius;
    } else if (yy > verticalSubdivisions) {
      y = height;
      v = 1;
      ringRadius = topRadius;
    } else {
      ringRadius = bottomRadius +
        (topRadius - bottomRadius) * (yy / verticalSubdivisions);
    }
    if (yy === -2 || yy === verticalSubdivisions + 2) {
      ringRadius = 0;
      v = 0;
    }
    y -= height / 2;
    for (var ii = 0; ii < vertsAroundEdge; ++ii) {
      var sin = Math.sin(ii * Math.PI * 2 / radialSubdivisions);
      var cos = Math.cos(ii * Math.PI * 2 / radialSubdivisions);
      positions.push(sin * ringRadius, y, cos * ringRadius);
      normals.push(
          (yy < 0 || yy > verticalSubdivisions) ? 0 : (sin * cosSlant),
          (yy < 0) ? -1 : (yy > verticalSubdivisions ? 1 : sinSlant),
          (yy < 0 || yy > verticalSubdivisions) ? 0 : (cos * cosSlant));
      texcoords.push((ii / radialSubdivisions), 1 - v);
    }
  }

  for (var yy = 0; yy < verticalSubdivisions + extra; ++yy) {  // eslint-disable-line
    for (var ii = 0; ii < radialSubdivisions; ++ii) {  // eslint-disable-line
      indices.push(vertsAroundEdge * (yy + 0) + 0 + ii,
                   vertsAroundEdge * (yy + 0) + 1 + ii,
                   vertsAroundEdge * (yy + 1) + 1 + ii);
      indices.push(vertsAroundEdge * (yy + 0) + 0 + ii,
                   vertsAroundEdge * (yy + 1) + 1 + ii,
                   vertsAroundEdge * (yy + 1) + 0 + ii);
    }
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices,
  };
}

function expandRLEData(rleData, padding) {
  padding = padding || [];
  var data = [];
  for (var ii = 0; ii < rleData.length; ii += 4) {
    var runLength = rleData[ii];
    var element = rleData.slice(ii + 1, ii + 4);
    element.push.apply(element, padding);
    for (var jj = 0; jj < runLength; ++jj) {
      data.push.apply(data, element);
    }
  }
  return data;
}

function create3DFVertices() {

  var positions = [
    // left column front
    0,   0,  0,
    0, 150,  0,
    30,   0,  0,
    0, 150,  0,
    30, 150,  0,
    30,   0,  0,

    // top rung front
    30,   0,  0,
    30,  30,  0,
    100,   0,  0,
    30,  30,  0,
    100,  30,  0,
    100,   0,  0,

    // middle rung front
    30,  60,  0,
    30,  90,  0,
    67,  60,  0,
    30,  90,  0,
    67,  90,  0,
    67,  60,  0,

    // left column back
      0,   0,  30,
     30,   0,  30,
      0, 150,  30,
      0, 150,  30,
     30,   0,  30,
     30, 150,  30,

    // top rung back
     30,   0,  30,
    100,   0,  30,
     30,  30,  30,
     30,  30,  30,
    100,   0,  30,
    100,  30,  30,

    // middle rung back
     30,  60,  30,
     67,  60,  30,
     30,  90,  30,
     30,  90,  30,
     67,  60,  30,
     67,  90,  30,

    // top
      0,   0,   0,
    100,   0,   0,
    100,   0,  30,
      0,   0,   0,
    100,   0,  30,
      0,   0,  30,

    // top rung front
    100,   0,   0,
    100,  30,   0,
    100,  30,  30,
    100,   0,   0,
    100,  30,  30,
    100,   0,  30,

    // under top rung
    30,   30,   0,
    30,   30,  30,
    100,  30,  30,
    30,   30,   0,
    100,  30,  30,
    100,  30,   0,

    // between top rung and middle
    30,   30,   0,
    30,   60,  30,
    30,   30,  30,
    30,   30,   0,
    30,   60,   0,
    30,   60,  30,

    // top of middle rung
    30,   60,   0,
    67,   60,  30,
    30,   60,  30,
    30,   60,   0,
    67,   60,   0,
    67,   60,  30,

    // front of middle rung
    67,   60,   0,
    67,   90,  30,
    67,   60,  30,
    67,   60,   0,
    67,   90,   0,
    67,   90,  30,

    // bottom of middle rung.
    30,   90,   0,
    30,   90,  30,
    67,   90,  30,
    30,   90,   0,
    67,   90,  30,
    67,   90,   0,

    // front of bottom
    30,   90,   0,
    30,  150,  30,
    30,   90,  30,
    30,   90,   0,
    30,  150,   0,
    30,  150,  30,

    // bottom
    0,   150,   0,
    0,   150,  30,
    30,  150,  30,
    0,   150,   0,
    30,  150,  30,
    30,  150,   0,

    // left side
    0,   0,   0,
    0,   0,  30,
    0, 150,  30,
    0,   0,   0,
    0, 150,  30,
    0, 150,   0,
  ];

  var texcoords = [
    // left column front
    0.22, 0.19,
    0.22, 0.79,
    0.34, 0.19,
    0.22, 0.79,
    0.34, 0.79,
    0.34, 0.19,

    // top rung front
    0.34, 0.19,
    0.34, 0.31,
    0.62, 0.19,
    0.34, 0.31,
    0.62, 0.31,
    0.62, 0.19,

    // middle rung front
    0.34, 0.43,
    0.34, 0.55,
    0.49, 0.43,
    0.34, 0.55,
    0.49, 0.55,
    0.49, 0.43,

    // left column back
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    // top rung back
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    // middle rung back
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    // top
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    // top rung front
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    // under top rung
    0, 0,
    0, 1,
    1, 1,
    0, 0,
    1, 1,
    1, 0,

    // between top rung and middle
    0, 0,
    1, 1,
    0, 1,
    0, 0,
    1, 0,
    1, 1,

    // top of middle rung
    0, 0,
    1, 1,
    0, 1,
    0, 0,
    1, 0,
    1, 1,

    // front of middle rung
    0, 0,
    1, 1,
    0, 1,
    0, 0,
    1, 0,
    1, 1,

    // bottom of middle rung.
    0, 0,
    0, 1,
    1, 1,
    0, 0,
    1, 1,
    1, 0,

    // front of bottom
    0, 0,
    1, 1,
    0, 1,
    0, 0,
    1, 0,
    1, 1,

    // bottom
    0, 0,
    0, 1,
    1, 1,
    0, 0,
    1, 1,
    1, 0,

    // left side
    0, 0,
    0, 1,
    1, 1,
    0, 0,
    1, 1,
    1, 0,
  ];

  var normals = expandRLEData([
    // left column front
    // top rung front
    // middle rung front
    18, 0, 0, 1,

    // left column back
    // top rung back
    // middle rung back
    18, 0, 0, -1,

    // top
    6, 0, 1, 0,

    // top rung front
    6, 1, 0, 0,

    // under top rung
    6, 0, -1, 0,

    // between top rung and middle
    6, 1, 0, 0,

    // top of middle rung
    6, 0, 1, 0,

    // front of middle rung
    6, 1, 0, 0,

    // bottom of middle rung.
    6, 0, -1, 0,

    // front of bottom
    6, 1, 0, 0,

    // bottom
    6, 0, -1, 0,

    // left side
    6, -1, 0, 0,
  ]);

  var colors = expandRLEData([
        // left column front
        // top rung front
        // middle rung front
      18, 200,  70, 120,

        // left column back
        // top rung back
        // middle rung back
      18, 80, 70, 200,

        // top
      6, 70, 200, 210,

        // top rung front
      6, 200, 200, 70,

        // under top rung
      6, 210, 100, 70,

        // between top rung and middle
      6, 210, 160, 70,

        // top of middle rung
      6, 70, 180, 210,

        // front of middle rung
      6, 100, 70, 210,

        // bottom of middle rung.
      6, 76, 210, 100,

        // front of bottom
      6, 140, 210, 80,

        // bottom
      6, 90, 130, 110,

        // left side
      6, 160, 160, 220,
  ], [255]);

  var numVerts = positions.length / 3;

  var arrays = {
    position: createAugmentedTypedArray(3, numVerts),
    texcoord: createAugmentedTypedArray(2,  numVerts),
    normal: createAugmentedTypedArray(3, numVerts),
    color: createAugmentedTypedArray(4, numVerts, Uint8Array),
    indices: createAugmentedTypedArray(3, numVerts / 3, Uint16Array),
  };

  arrays.position.push(positions);
  arrays.texcoord.push(texcoords);
  arrays.normal.push(normals);
  arrays.color.push(colors);

  for (var ii = 0; ii < numVerts; ++ii) {
    arrays.indices.push(ii);
  }

  return arrays;
}

 function createCresentVertices(
    verticalRadius,
    outerRadius,
    innerRadius,
    thickness,
    subdivisionsDown,
    startOffset,
    endOffset) {
  if (subdivisionsDown <= 0) {
    throw Error('subdivisionDown must be > 0');
  }

  startOffset = startOffset || 0;
  endOffset   = endOffset || 1;

  var subdivisionsThick = 2;

  var offsetRange = endOffset - startOffset;
  var numVertices = (subdivisionsDown + 1) * 2 * (2 + subdivisionsThick);
  var positions   = createAugmentedTypedArray(3, numVertices);
  var normals     = createAugmentedTypedArray(3, numVertices);
  var texcoords   = createAugmentedTypedArray(2, numVertices);

  function lerp(a, b, s) {
    return a + (b - a) * s;
  }

  function createArc(arcRadius, x, normalMult, normalAdd, uMult, uAdd) {
    for (var z = 0; z <= subdivisionsDown; z++) {
      var uBack = x / (subdivisionsThick - 1);
      var v = z / subdivisionsDown;
      var xBack = (uBack - 0.5) * 2;
      var angle = (startOffset + (v * offsetRange)) * Math.PI;
      var s = Math.sin(angle);
      var c = Math.cos(angle);
      var radius = lerp(verticalRadius, arcRadius, s);
      var px = xBack * thickness;
      var py = c * verticalRadius;
      var pz = s * radius;
      positions.push(px, py, pz);
      var n = v3.add(v3.multiply([0, s, c], normalMult), normalAdd);
      normals.push(n);
      texcoords.push(uBack * uMult + uAdd, v);
    }
  }

  // Generate the individual vertices in our vertex buffer.
  for (var x = 0; x < subdivisionsThick; x++) {
    var uBack = (x / (subdivisionsThick - 1) - 0.5) * 2;
    createArc(outerRadius, x, [1, 1, 1], [0,     0, 0], 1, 0);
    createArc(outerRadius, x, [0, 0, 0], [uBack, 0, 0], 0, 0);
    createArc(innerRadius, x, [1, 1, 1], [0,     0, 0], 1, 0);
    createArc(innerRadius, x, [0, 0, 0], [uBack, 0, 0], 0, 1);
  }

  // Do outer surface.
  var indices = createAugmentedTypedArray(3, (subdivisionsDown * 2) * (2 + subdivisionsThick), Uint16Array);

  function createSurface(leftArcOffset, rightArcOffset) {
    for (var z = 0; z < subdivisionsDown; ++z) {
      // Make triangle 1 of quad.
      indices.push(
          leftArcOffset + z + 0,
          leftArcOffset + z + 1,
          rightArcOffset + z + 0);

      // Make triangle 2 of quad.
      indices.push(
          leftArcOffset + z + 1,
          rightArcOffset + z + 1,
          rightArcOffset + z + 0);
    }
  }

  var numVerticesDown = subdivisionsDown + 1;
  // front
  createSurface(numVerticesDown * 0, numVerticesDown * 4);
  // right
  createSurface(numVerticesDown * 5, numVerticesDown * 7);
  // back
  createSurface(numVerticesDown * 6, numVerticesDown * 2);
  // left
  createSurface(numVerticesDown * 3, numVerticesDown * 1);

  return {
    position: positions,
    normal:   normals,
    texcoord: texcoords,
    indices:  indices,
  };
}

function createCylinderVertices(
    radius,
    height,
    radialSubdivisions,
    verticalSubdivisions,
    topCap,
    bottomCap) {
  return createTruncatedConeVertices(
      radius,
      radius,
      height,
      radialSubdivisions,
      verticalSubdivisions,
      topCap,
      bottomCap);
}

function createTorusVertices(
    radius,
    thickness,
    radialSubdivisions,
    bodySubdivisions,
    startAngle,
    endAngle) {
  if (radialSubdivisions < 3) {
    throw Error('radialSubdivisions must be 3 or greater');
  }

  if (bodySubdivisions < 3) {
    throw Error('verticalSubdivisions must be 3 or greater');
  }

  startAngle = startAngle || 0;
  endAngle = endAngle || Math.PI * 2;
  var range = endAngle - startAngle;

  var radialParts = radialSubdivisions + 1;
  var bodyParts   = bodySubdivisions + 1;
  var numVertices = radialParts * bodyParts;
  var positions   = createAugmentedTypedArray(3, numVertices);
  var normals     = createAugmentedTypedArray(3, numVertices);
  var texcoords   = createAugmentedTypedArray(2, numVertices);
  var indices     = createAugmentedTypedArray(3, (radialSubdivisions) * (bodySubdivisions) * 2, Uint16Array);

  for (var slice = 0; slice < bodyParts; ++slice) {
    var v = slice / bodySubdivisions;
    var sliceAngle = v * Math.PI * 2;
    var sliceSin = Math.sin(sliceAngle);
    var ringRadius = radius + sliceSin * thickness;
    var ny = Math.cos(sliceAngle);
    var y = ny * thickness;
    for (var ring = 0; ring < radialParts; ++ring) {
      var u = ring / radialSubdivisions;
      var ringAngle = startAngle + u * range;
      var xSin = Math.sin(ringAngle);
      var zCos = Math.cos(ringAngle);
      var x = xSin * ringRadius;
      var z = zCos * ringRadius;
      var nx = xSin * sliceSin;
      var nz = zCos * sliceSin;
      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      texcoords.push(u, 1 - v);
    }
  }

  for (var slice = 0; slice < bodySubdivisions; ++slice) {  // eslint-disable-line
    for (var ring = 0; ring < radialSubdivisions; ++ring) {  // eslint-disable-line
      var nextRingIndex  = 1 + ring;
      var nextSliceIndex = 1 + slice;
      indices.push(radialParts * slice          + ring,
                   radialParts * nextSliceIndex + ring,
                   radialParts * slice          + nextRingIndex);
      indices.push(radialParts * nextSliceIndex + ring,
                   radialParts * nextSliceIndex + nextRingIndex,
                   radialParts * slice          + nextRingIndex);
    }
  }

  return {
    position: positions,
    normal:   normals,
    texcoord: texcoords,
    indices:  indices,
  };
}

function createDiscVertices(
    radius,
    divisions,
    stacks,
    innerRadius,
    stackPower) {
  if (divisions < 3) {
    throw Error('divisions must be at least 3');
  }

  stacks = stacks ? stacks : 1;
  stackPower = stackPower ? stackPower : 1;
  innerRadius = innerRadius ? innerRadius : 0;

  // Note: We don't share the center vertex because that would
  // mess up texture coordinates.
  var numVertices = (divisions + 1) * (stacks + 1);

  var positions = createAugmentedTypedArray(3, numVertices);
  var normals   = createAugmentedTypedArray(3, numVertices);
  var texcoords = createAugmentedTypedArray(2, numVertices);
  var indices   = createAugmentedTypedArray(3, stacks * divisions * 2, Uint16Array);

  var firstIndex = 0;
  var radiusSpan = radius - innerRadius;
  var pointsPerStack = divisions + 1;

  // Build the disk one stack at a time.
  for (var stack = 0; stack <= stacks; ++stack) {
    var stackRadius = innerRadius + radiusSpan * Math.pow(stack / stacks, stackPower);

    for (var i = 0; i <= divisions; ++i) {
      var theta = 2.0 * Math.PI * i / divisions;
      var x = stackRadius * Math.cos(theta);
      var z = stackRadius * Math.sin(theta);

      positions.push(x, 0, z);
      normals.push(0, 1, 0);
      texcoords.push(1 - (i / divisions), stack / stacks);
      if (stack > 0 && i !== divisions) {
        // a, b, c and d are the indices of the vertices of a quad.  unless
        // the current stack is the one closest to the center, in which case
        // the vertices a and b connect to the center vertex.
        var a = firstIndex + (i + 1);
        var b = firstIndex + i;
        var c = firstIndex + i - pointsPerStack;
        var d = firstIndex + (i + 1) - pointsPerStack;

        // Make a quad of the vertices a, b, c, d.
        indices.push(a, b, c);
        indices.push(a, c, d);
      }
    }

    firstIndex += divisions + 1;
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices,
  };
}

function randInt(range) {
  return Math.random() * range | 0;
}

function makeRandomVertexColors(vertices, options) {
  options = options || {};
  var numElements = vertices.position.numElements;
  var vcolors = createAugmentedTypedArray(4, numElements, Uint8Array);
  var rand = options.rand || function(ndx, channel) {
    return channel < 3 ? randInt(256) : 255;
  };
  vertices.color = vcolors;
  if (vertices.indices) {
    // just make random colors if index
    for (var ii = 0; ii < numElements; ++ii) {
      vcolors.push(rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3));
    }
  } else {
    // make random colors per triangle
    var numVertsPerColor = options.vertsPerColor || 3;
    var numSets = numElements / numVertsPerColor;
    for (var ii = 0; ii < numSets; ++ii) {  // eslint-disable-line
      var color = [rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3)];
      for (var jj = 0; jj < numVertsPerColor; ++jj) {
        vcolors.push(color);
      }
    }
  }
  return vertices;
}

function createBufferFunc(fn) {
  return function(gl) {
    var arrays = fn.apply(this, Array.prototype.slice.call(arguments, 1));
    return attributes.createBuffersFromArrays(gl, arrays);
  };
}

function createBufferInfoFunc(fn) {
  return function(gl) {
    var arrays = fn.apply(null,  Array.prototype.slice.call(arguments, 1));
    return attributes.createBufferInfoFromArrays(gl, arrays);
  };
}

var arraySpecPropertyNames = [
  "numComponents",
  "size",
  "type",
  "normalize",
  "stride",
  "offset",
  "attrib",
  "name",
  "attribName",
];

function copyElements(src, dst, dstNdx, offset) {
  offset = offset || 0;
  var length = src.length;
  for (var ii = 0; ii < length; ++ii) {
    dst[dstNdx + ii] = src[ii] + offset;
  }
}

function createArrayOfSameType(srcArray, length) {
  var arraySrc = getArray(srcArray);
  var newArray = new arraySrc.constructor(length);
  var newArraySpec = newArray;
  // If it appears to have been augmented make new one augemented
  if (arraySrc.numComponents && arraySrc.numElements) {
    augmentTypedArray(newArray, arraySrc.numComponents);
  }
  // If it was a fullspec make new one a fullspec
  if (srcArray.data) {
    newArraySpec = {
      data: newArray,
    };
    utils.copyNamedProperties(arraySpecPropertyNames, srcArray, newArraySpec);
  }
  return newArraySpec;
}

function concatVertices(arrayOfArrays) {
  var names = {};
  var baseName;
  // get names of all arrays.
  // and numElements for each set of vertices
  for (var ii = 0; ii < arrayOfArrays.length; ++ii) {
    var arrays = arrayOfArrays[ii];
    Object.keys(arrays).forEach(function(name) {  // eslint-disable-line
      if (!names[name]) {
        names[name] = [];
      }
      if (!baseName && name !== 'indices') {
        baseName = name;
      }
      var arrayInfo = arrays[name];
      var numComponents = getNumComponents(arrayInfo, name);
      var array = getArray(arrayInfo);
      var numElements = array.length / numComponents;
      names[name].push(numElements);
    });
  }

  function getLengthOfCombinedArrays(name) {
    var length = 0;
    var arraySpec;
    for (var ii = 0; ii < arrayOfArrays.length; ++ii) {
      var arrays = arrayOfArrays[ii];
      var arrayInfo = arrays[name];
      var array = getArray(arrayInfo);
      length += array.length;
      if (!arraySpec || arrayInfo.data) {
        arraySpec = arrayInfo;
      }
    }
    return {
      length,
      spec: arraySpec,
    };
  }

  function copyArraysToNewArray(name, base, newArray) {
    var baseIndex = 0;
    var offset = 0;
    for (var ii = 0; ii < arrayOfArrays.length; ++ii) {
      var arrays = arrayOfArrays[ii];
      var arrayInfo = arrays[name];
      var array = getArray(arrayInfo);
      if (name === 'indices') {
        copyElements(array, newArray, offset, baseIndex);
        baseIndex += base[ii];
      } else {
        copyElements(array, newArray, offset);
      }
      offset += array.length;
    }
  }

  var base = names[baseName];

  var newArrays = {};
  Object.keys(names).forEach(function(name) {
    var info = getLengthOfCombinedArrays(name);
    var newArraySpec = createArrayOfSameType(info.spec, info.length);
    copyArraysToNewArray(name, base, getArray(newArraySpec));
    newArrays[name] = newArraySpec;
  });
  return newArrays;
}

function duplicateVertices(arrays) {
  var newArrays = {};
  Object.keys(arrays).forEach(function(name) {
    var arraySpec = arrays[name];
    var srcArray = getArray(arraySpec);
    var newArraySpec = createArrayOfSameType(arraySpec, srcArray.length);
    copyElements(srcArray, getArray(newArraySpec), 0);
    newArrays[name] = newArraySpec;
  });
  return newArrays;
}

// Using quotes prevents Uglify from changing the names.
// No speed diff AFAICT.
export default {
  "create3DFBufferInfo": createBufferInfoFunc(create3DFVertices),
  "create3DFBuffers": createBufferFunc(create3DFVertices),
  "create3DFVertices": create3DFVertices,
  "createAugmentedTypedArray": createAugmentedTypedArray,
  "createCubeBufferInfo": createBufferInfoFunc(createCubeVertices),
  "createCubeBuffers": createBufferFunc(createCubeVertices),
  "createCubeVertices": createCubeVertices,
  "createPlaneBufferInfo": createBufferInfoFunc(createPlaneVertices),
  "createPlaneBuffers": createBufferFunc(createPlaneVertices),
  "createPlaneVertices": createPlaneVertices,
  "createSphereBufferInfo": createBufferInfoFunc(createSphereVertices),
  "createSphereBuffers": createBufferFunc(createSphereVertices),
  "createSphereVertices": createSphereVertices,
  "createTruncatedConeBufferInfo": createBufferInfoFunc(createTruncatedConeVertices),
  "createTruncatedConeBuffers": createBufferFunc(createTruncatedConeVertices),
  "createTruncatedConeVertices": createTruncatedConeVertices,
  "createXYQuadBufferInfo": createBufferInfoFunc(createXYQuadVertices),
  "createXYQuadBuffers": createBufferFunc(createXYQuadVertices),
  "createXYQuadVertices": createXYQuadVertices,
  "createCresentBufferInfo": createBufferInfoFunc(createCresentVertices),
  "createCresentBuffers": createBufferFunc(createCresentVertices),
  "createCresentVertices": createCresentVertices,
  "createCylinderBufferInfo": createBufferInfoFunc(createCylinderVertices),
  "createCylinderBuffers": createBufferFunc(createCylinderVertices),
  "createCylinderVertices": createCylinderVertices,
  "createTorusBufferInfo": createBufferInfoFunc(createTorusVertices),
  "createTorusBuffers": createBufferFunc(createTorusVertices),
  "createTorusVertices": createTorusVertices,
  "createDiscBufferInfo": createBufferInfoFunc(createDiscVertices),
  "createDiscBuffers": createBufferFunc(createDiscVertices),
  "createDiscVertices": createDiscVertices,
  "deindexVertices": deindexVertices,
  "flattenNormals": flattenNormals,
  "makeRandomVertexColors": makeRandomVertexColors,
  "reorientDirections": reorientDirections,
  "reorientNormals": reorientNormals,
  "reorientPositions": reorientPositions,
  "reorientVertices": reorientVertices,
  "concatVertices": concatVertices,
  "duplicateVertices": duplicateVertices,
};
