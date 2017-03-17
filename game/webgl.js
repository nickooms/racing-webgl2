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

const arrays = Lines.toBufferInfoArrays(Polygon.toCenteredLines(Markt19));

let arraysList, bufferInfos, h;

fetch('../api/percelen')
.then(response => response.json())
.then(result => {
  arraysList = result;
  const centers = arraysList.map(({ center: [x, y] }) => ({ x, y }));
  const bbox = new BBOX(centers);
  bufferInfos = arraysList.map(({ type, center, position: pos, normal, texcoord, indices }) => {
    const position = [];
    for (let i = 0; i < pos.length; i += 3) {
      position.push(pos[i + 2] + (bbox.center.y - center[1]));
      position.push(type === 'perceel' ? 0 : -10);
      position.push(pos[i] + (bbox.center.x - center[0]));
    }
    return twgl.createBufferInfoFromArrays(gl, { position, normal, texcoord, indices });
  });
  h = Math.max(bbox.width, bbox.height);
  requestAnimationFrame(render);
});

const marktBuffer = twgl.createBufferInfoFromArrays(gl, arrays);

const tex = twgl.createTexture(gl, {
  min: NEAREST,
  mag: NEAREST,
  src: [255, 255, 255, 255],
});

const uniforms = {
  u_lightWorldPos: [1, 6, -20],
  u_lightColor: [0.8, 0.8, 1, 1],
  u_ambient: [0.1, 0.1, 0.1, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 1,
  u_diffuse: tex,
};

window.addEventListener('wheel', evt => {
  h -= evt.wheelDelta / 12;
}, false);

const render = time => {
  time *= 0.001;
  const { canvas } = gl;
  const { width, height, clientWidth, clientHeight } = canvas;
  twgl.resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, width, height);
  gl.enable(DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
  // gl.enable(CULL_FACE);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  const aspectRatio = clientWidth / clientHeight;
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
  });
  twgl.setBuffersAndAttributes(gl, programInfo, marktBuffer);
  twgl.setUniforms(programInfo, uniforms);
  gl.drawElements(TRIANGLES, marktBuffer.numElements, UNSIGNED_SHORT, 0);
  requestAnimationFrame(render);
}
