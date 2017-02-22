'use strict';

twgl.setDefaults({ attribPrefix: 'a_' });

const { m4, v3 } = twgl;
const gl = twgl.getContext(document.getElementById('c'));
const {
  NEAREST, DEPTH_TEST, CULL_FACE, COLOR_BUFFER_BIT,
  DEPTH_BUFFER_BIT, TRIANGLES, UNSIGNED_SHORT, VERSION
} = gl;

console.log(`Using ${gl.getParameter(VERSION)}`);
if (!twgl.isWebGL2(gl)) {
  console.error('Sorry, this example requires WebGL 2.0');
}
const programInfo = twgl.createProgramInfo(gl, ['vs', 'fs']);

/* const marktVertices = twgl.primitives.concatVertices([
  Lines.toBufferInfoArrays(Polygon.toCenteredLines(Markt19)),
  Lines.toBufferInfoArrays(Polygon.toCenteredLines(Markt23))
]);
 // turn them into WebGL buffers and attrib data
const arrays = twgl.createBufferInfoFromArrays(gl, [
  Polygon.toCenteredLines(Markt19),
  Polygon.toCenteredLines(Markt23)
]);
console.log(arrays);*/
/* const wegbaan = Polygon
  .toCenteredLines(MarktWegbaan)
  .map(([x, y]) => [parseFloat(x), 0, parseFloat(y)]);*/
// console.log(flatten(wegbaan));
// const normal = wegbaan.map(([x, y, z]) => [0, 1, 0]);
// console.log(flatten(normal));
// const texcoord = wegbaan.map((vertex, index) => [[1, 0], [0, 0], [0, 1]][index % 3]);
// console.log(flatten(texcoord));
/* const arrays = {
  position: flatten(wegbaan),
  normal: flatten(normal),
  texcoord: flatten(texcoord),
  indices: MarktWegbaanIndices,
}*/
// console.log(JSON.stringify(arrays));

// const arrays = Lines.toBufferInfoArrays(Polygon.toCenteredLines(Markt19));

/* group('BufferInfoArrays')(({ position, normal, texcoord, indices } = arrays) => {
  tableCollapsed('position', position, position => ({ position }));
  tableCollapsed('normal  ', normal, normal => ({ normal }));
  tableCollapsed('texcoord', texcoord, texcoord => ({ texcoord }));
  tableCollapsed('indices ', indices, indices => ({ indices }));
});*/
const centers = arraysList.map(({ center: [x, y] }) => ({ x, y }));
const bbox = new BBOX(centers);
// console.log(bbox);
const bufferInfos = arraysList.map(({ center, position: pos, normal, texcoord, indices }) => {
  const position = [];
  for (let i = 0; i < pos.length; i += 3) {
    position.push(pos[i + 2] + (bbox.center.y - center[1]));
    position.push(0);
    position.push(pos[i] + (bbox.center.x - center[0]));
  }
  // console.log(position);
  return twgl.createBufferInfoFromArrays(gl, { position, normal, texcoord, indices });
});
// const { position, normal, texcoord, indices } = arraysList[0];
// const bufferInfo = twgl.createBufferInfoFromArrays(gl, { position, normal, texcoord, indices });
// console.log(bufferInfo);

const tex = twgl.createTexture(gl, {
  min: NEAREST,
  mag: NEAREST,
  src: [
    255, 255, 255, 255,
    /* 192, 192, 192, 255,
    192, 192, 192, 255,
    255, 255, 255, 255,*/
  ],
});

const uniforms = {
  u_lightWorldPos: [1, 5, -20],
  u_lightColor: [0.8, 0.8, 1, 1],
  u_ambient: [0, 0, 0, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 75,
  u_specularFactor: 1,
  u_diffuse: tex,
};

function render(time) {
  time *= 0.001;
  const { canvas } = gl;
  const { width, height, clientWidth, clientHeight } = canvas;
  twgl.resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, width, height);
  gl.enable(DEPTH_TEST);
  // gl.enable(CULL_FACE);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  const aspectRatio = clientWidth / clientHeight;
  const h = Math.max(bbox.width, bbox.height);
  const projection = m4.perspective(30 * Math.PI / 180, aspectRatio, 600, h);
  const eye = [1, h, h];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const camera = m4.lookAt(eye, target, up);
  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);
  const world = m4.rotationY(time);
  Object.assign(uniforms, {
    u_viewInverse: camera,
    u_world: world,
    u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
    u_worldViewProjection: m4.multiply(viewProjection, world),
  });
  gl.useProgram(programInfo.program);
  bufferInfos.forEach((bufferInfo, i) => {
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    gl.drawElements(TRIANGLES, bufferInfo.numElements, UNSIGNED_SHORT, 0);
    // console.dir(bufferInfo);
  });
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
