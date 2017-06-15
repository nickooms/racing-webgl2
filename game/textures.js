import typedArrays from './typedarrays.js';
import utils from './utils.js';

var defaults = {
  textureColor: new Uint8Array([128, 192, 255, 255]),
  textureOptions: {},
  crossOrigin: undefined,
};
var isArrayBuffer = typedArrays.isArrayBuffer;

var ctx = document.createElement("canvas").getContext("2d");

/* PixelFormat */
var ALPHA = 0x1906;
var RGB = 0x1907;
var RGBA = 0x1908;
var LUMINANCE = 0x1909;
var LUMINANCE_ALPHA = 0x190A;
var DEPTH_COMPONENT = 0x1902;
var DEPTH_STENCIL = 0x84F9;

/* TextureWrapMode */
var REPEAT = 0x2901;  // eslint-disable-line
var MIRRORED_REPEAT = 0x8370;  // eslint-disable-line

/* TextureMagFilter */
var NEAREST = 0x2600;  // eslint-disable-line

/* TextureMinFilter */
var NEAREST_MIPMAP_NEAREST = 0x2700;  // eslint-disable-line
var LINEAR_MIPMAP_NEAREST = 0x2701;  // eslint-disable-line
var NEAREST_MIPMAP_LINEAR = 0x2702;  // eslint-disable-line
var LINEAR_MIPMAP_LINEAR = 0x2703;  // eslint-disable-line

const R8 = 0x8229;
const R8_SNORM = 0x8F94;
const R16F = 0x822D;
const R32F = 0x822E;
const R8UI = 0x8232;
const R8I = 0x8231;
const RG16UI = 0x823A;
const RG16I = 0x8239;
const RG32UI = 0x823C;
const RG32I = 0x823B;
const RG8 = 0x822B;
const RG8_SNORM = 0x8F95;
const RG16F = 0x822F;
const RG32F = 0x8230;
const RG8UI = 0x8238;
const RG8I = 0x8237;
const R16UI = 0x8234;
const R16I = 0x8233;
const R32UI = 0x8236;
const R32I = 0x8235;
const RGB8 = 0x8051;
const SRGB8 = 0x8C41;
const RGB565 = 0x8D62;
const RGB8_SNORM = 0x8F96;
const R11F_G11F_B10F = 0x8C3A;
const RGB9_E5 = 0x8C3D;
const RGB16F = 0x881B;
const RGB32F = 0x8815;
const RGB8UI = 0x8D7D;
const RGB8I = 0x8D8F;
const RGB16UI = 0x8D77;
const RGB16I = 0x8D89;
const RGB32UI = 0x8D71;
const RGB32I = 0x8D83;
const RGBA8 = 0x8058;
const SRGB8_ALPHA8 = 0x8C43;
const RGBA8_SNORM = 0x8F97;
const RGB5_A1 = 0x8057;
const RGBA4 = 0x8056;
const RGB10_A2 = 0x8059;
const RGBA16F = 0x881A;
const RGBA32F = 0x8814;
const RGBA8UI = 0x8D7C;
const RGBA8I = 0x8D8E;
const RGB10_A2UI = 0x906F;
const RGBA16UI = 0x8D76;
const RGBA16I = 0x8D88;
const RGBA32I = 0x8D82;
const RGBA32UI = 0x8D70;

const DEPTH_COMPONENT16 = 0x81A5;
const DEPTH_COMPONENT24 = 0x81A6;
const DEPTH_COMPONENT32F = 0x8CAC;
const DEPTH32F_STENCIL8 = 0x8CAD;
const DEPTH24_STENCIL8 = 0x88F0;

/* DataType */
const BYTE = 0x1400;
const UNSIGNED_BYTE = 0x1401;
const SHORT = 0x1402;
const UNSIGNED_SHORT = 0x1403;
const INT = 0x1404;
const UNSIGNED_INT = 0x1405;
const FLOAT = 0x1406;
const UNSIGNED_SHORT_4_4_4_4 = 0x8033;
const UNSIGNED_SHORT_5_5_5_1 = 0x8034;
const UNSIGNED_SHORT_5_6_5 = 0x8363;
const HALF_FLOAT = 0x140B;
const HALF_FLOAT_OES = 0x8D61;
const UNSIGNED_INT_2_10_10_10_REV = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD;
const UNSIGNED_INT_24_8 = 0x84FA;

const RG = 0x8227;
const RG_INTEGER = 0x8228;
const RED = 0x1903;
const RED_INTEGER = 0x8D94;
const RGB_INTEGER = 0x8D98;
const RGBA_INTEGER = 0x8D99;

const formatInfo = {};
{
  const f = formatInfo;
  f[ALPHA] = { numColorComponents: 1 };
  f[LUMINANCE] = { numColorComponents: 1 };
  f[LUMINANCE_ALPHA] = { numColorComponents: 2 };
  f[RGB] = { numColorComponents: 3 };
  f[RGBA] = { numColorComponents: 4 };
  f[RED] = { numColorComponents: 1 };
  f[RED_INTEGER] = { numColorComponents: 1 };
  f[RG] = { numColorComponents: 2 };
  f[RG_INTEGER] = { numColorComponents: 2 };
  f[RGB] = { numColorComponents: 3 };
  f[RGB_INTEGER] = { numColorComponents: 3 };
  f[RGBA] = { numColorComponents: 4 };
  f[RGBA_INTEGER] = { numColorComponents: 4 };
  f[DEPTH_COMPONENT] = { numColorComponents: 1 };
  f[DEPTH_STENCIL] = { numColorComponents: 2 };
}

const textureInternalFormatInfo = {};
{
  const t = textureInternalFormatInfo;
  // unsized formats
  t[ALPHA] = { textureFormat: ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [1, 2, 2, 4], type: [UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT] };
  t[LUMINANCE] = { textureFormat: LUMINANCE, colorRenderable: true, textureFilterable: true, bytesPerElement: [1, 2, 2, 4], type: [UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT] };
  t[LUMINANCE_ALPHA] = { textureFormat: LUMINANCE_ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [2, 4, 4, 8], type: [UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT] };
  t[RGB] = { textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [3, 6, 6, 12, 2], type: [UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT, UNSIGNED_SHORT_5_6_5] };
  t[RGBA] = { textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4, 8, 8, 16, 2, 2], type: [UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT, UNSIGNED_SHORT_4_4_4_4, UNSIGNED_SHORT_5_5_5_1] };

  // sized formats
  t[R8] = { textureFormat: RED, colorRenderable: true, textureFilterable: true, bytesPerElement: 1, type: UNSIGNED_BYTE };
  t[R8_SNORM] = { textureFormat: RED, colorRenderable: false, textureFilterable: true, bytesPerElement: 1, type: BYTE };
  t[R16F] = { textureFormat: RED, colorRenderable: false, textureFilterable: true, bytesPerElement: [4, 2], type: [FLOAT, HALF_FLOAT] };
  t[R32F] = { textureFormat: RED, colorRenderable: false, textureFilterable: false, bytesPerElement: 4, type: FLOAT };
  t[R8UI] = { textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: UNSIGNED_BYTE };
  t[R8I] = { textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: BYTE };
  t[R16UI] = { textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: UNSIGNED_SHORT };
  t[R16I] = { textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: SHORT };
  t[R32UI] = { textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT };
  t[R32I] = { textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: INT };
  t[RG8] = { textureFormat: RG, colorRenderable: true, textureFilterable: true, bytesPerElement: 2, type: UNSIGNED_BYTE };
  t[RG8_SNORM] = { textureFormat: RG, colorRenderable: false, textureFilterable: true, bytesPerElement: 2, type: BYTE };
  t[RG16F] = { textureFormat: RG, colorRenderable: false, textureFilterable: true, bytesPerElement: [8, 4], type: [FLOAT, HALF_FLOAT] };
  t[RG32F] = { textureFormat: RG, colorRenderable: false, textureFilterable: false, bytesPerElement: 8, type: FLOAT };
  t[RG8UI] = { textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: UNSIGNED_BYTE };
  t[RG8I] = { textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: BYTE };
  t[RG16UI] = { textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_SHORT };
  t[RG16I] = { textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: SHORT };
  t[RG32UI] = { textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: UNSIGNED_INT };
  t[RG32I] = { textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: INT };
  t[RGB8] = { textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: 3, type: UNSIGNED_BYTE };
  t[SRGB8] = { textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: UNSIGNED_BYTE };
  t[RGB565] = { textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [3, 2], type: [UNSIGNED_BYTE, UNSIGNED_SHORT_5_6_5] };
  t[RGB8_SNORM] = { textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: BYTE };
  t[R11F_G11F_B10F] = { textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [12, 6, 4], type: [FLOAT, HALF_FLOAT, UNSIGNED_INT_10F_11F_11F_REV] };
  t[RGB9_E5] = { textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [12, 6, 4], type: [FLOAT, HALF_FLOAT, UNSIGNED_INT_5_9_9_9_REV] };
  t[RGB16F] = { textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [12, 6], type: [FLOAT, HALF_FLOAT] };
  t[RGB32F] = { textureFormat: RGB, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: FLOAT };
  t[RGB8UI] = { textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: UNSIGNED_BYTE };
  t[RGB8I] = { textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: BYTE };
  t[RGB16UI] = { textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: UNSIGNED_SHORT };
  t[RGB16I] = { textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: SHORT };
  t[RGB32UI] = { textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: UNSIGNED_INT };
  t[RGB32I] = { textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: INT };
  t[RGBA8] = { textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_BYTE };
  t[SRGB8_ALPHA8] = { textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_BYTE };
  t[RGBA8_SNORM] = { textureFormat: RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: 4, type: BYTE };
  t[RGB5_A1] = { textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4, 2, 4], type: [UNSIGNED_BYTE, UNSIGNED_SHORT_5_5_5_1, UNSIGNED_INT_2_10_10_10_REV] };
  t[RGBA4] = { textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [4, 2], type: [UNSIGNED_BYTE, UNSIGNED_SHORT_4_4_4_4] };
  t[RGB10_A2] = { textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_INT_2_10_10_10_REV };
  t[RGBA16F] = { textureFormat: RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: [16, 8], type: [FLOAT, HALF_FLOAT] };
  t[RGBA32F] = { textureFormat: RGBA, colorRenderable: false, textureFilterable: false, bytesPerElement: 16, type: FLOAT };
  t[RGBA8UI] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_BYTE };
  t[RGBA8I] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: BYTE };
  t[RGB10_A2UI] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT_2_10_10_10_REV };
  t[RGBA16UI] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: UNSIGNED_SHORT };
  t[RGBA16I] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: SHORT };
  t[RGBA32I] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: INT };
  t[RGBA32UI] = { textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: UNSIGNED_INT };
  // Sized Internal
  t[DEPTH_COMPONENT16] = { textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [2, 4], type: [UNSIGNED_SHORT, UNSIGNED_INT] };
  t[DEPTH_COMPONENT24] = { textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT };
  t[DEPTH_COMPONENT32F] = { textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: FLOAT };
  t[DEPTH24_STENCIL8] = { textureFormat: DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT_24_8 };
  t[DEPTH32F_STENCIL8] = { textureFormat: DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: FLOAT_32_UNSIGNED_INT_24_8_REV };

  Object.keys(t).forEach(function(internalFormat) {
    const info = t[internalFormat];
    info.bytesPerElementMap = {};
    if (Array.isArray(info.bytesPerElement)) {
      info.bytesPerElement.forEach(function(bytesPerElement, ndx) {
        const type = info.type[ndx];
        info.bytesPerElementMap[type] = bytesPerElement;
      });
    } else {
      const type = info.type;
      info.bytesPerElementMap[type] = info.bytesPerElement;
    }
  });
}

function getBytesPerElementForInternalFormat(internalFormat, type) {
  const info = textureInternalFormatInfo[internalFormat];
  if (!info) {
    throw "unknown internal format";
  }
  const bytesPerElement = info.bytesPerElementMap[type];
  if (bytesPerElement === undefined) {
    throw "unknown internal format";
  }
  return bytesPerElement;
}

function getFormatAndTypeForInternalFormat(internalFormat) {
  const info = textureInternalFormatInfo[internalFormat];
  if (!info) {
    throw "unknown internal format";
  }
  return {
    format: info.textureFormat,
    type: Array.isArray(info.type) ? info.type[0] : info.type,
  };
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function canGenerateMipmap(gl, width, height, internalFormat) {
  if (!utils.isWebGL2(gl)) {
    return isPowerOf2(width) && isPowerOf2(height);
  }
  const info = textureInternalFormatInfo[internalFormat];
  if (!info) {
    throw "unknown internal format";
  }
  return info.colorRenderable && info.textureFilterable;
}

function canFilter(internalFormat) {
  const info = textureInternalFormatInfo[internalFormat];
  if (!info) {
    throw "unknown internal format";
  }
  return info.textureFilterable;
}

function getNumComponentsForFormat(format) {
  const info = formatInfo[format];
  if (!info) {
    throw "unknown format: " + format;
  }
  return info.numColorComponents;
}

function getTextureTypeForArrayType(gl, src, defaultType) {
  if (isArrayBuffer(src)) {
    return typedArrays.getGLTypeForTypedArray(src);
  }
  return defaultType || gl.UNSIGNED_BYTE;
}

function guessDimensions(gl, target, width, height, numElements) {
  if (numElements % 1 !== 0) {
    throw "can't guess dimensions";
  }
  if (!width && !height) {
    var size = Math.sqrt(numElements / (target === gl.TEXTURE_CUBE_MAP ? 6 : 1));
    if (size % 1 === 0) {
      width = size;
      height = size;
    } else {
      width = numElements;
      height = 1;
    }
  } else if (!height) {
    height = numElements / width;
    if (height % 1) {
      throw "can't guess dimensions";
    }
  } else if (!width) {
    width = numElements / height;
    if (width % 1) {
      throw "can't guess dimensions";
    }
  }
  return {
    width: width,
    height: height,
  };
}

function setDefaultTextureColor(color) {
  defaults.textureColor = new Uint8Array([color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255]);
}

function setDefaults(newDefaults) {
  utils.copyExistingProperties(newDefaults, defaults);
  if (newDefaults.textureColor) {
    setDefaultTextureColor(newDefaults.textureColor);
  }
}

var glEnumToString = (function() {
  var enums;

  function init(gl) {
    if (!enums) {
      enums = {};
      for (var key in gl) {
        if (typeof gl[key] === 'number') {
          enums[gl[key]] = key;
        }
      }
    }
  }
  return function glEnumToString(gl, value) {
    init(gl);
    return enums[value] || ("0x" + value.toString(16));
  };
}());

var lastPackState = {};

function savePackState(gl, options) {
  if (options.colorspaceConversion !== undefined) {
    lastPackState.colorspaceConversion = gl.getParameter(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, options.colorspaceConversion);
  }
  if (options.premultiplyAlpha !== undefined) {
    lastPackState.premultiplyAlpha = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha);
  }
  if (options.flipY !== undefined) {
    lastPackState.flipY = gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.flipY);
  }
}

function restorePackState(gl, options) {
  if (options.colorspaceConversion !== undefined) {
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, lastPackState.colorspaceConversion);
  }
  if (options.premultiplyAlpha !== undefined) {
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, lastPackState.premultiplyAlpha);
  }
  if (options.flipY !== undefined) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, lastPackState.flipY);
  }
}

var WebGLSamplerCtor = window.WebGLSampler || function NotWebGLSampler() {};

function setTextureSamplerParameters(gl, target, parameteriFn, options) {
  if (options.minMag) {
    parameteriFn.call(gl, target, gl.TEXTURE_MIN_FILTER, options.minMag);
    parameteriFn.call(gl, target, gl.TEXTURE_MAG_FILTER, options.minMag);
  }
  if (options.min) {
    parameteriFn.call(gl, target, gl.TEXTURE_MIN_FILTER, options.min);
  }
  if (options.mag) {
    parameteriFn.call(gl, target, gl.TEXTURE_MAG_FILTER, options.mag);
  }
  if (options.wrap) {
    parameteriFn.call(gl, target, gl.TEXTURE_WRAP_S, options.wrap);
    parameteriFn.call(gl, target, gl.TEXTURE_WRAP_T, options.wrap);
    if (target === gl.TEXTURE_3D || target instanceof WebGLSamplerCtor) {
      parameteriFn.call(gl, target, gl.TEXTURE_WRAP_R, options.wrap);
    }
  }
  if (options.wrapR) {
    parameteriFn.call(gl, target, gl.TEXTURE_WRAP_R, options.wrapR);
  }
  if (options.wrapS) {
    parameteriFn.call(gl, target, gl.TEXTURE_WRAP_S, options.wrapS);
  }
  if (options.wrapT) {
    parameteriFn.call(gl, target, gl.TEXTURE_WRAP_T, options.wrapT);
  }
  if (options.minLod) {
    parameteriFn.call(gl, target, gl.TEXTURE_MIN_LOD, options.minLod);
  }
  if (options.maxLod) {
    parameteriFn.call(gl, target, gl.TEXTURE_MAX_LOD, options.maxLod);
  }
  if (options.baseLevel) {
    parameteriFn.call(gl, target, gl.TEXTURE_BASE_LEVEL, options.baseLevel);
  }
  if (options.maxLevel) {
    parameteriFn.call(gl, target, gl.TEXTURE_MAX_LEVEL, options.maxLevel);
  }
}

function setTextureParameters(gl, tex, options) {
  var target = options.target || gl.TEXTURE_2D;
  gl.bindTexture(target, tex);
  setTextureSamplerParameters(gl, target, gl.texParameteri, options);
}

function setSamplerParameters(gl, sampler, options) {
  setTextureSamplerParameters(gl, sampler, gl.samplerParameteri, options);
}

function createSampler(gl, options) {
  const sampler = gl.createSampler();
  setSamplerParameters(gl, sampler, options);
  return sampler;
}

function createSamplers(gl, samplerOptions) {
  const samplers = {};
  Object.keys(samplerOptions).forEach(function(name) {
    samplers[name] = createSampler(gl, samplerOptions[name]);
  });
  return samplers;
}

function make1Pixel(color) {
  color = color || defaults.textureColor;
  if (isArrayBuffer(color)) {
    return color;
  }
  return new Uint8Array([color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255]);
}

function setTextureFilteringForSize(gl, tex, options, width, height, internalFormat, type) {
  options = options || defaults.textureOptions;
  internalFormat = internalFormat || gl.RGBA;
  type = type || gl.UNSIGNED_BYTE;
  var target = options.target || gl.TEXTURE_2D;
  width = width || options.width;
  height = height || options.height;
  gl.bindTexture(target, tex);
  if (canGenerateMipmap(gl, width, height, internalFormat, type)) {
    gl.generateMipmap(target);
  } else {
    const filtering = canFilter(internalFormat, type) ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, filtering);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filtering);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
}

function getCubeFaceOrder(gl, options) {
  options = options || {};
  return options.cubeFaceOrder || [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];
}

function getCubeFacesWithNdx(gl, options) {
  var faces = getCubeFaceOrder(gl, options);
  var facesWithNdx = faces.map(function(face, ndx) {
    return { face: face, ndx: ndx };
  });
  facesWithNdx.sort(function(a, b) {
    return a.face - b.face;
  });
  return facesWithNdx;
}

function setTextureFromElement(gl, tex, element, options) {
  options = options || defaults.textureOptions;
  var target = options.target || gl.TEXTURE_2D;
  var width = element.width;
  var height = element.height;
  var internalFormat = options.internalFormat || options.format || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var format = options.format || formatType.format;
  var type = options.type || formatType.type;
  savePackState(gl, options);
  gl.bindTexture(target, tex);
  if (target === gl.TEXTURE_CUBE_MAP) {
    // guess the parts
    var imgWidth  = element.width;
    var imgHeight = element.height;
    var size;
    var slices;
    if (imgWidth / 6 === imgHeight) {
      // It's 6x1
      size = imgHeight;
      slices = [0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0];
    } else if (imgHeight / 6 === imgWidth) {
      // It's 1x6
      size = imgWidth;
      slices = [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5];
    } else if (imgWidth / 3 === imgHeight / 2) {
      // It's 3x2
      size = imgWidth / 3;
      slices = [0, 0, 1, 0, 2, 0, 0, 1, 1, 1, 2, 1];
    } else if (imgWidth / 2 === imgHeight / 3) {
      // It's 2x3
      size = imgWidth / 2;
      slices = [0, 0, 1, 0, 0, 1, 1, 1, 0, 2, 1, 2];
    } else {
      throw "can't figure out cube map from element: " + (element.src ? element.src : element.nodeName);
    }
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    width = size;
    height = size;
    getCubeFacesWithNdx(gl, options).forEach(function(f) {
      var xOffset = slices[f.ndx * 2 + 0] * size;
      var yOffset = slices[f.ndx * 2 + 1] * size;
      ctx.drawImage(element, xOffset, yOffset, size, size, 0, 0, size, size);
      gl.texImage2D(f.face, 0, internalFormat, format, type, ctx.canvas);
    });
    ctx.canvas.width = 1;
    ctx.canvas.height = 1;
  } else if (target === gl.TEXTURE_3D) {
    var smallest = Math.min(element.width, element.height);
    var largest = Math.max(element.width, element.height);
    var depth = largest / smallest;
    if (depth % 1 !== 0) {
      throw "can not compute 3D dimensions of element";
    }
    var xMult = element.width  === largest ? 1 : 0;
    var yMult = element.height === largest ? 1 : 0;
    gl.texImage3D(target, 0, internalFormat, smallest, smallest, smallest, 0, format, type, null);
    ctx.canvas.width = smallest;
    ctx.canvas.height = smallest;
    for (var d = 0; d < depth; ++d) {
        var srcX = d * smallest * xMult;
        var srcY = d * smallest * yMult;
        var srcW = smallest;
        var srcH = smallest;
        var dstX = 0;
        var dstY = 0;
        var dstW = smallest;
        var dstH = smallest;
        ctx.drawImage(element, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
        gl.texSubImage3D(target, 0, 0, 0, d, smallest, smallest, 1, format, type, ctx.canvas);
    }
    ctx.canvas.width = 0;
    ctx.canvas.height = 0;
  } else {
    gl.texImage2D(target, 0, internalFormat, format, type, element);
  }
  restorePackState(gl, options);
  if (options.auto !== false) {
    setTextureFilteringForSize(gl, tex, options, width, height, internalFormat, type);
  }
  setTextureParameters(gl, tex, options);
}

function noop() {
}

function loadImage(url, crossOrigin, callback) {
  callback = callback || noop;
  var img = new Image();
  crossOrigin = crossOrigin !== undefined ? crossOrigin : defaults.crossOrigin;
  if (crossOrigin !== undefined) {
    img.crossOrigin = crossOrigin;
  }

  function clearEventHandlers() {
    img.removeEventListener('error', onError);
    img.removeEventListener('load', onLoad);
    img = null;
  }

  function onError() {
    var msg = "couldn't load image: " + url;
    utils.error(msg);
    callback(msg, img);
    clearEventHandlers();
  }

  function onLoad() {
    callback(null, img);
    clearEventHandlers();
  }

  img.addEventListener('error', onError);
  img.addEventListener('load', onLoad);
  img.src = url;
  return img;
}

function setTextureTo1PixelColor(gl, tex, options) {
  options = options || defaults.textureOptions;
  var target = options.target || gl.TEXTURE_2D;
  gl.bindTexture(target, tex);
  if (options.color === false) {
    return;
  }
  var color = make1Pixel(options.color);
  if (target === gl.TEXTURE_CUBE_MAP) {
    for (var ii = 0; ii < 6; ++ii) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + ii, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color);
    }
  } else if (target === gl.TEXTURE_3D || target === gl.TEXTURE_2D_ARRAY) {
    gl.texImage3D(target, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color);
  } else {
    gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color);
  }
}

function loadTextureFromUrl(gl, tex, options, callback) {
  callback = callback || noop;
  options = options || defaults.textureOptions;
  setTextureTo1PixelColor(gl, tex, options);
  options = utils.shallowCopy(options);
  var img = loadImage(options.src, options.crossOrigin, function(err, img) {
    if (err) {
      callback(err, tex, img);
    } else {
      setTextureFromElement(gl, tex, img, options);
      callback(null, tex, img);
    }
  });
  return img;
}

function loadCubemapFromUrls(gl, tex, options, callback) {
  callback = callback || noop;
  var urls = options.src;
  if (urls.length !== 6) {
    throw "there must be 6 urls for a cubemap";
  }
  var internalFormat = options.internalFormat || options.format || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var format = options.format || formatType.format;
  var type = options.type || gl.UNSIGNED_BYTE;
  var target = options.target || gl.TEXTURE_2D;
  if (target !== gl.TEXTURE_CUBE_MAP) {
    throw "target must be TEXTURE_CUBE_MAP";
  }
  setTextureTo1PixelColor(gl, tex, options);
  options = utils.shallowCopy(options);
  var numToLoad = 6;
  var errors = [];
  var imgs;
  var faces = getCubeFaceOrder(gl, options);

  function uploadImg(faceTarget) {
    return function(err, img) {
      --numToLoad;
      if (err) {
        errors.push(err);
      } else {
        if (img.width !== img.height) {
          errors.push("cubemap face img is not a square: " + img.src);
        } else {
          savePackState(gl, options);
          gl.bindTexture(target, tex);
          if (numToLoad === 5) {
            getCubeFaceOrder(gl).forEach(function(otherTarget) {
              gl.texImage2D(otherTarget, 0, internalFormat, format, type, img);
            });
          } else {
            gl.texImage2D(faceTarget, 0, internalFormat, format, type, img);
          }
          restorePackState(gl, options);
          gl.generateMipmap(target);
        }
      }
      if (numToLoad === 0) {
        callback(errors.length ? errors : undefined, imgs, tex);
      }
    };
  }
  imgs = urls.map(function(url, ndx) {
    return loadImage(url, options.crossOrigin, uploadImg(faces[ndx]));
  });
}

function loadSlicesFromUrls(gl, tex, options, callback) {
  callback = callback || noop;
  var urls = options.src;
  var internalFormat = options.internalFormat || options.format || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var format = options.format || formatType.format;
  var type = options.type || gl.UNSIGNED_BYTE;
  var target = options.target || gl.TEXTURE_2D_ARRAY;
  if (target !== gl.TEXTURE_3D && target !== gl.TEXTURE_2D_ARRAY) {
    throw "target must be TEXTURE_3D or TEXTURE_2D_ARRAY";
  }
  setTextureTo1PixelColor(gl, tex, options);
  options = utils.shallowCopy(options);
  var numToLoad = urls.length;
  var errors = [];
  var imgs;
  var width = options.width;
  var height = options.height;
  var depth = urls.length;
  var firstImage = true;
  function uploadImg(slice) {
    return function(err, img) {
      --numToLoad;
      if (err) {
        errors.push(err);
      } else {
        savePackState(gl, options);
        gl.bindTexture(target, tex);
        if (firstImage) {
          firstImage = false;
          width = options.width || img.width;
          height = options.height || img.height;
          gl.texImage3D(target, 0, internalFormat, width, height, depth, 0, format, type, null);
          for (var s = 0; s < depth; ++s) {
            gl.texSubImage3D(target, 0, 0, 0, s, width, height, 1, format, type, img);
          }
        } else {
          var src = img;
          if (img.width !== width || img.height !== height) {
            src = ctx.canvas;
            ctx.canvas.width = width;
            ctx.canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
          }
          gl.texSubImage3D(target, 0, 0, 0, slice, width, height, 1, format, type, src);
          if (src === ctx.canvas) {
            ctx.canvas.width = 0;
            ctx.canvas.height = 0;
          }
        }
        restorePackState(gl, options);
        gl.generateMipmap(target);
      }
      if (numToLoad === 0) {
        callback(errors.length ? errors : undefined, imgs, tex);
      }
    };
  }
  imgs = urls.map(function(url, ndx) {
    return loadImage(url, options.crossOrigin, uploadImg(ndx));
  });
}

function setTextureFromArray(gl, tex, src, options) {
  options = options || defaults.textureOptions;
  var target = options.target || gl.TEXTURE_2D;
  gl.bindTexture(target, tex);
  var width = options.width;
  var height = options.height;
  var depth = options.depth;
  var internalFormat = options.internalFormat || options.format || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var format = options.format || formatType.format;
  var type = options.type || getTextureTypeForArrayType(gl, src, formatType.type);
  if (!isArrayBuffer(src)) {
    var Type = typedArrays.getTypedArrayTypeForGLType(type);
    src = new Type(src);
  } else {
    if (src instanceof Uint8ClampedArray) {
      src = new Uint8Array(src.buffer);
    }
  }
  var bytesPerElement = getBytesPerElementForInternalFormat(internalFormat, type);
  var numElements = src.byteLength / bytesPerElement;
  if (numElements % 1) {
    throw "length wrong size for format: " + glEnumToString(gl, format);
  }
  var dimensions;
  if (target === gl.TEXTURE_3D) {
    if (!width && !height && !depth) {
      var size = Math.cbrt(numElements);
      if (size % 1 !== 0) {
        throw "can't guess cube size of array of numElements: " + numElements;
      }
      width = size;
      height = size;
      depth = size;
    } else if (width && (!height || !depth)) {
      dimensions = guessDimensions(gl, target, height, depth, numElements / width);
      height = dimensions.width;
      depth = dimensions.height;
    } else if (height && (!width || !depth)) {
      dimensions = guessDimensions(gl, target, width, depth, numElements / height);
      width = dimensions.width;
      depth = dimensions.height;
    } else {
      dimensions = guessDimensions(gl, target, width, height, numElements / depth);
      width = dimensions.width;
      height = dimensions.height;
    }
  } else {
    dimensions = guessDimensions(gl, target, width, height, numElements);
    width = dimensions.width;
    height = dimensions.height;
  }
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, options.unpackAlignment || 1);
  savePackState(gl, options);
  if (target === gl.TEXTURE_CUBE_MAP) {
    const elementsPerElement = bytesPerElement / src.BYTES_PER_ELEMENT;
    const faceSize = numElements / 6 * elementsPerElement;
    getCubeFacesWithNdx(gl, options).forEach(f => {
      const offset = faceSize * f.ndx;
      const data = src.subarray(offset, offset + faceSize);
      gl.texImage2D(f.face, 0, internalFormat, width, height, 0, format, type, data);
    });
  } else if (target === gl.TEXTURE_3D) {
    gl.texImage3D(target, 0, internalFormat, width, height, depth, 0, format, type, src);
  } else {
    gl.texImage2D(target, 0, internalFormat, width, height, 0, format, type, src);
  }
  restorePackState(gl, options);
  return { width, height, depth, type };
}

function setEmptyTexture(gl, tex, options) {
  var target = options.target || gl.TEXTURE_2D;
  gl.bindTexture(target, tex);
  var internalFormat = options.internalFormat || options.format || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var format = options.format || formatType.format;
  var type = options.type || formatType.type;
  savePackState(gl, options);
  if (target === gl.TEXTURE_CUBE_MAP) {
    for (var ii = 0; ii < 6; ++ii) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + ii, 0, internalFormat, options.width, options.height, 0, format, type, null);
    }
  } else if (target === gl.TEXTURE_3D) {
    gl.texImage3D(target, 0, internalFormat, options.width, options.height, options.depth, 0, format, type, null);
  } else {
    gl.texImage2D(target, 0, internalFormat, options.width, options.height, 0, format, type, null);
  }
  restorePackState(gl, options);
}

function createTexture(gl, options, callback) {
  callback = callback || noop;
  options = options || defaults.textureOptions;
  var tex = gl.createTexture();
  var target = options.target || gl.TEXTURE_2D;
  var width  = options.width  || 1;
  var height = options.height || 1;
  var internalFormat = options.internalFormat || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var type = options.type || formatType.type;
  gl.bindTexture(target, tex);
  if (target === gl.TEXTURE_CUBE_MAP) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  var src = options.src;
  if (src) {
    if (typeof src === "function") {
      src = src(gl, options);
    }
    if (typeof (src) === "string") {
      loadTextureFromUrl(gl, tex, options, callback);
    } else if (isArrayBuffer(src) ||
               (Array.isArray(src) && (
                    typeof src[0] === 'number' ||
                    Array.isArray(src[0]) ||
                    isArrayBuffer(src[0]))
               )
              ) {
      var dimensions = setTextureFromArray(gl, tex, src, options);
      width  = dimensions.width;
      height = dimensions.height;
      type   = dimensions.type;
    } else if (Array.isArray(src) && typeof (src[0]) === 'string') {
      if (target === gl.TEXTURE_CUBE_MAP) {
        loadCubemapFromUrls(gl, tex, options, callback);
      } else {
        loadSlicesFromUrls(gl, tex, options, callback);
      }
    } else if (src instanceof HTMLElement) {
      setTextureFromElement(gl, tex, src, options);
      width  = src.width;
      height = src.height;
    } else {
      throw "unsupported src type";
    }
  } else {
    setEmptyTexture(gl, tex, options);
  }
  if (options.auto !== false) {
    setTextureFilteringForSize(gl, tex, options, width, height, internalFormat, type);
  }
  setTextureParameters(gl, tex, options);
  return tex;
}

function resizeTexture(gl, tex, options, width, height) {
  width = width || options.width;
  height = height || options.height;
  var target = options.target || gl.TEXTURE_2D;
  gl.bindTexture(target, tex);
  var internalFormat = options.internalFormat || options.format || gl.RGBA;
  var formatType = getFormatAndTypeForInternalFormat(internalFormat);
  var format = options.format || formatType.format;
  var type;
  var src = options.src;
  if (!src) {
    type = options.type || formatType.type;
  } else if (isArrayBuffer(src) || (Array.isArray(src) && typeof (src[0]) === 'number')) {
    type = options.type || getTextureTypeForArrayType(gl, src, formatType.type);
  } else {
    type = options.type || formatType.type;
  }
  if (target === gl.TEXTURE_CUBE_MAP) {
    for (var ii = 0; ii < 6; ++ii) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + ii, 0, format, width, height, 0, format, type, null);
    }
  } else {
    gl.texImage2D(target, 0, format, width, height, 0, format, type, null);
  }
}

function isAsyncSrc(src) {
  return typeof src === 'string' ||
         (Array.isArray(src) && typeof src[0] === 'string');
}

function createTextures(gl, textureOptions, callback) {
  callback = callback || noop;
  var numDownloading = 0;
  var errors = [];
  var textures = {};
  var images = {};
  function callCallbackIfReady() {
    if (numDownloading === 0) {
      setTimeout(function() {
        callback(errors.length ? errors : undefined, textures, images);
      }, 0);
    }
  }
  Object.keys(textureOptions).forEach(function(name) {
    var options = textureOptions[name];
    var onLoadFn;
    if (isAsyncSrc(options.src)) {
      onLoadFn = function(err, tex, img) {
        images[name] = img;
        --numDownloading;
        if (err) {
          errors.push(err);
        }
        callCallbackIfReady();
      };
      ++numDownloading;
    }
    textures[name] = createTexture(gl, options, onLoadFn);
  });
  callCallbackIfReady();
  return textures;
}

export default {
  setDefaults_: setDefaults,
  createSampler,
  createSamplers,
  setSamplerParameters,
  createTexture,
  setEmptyTexture,
  setTextureFromArray,
  loadTextureFromUrl,
  setTextureFromElement,
  setTextureFilteringForSize,
  setTextureParameters,
  setDefaultTextureColor,
  createTextures,
  resizeTexture,
  getNumComponentsForFormat,
  getBytesPerElementForInternalFormat,
};
