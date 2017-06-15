'use strict';

twgl.setDefaults({ attribPrefix: 'a_' });

/* class CachedClass {
  static prop(name, defaultValue) {
    CachedClass[name] = CachedClass[name] || defaultValue;
    return CachedClass[name];
  }
}*/

/* class GL extends CachedClass {
  static get gl() {
    return CachedClass.prop('Gl', twgl.getContext(document.getElementById('c')));
  }

  static get programInfo() {
    return CachedClass.prop('ProgramInfo', twgl.createProgramInfo(GL.gl, ['vs', 'fs']));
  }

  static bufferFromArrays({ position, normal, texcoord, indices }) {
    return twgl.createBufferInfoFromArrays(GL.gl, { position, normal, texcoord, indices });
  }

  static texture(r, g, b, a) {
    return twgl.createTexture(GL.gl, {
      min: GL.gl.NEAREST,
      mag: GL.gl.NEAREST,
      src: [r, g, b, a],
    });
  }

  static uniforms(tex) {
    return {
      u_lightWorldPos: [1, 6, -20],
      u_lightColor: [0.8, 0.8, 1, 1],
      u_ambient: [0.1, 0.1, 0.1, 1],
      u_specular: [1, 1, 1, 1],
      u_shininess: 50,
      u_specularFactor: 1,
      u_diffuse: tex,
    };
  }

  static draw(bufferInfo, tex) {
    const { gl, TRIANGLES, UNSIGNED_SHORT, programInfo } = GL;
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, GL.uniforms(tex));
    gl.drawElements(TRIANGLES, bufferInfo.numElements, UNSIGNED_SHORT, 0);
  }
}*/

const { m4 } = twgl;
const { gl, programInfo } = GL;
const {
  /* NEAREST, */DEPTH_TEST, CULL_FACE, COLOR_BUFFER_BIT,
  DEPTH_BUFFER_BIT, TRIANGLES, UNSIGNED_SHORT, VERSION,
} = gl;

console.log(`Using ${gl.getParameter(VERSION)}`);
if (!twgl.isWebGL2(gl)) {
  console.error('Sorry, this example requires WebGL 2.0');
}

const frame = () => requestAnimationFrame(render);

let bufferInfos;
let h;
const bufferTypes = [];

const jsonReceived = (result) => {
  const bbox = new BBOX(result.map(({ center: [x, y] }) => ({ x, y })));
  const { x, y } = bbox.center;
  bufferInfos = result.map(({ type, center, position: pos, normal, texcoord, indices }) => {
    const height = type === 'perceel' ? 1 : 0;
    bufferTypes.push(type);
    const position = [];
    for (let i = 0; i < pos.length; i += 3) {
      position.push(pos[i + 2] + (y - center[1]), height, pos[i] + (x - center[0]));
    }
    const buffer = GL.bufferFromArrays({ position, normal, texcoord, indices });
    buffer.type = type;
    return buffer;
  });
  h = Math.max(bbox.width, bbox.height);
  frame();
};

Promise.all([
  fetch('../api/percelen'),
  fetch('../api/wegbanen'),
])
.then(([percelen, wegbanen]) => Promise.all([
  percelen.json(),
  wegbanen.json(),
]))
.then(([percelen, wegbanen]) => [].concat(percelen, wegbanen))
.then(jsonReceived);

const uniforms = {
  u_lightWorldPos: [1, 6, -20],
  u_lightColor: [0.8, 0.8, 1, 1],
  u_ambient: [0.1, 0.1, 0.1, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 1,
  u_diffuse: GL.texture(255, 255, 255, 255),
};

window.addEventListener('wheel', ({ wheelDelta }) => {
  h -= wheelDelta / 12;
}, false);

const drawBufferInfo = (bufferInfo) => {
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  switch (bufferInfo.type) {
    case 'perceel':
      Object.assign(uniforms, { u_diffuse: GL.texture(100, 100, 100, 255) });
      break;
    case 'hoofdgebouw':
      Object.assign(uniforms, { u_diffuse: GL.texture(200, 200, 200, 255) });
      break;
    default:
      Object.assign(uniforms, { u_diffuse: GL.texture(255, 0, 0, 255) });
  }
  twgl.setUniforms(programInfo, uniforms);
  gl.drawElements(TRIANGLES, bufferInfo.numElements, UNSIGNED_SHORT, 0);
};

const render = (time) => {
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
  const projection = m4.perspective((30 * Math.PI) / 180, aspectRatio, 600, h);
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
  bufferInfos.forEach(drawBufferInfo);
  frame();
};
