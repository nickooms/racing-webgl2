import vertexArrays from './vertex-arrays.js';
import framebuffers from './framebuffers.js';
import typedArrays from './typedarrays.js';
import attributes from './attributes.js';
import textures from './textures.js';
import programs from './programs.js';
import utils from './utils.js';
import draw from './draw.js';

const defaults = { enableVertexArrayObjects: true };

function setDefaults(newDefaults) {
  utils.copyExistingProperties(newDefaults, defaults);
  attributes.setDefaults_(newDefaults);
  textures.setDefaults_(newDefaults);
}

function addVertexArrayObjectSupport(gl) {
  if (!gl || !defaults.enableVertexArrayObjects) return;
  if (utils.isWebGL1(gl)) {
    const ext = gl.getExtension('OES_vertex_array_object');
    if (ext) {
      Object.assign(gl, {
        createVertexArray: () => ext.createVertexArrayOES(),
        deleteVertexArray: () => ext.deleteVertexArrayOES(v),
        isVertexArray: () => ext.isVertexArrayOES(v),
        bindVertexArray: () => ext.bindVertexArrayOES(v),
        VERTEX_ARRAY_BINDING: ext.VERTEX_ARRAY_BINDING_OES,
      });
    }
  }
}

function create3DContext(canvas, opt_attribs) {
  var names = ['webgl', 'experimental-webgl'];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    context = canvas.getContext(names[ii], opt_attribs);
    if (context) break;
  }
  return context;
}

function getWebGLContext(canvas, opt_attribs) {
  const gl = create3DContext(canvas, opt_attribs);
  addVertexArrayObjectSupport(gl);
  return gl;
}

function createContext(canvas, opt_attribs) {
  const names = ['webgl2', 'webgl', 'experimental-webgl'];
  let context = null;
  for (let ii = 0; ii < names.length; ++ii) {
    context = canvas.getContext(names[ii], opt_attribs);
    if (context) break;
  }
  return context;
}

const getContext = (canvas, optAttribs) => {
  const gl = createContext(canvas, optAttribs);
  addVertexArrayObjectSupport(gl);
  return gl;
};

const resizeCanvasToDisplaySize = (canvas, multiplier) => {
  multiplier = multiplier || 1;
  multiplier = Math.max(1, multiplier);
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width || canvas.height !== height) {
    Object.assign(canvas, { width, height });
    return true;
  }
  return false;
};

const { isWebGL1, isWebGL2 } = utils;
const api = {
  getContext,
  getWebGLContext,
  isWebGL1,
  isWebGL2,
  resizeCanvasToDisplaySize,
  setDefaults,
};

function notPrivate(name) {
  return name[name.length - 1] !== '_';
}

function copyPublicProperties(src, dst) {
  Object.keys(src).filter(notPrivate).forEach((key) => {
    dst[key] = src[key];
  });
  return dst;
}

const apis = {
  attributes,
  draw,
  framebuffers,
  programs,
  textures,
  typedArrays,
  vertexArrays,
};

Object.keys(apis).forEach((name) => {
  const srcApi = apis[name];
  copyPublicProperties(srcApi, api);
  api[name] = copyPublicProperties(srcApi, {});
});
console.log(api);
export default api;
