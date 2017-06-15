import utils from './utils.js';

var error = utils.error;
var warn = utils.warn;

var FLOAT                         = 0x1406;
var FLOAT_VEC2                    = 0x8B50;
var FLOAT_VEC3                    = 0x8B51;
var FLOAT_VEC4                    = 0x8B52;
var INT                           = 0x1404;
var INT_VEC2                      = 0x8B53;
var INT_VEC3                      = 0x8B54;
var INT_VEC4                      = 0x8B55;
var BOOL                          = 0x8B56;
var BOOL_VEC2                     = 0x8B57;
var BOOL_VEC3                     = 0x8B58;
var BOOL_VEC4                     = 0x8B59;
var FLOAT_MAT2                    = 0x8B5A;
var FLOAT_MAT3                    = 0x8B5B;
var FLOAT_MAT4                    = 0x8B5C;
var SAMPLER_2D                    = 0x8B5E;
var SAMPLER_CUBE                  = 0x8B60;
var SAMPLER_3D                    = 0x8B5F;
var SAMPLER_2D_SHADOW             = 0x8B62;
var FLOAT_MAT2x3                  = 0x8B65;
var FLOAT_MAT2x4                  = 0x8B66;
var FLOAT_MAT3x2                  = 0x8B67;
var FLOAT_MAT3x4                  = 0x8B68;
var FLOAT_MAT4x2                  = 0x8B69;
var FLOAT_MAT4x3                  = 0x8B6A;
var SAMPLER_2D_ARRAY              = 0x8DC1;
var SAMPLER_2D_ARRAY_SHADOW       = 0x8DC4;
var SAMPLER_CUBE_SHADOW           = 0x8DC5;
var UNSIGNED_INT                  = 0x1405;
var UNSIGNED_INT_VEC2             = 0x8DC6;
var UNSIGNED_INT_VEC3             = 0x8DC7;
var UNSIGNED_INT_VEC4             = 0x8DC8;
var INT_SAMPLER_2D                = 0x8DCA;
var INT_SAMPLER_3D                = 0x8DCB;
var INT_SAMPLER_CUBE              = 0x8DCC;
var INT_SAMPLER_2D_ARRAY          = 0x8DCF;
var UNSIGNED_INT_SAMPLER_2D       = 0x8DD2;
var UNSIGNED_INT_SAMPLER_3D       = 0x8DD3;
var UNSIGNED_INT_SAMPLER_CUBE     = 0x8DD4;
var UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

var TEXTURE_2D                    = 0x0DE1;
var TEXTURE_CUBE_MAP              = 0x8513;
var TEXTURE_3D                    = 0x806F;
var TEXTURE_2D_ARRAY              = 0x8C1A;

var typeMap = {};

function getBindPointForSamplerType(gl, type) {
  return typeMap[type].bindPoint;
}

function floatSetter(gl, location) {
  return function(v) {
    gl.uniform1f(location, v);
  };
}

function floatArraySetter(gl, location) {
  return function(v) {
    gl.uniform1fv(location, v);
  };
}

function floatVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2fv(location, v);
  };
}

function floatVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3fv(location, v);
  };
}

function floatVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4fv(location, v);
  };
}

function intSetter(gl, location) {
  return function(v) {
    gl.uniform1i(location, v);
  };
}

function intArraySetter(gl, location) {
  return function(v) {
    gl.uniform1iv(location, v);
  };
}

function intVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2iv(location, v);
  };
}

function intVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3iv(location, v);
  };
}

function intVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4iv(location, v);
  };
}

function uintSetter(gl, location) {
  return function(v) {
    gl.uniform1ui(location, v);
  };
}

function uintArraySetter(gl, location) {
  return function(v) {
    gl.uniform1uiv(location, v);
  };
}

function uintVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2uiv(location, v);
  };
}

function uintVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3uiv(location, v);
  };
}

function uintVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4uiv(location, v);
  };
}

function floatMat2Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2fv(location, false, v);
  };
}

function floatMat3Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3fv(location, false, v);
  };
}

function floatMat4Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4fv(location, false, v);
  };
}

function floatMat23Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2x3fv(location, false, v);
  };
}

function floatMat32Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3x2fv(location, false, v);
  };
}

function floatMat24Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2x4fv(location, false, v);
  };
}

function floatMat42Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4x2fv(location, false, v);
  };
}

function floatMat34Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3x4fv(location, false, v);
  };
}

function floatMat43Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4x3fv(location, false, v);
  };
}

function samplerSetter(gl, type, unit, location) {
  var bindPoint = getBindPointForSamplerType(gl, type);
  return utils.isWebGL2(gl) ? function(textureOrPair) {
    let texture;
    let sampler;
    if (textureOrPair instanceof WebGLTexture) {
      texture = textureOrPair;
      sampler = null;
    } else {
      texture = textureOrPair.texture;
      sampler = textureOrPair.sampler;
    }
    gl.uniform1i(location, unit);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
    gl.bindSampler(unit, sampler);
  } : function(texture) {
    gl.uniform1i(location, unit);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
  };
}

function samplerArraySetter(gl, type, unit, location, size) {
  var bindPoint = getBindPointForSamplerType(gl, type);
  var units = new Int32Array(size);
  for (var ii = 0; ii < size; ++ii) {
    units[ii] = unit + ii;
  }
  return utils.isWebGL2(gl) ? function(textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function(textureOrPair, index) {
      gl.activeTexture(gl.TEXTURE0 + units[index]);
      let texture;
      let sampler;
      if (textureOrPair instanceof WebGLTexture) {
        texture = textureOrPair;
        sampler = null;
      } else {
        texture = textureOrPair.texture;
        sampler = textureOrPair.sampler;
      }
      gl.bindSampler(unit, sampler);
      gl.bindTexture(bindPoint, texture);
    });
  } : function(textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function(texture, index) {
      gl.activeTexture(gl.TEXTURE0 + units[index]);
      gl.bindTexture(bindPoint, texture);
    });
  };
}

typeMap[FLOAT] = { Type: Float32Array, size: 4, setter: floatSetter, arraySetter: floatArraySetter };
typeMap[FLOAT_VEC2] = { Type: Float32Array, size: 8, setter: floatVec2Setter };
typeMap[FLOAT_VEC3] = { Type: Float32Array, size: 12, setter: floatVec3Setter };
typeMap[FLOAT_VEC4] = { Type: Float32Array, size: 16, setter: floatVec4Setter };
typeMap[INT] = { Type: Int32Array, size: 4, setter: intSetter, arraySetter: intArraySetter };
typeMap[INT_VEC2] = { Type: Int32Array, size: 8, setter: intVec2Setter };
typeMap[INT_VEC3] = { Type: Int32Array, size: 12, setter: intVec3Setter };
typeMap[INT_VEC4] = { Type: Int32Array, size: 16, setter: intVec4Setter };
typeMap[UNSIGNED_INT] = { Type: Uint32Array, size: 4, setter: uintSetter, arraySetter: uintArraySetter };
typeMap[UNSIGNED_INT_VEC2] = { Type: Uint32Array, size: 8, setter: uintVec2Setter };
typeMap[UNSIGNED_INT_VEC3] = { Type: Uint32Array, size: 12, setter: uintVec3Setter };
typeMap[UNSIGNED_INT_VEC4] = { Type: Uint32Array, size: 16, setter: uintVec4Setter };
typeMap[BOOL] = { Type: Uint32Array, size: 4, setter: intSetter, arraySetter: intArraySetter };
typeMap[BOOL_VEC2] = { Type: Uint32Array, size: 8, setter: intVec2Setter };
typeMap[BOOL_VEC3] = { Type: Uint32Array, size: 12, setter: intVec3Setter };
typeMap[BOOL_VEC4] = { Type: Uint32Array, size: 16, setter: intVec4Setter };
typeMap[FLOAT_MAT2] = { Type: Float32Array, size: 16, setter: floatMat2Setter };
typeMap[FLOAT_MAT3] = { Type: Float32Array, size: 36, setter: floatMat3Setter };
typeMap[FLOAT_MAT4] = { Type: Float32Array, size: 64, setter: floatMat4Setter };
typeMap[FLOAT_MAT2x3] = { Type: Float32Array, size: 24, setter: floatMat23Setter };
typeMap[FLOAT_MAT2x4] = { Type: Float32Array, size: 32, setter: floatMat24Setter };
typeMap[FLOAT_MAT3x2] = { Type: Float32Array, size: 24, setter: floatMat32Setter };
typeMap[FLOAT_MAT3x4] = { Type: Float32Array, size: 48, setter: floatMat34Setter };
typeMap[FLOAT_MAT4x2] = { Type: Float32Array, size: 32, setter: floatMat42Setter };
typeMap[FLOAT_MAT4x3] = { Type: Float32Array, size: 48, setter: floatMat43Setter };
typeMap[SAMPLER_2D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D };
typeMap[SAMPLER_CUBE] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP };
typeMap[SAMPLER_3D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D };
typeMap[SAMPLER_2D_SHADOW] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,       };
typeMap[SAMPLER_2D_ARRAY] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[SAMPLER_2D_ARRAY_SHADOW] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[SAMPLER_CUBE_SHADOW] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[INT_SAMPLER_2D] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,       };
typeMap[INT_SAMPLER_3D] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[INT_SAMPLER_CUBE] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[INT_SAMPLER_2D_ARRAY] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[UNSIGNED_INT_SAMPLER_2D] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,       };
typeMap[UNSIGNED_INT_SAMPLER_3D] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[UNSIGNED_INT_SAMPLER_CUBE] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[UNSIGNED_INT_SAMPLER_2D_ARRAY] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };

function floatAttribSetter(gl, index) {
  return (b) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.FLOAT,
      b.normalize || false,
      b.stride || 0,
      b.offset || 0,
    );
  };
}

function intAttribSetter(gl, index) {
  return (b) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribIPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.INT,
      b.stride || 0,
      b.offset || 0,
    );
  };
}

function matAttribSetter(gl, index, typeInfo) {
  var defaultSize = typeInfo.size;
  var count = typeInfo.count;
  return function(b) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
    var numComponents = b.size || b.numComponents || defaultSize;
    var size = numComponents / count;
    var type = b.type || gl.FLOAT;
    var typeInfo = typeMap[type];
    var stride = typeInfo.size * numComponents;
    var normalize = b.normalize || false;
    var offset = b.offset || 0;
    var rowOffset = stride / count;
    for (var i = 0; i < count; ++i) {
      gl.enableVertexAttribArray(index + i);
      gl.vertexAttribPointer(
          index + i, size, type, normalize, stride, offset + rowOffset * i);
    }
  };
}

const attrTypeMap = {};
attrTypeMap[FLOAT] = { size: 4, setter: floatAttribSetter };
attrTypeMap[FLOAT_VEC2] = { size: 8, setter: floatAttribSetter };
attrTypeMap[FLOAT_VEC3] = { size: 12, setter: floatAttribSetter };
attrTypeMap[FLOAT_VEC4] = { size: 16, setter: floatAttribSetter };
attrTypeMap[INT] = { size: 4, setter: intAttribSetter };
attrTypeMap[INT_VEC2] = { size: 8, setter: intAttribSetter };
attrTypeMap[INT_VEC3] = { size: 12, setter: intAttribSetter };
attrTypeMap[INT_VEC4] = { size: 16, setter: intAttribSetter };
attrTypeMap[UNSIGNED_INT] = { size: 4, setter: intAttribSetter };
attrTypeMap[UNSIGNED_INT_VEC2] = { size: 8, setter: intAttribSetter };
attrTypeMap[UNSIGNED_INT_VEC3] = { size: 12, setter: intAttribSetter };
attrTypeMap[UNSIGNED_INT_VEC4] = { size: 16, setter: intAttribSetter };
attrTypeMap[BOOL] = { size: 4, setter: intAttribSetter };
attrTypeMap[BOOL_VEC2] = { size: 8, setter: intAttribSetter };
attrTypeMap[BOOL_VEC3] = { size: 12, setter: intAttribSetter };
attrTypeMap[BOOL_VEC4] = { size: 16, setter: intAttribSetter };
attrTypeMap[FLOAT_MAT2] = { size: 4, setter: matAttribSetter, count: 2 };
attrTypeMap[FLOAT_MAT3] = { size: 9, setter: matAttribSetter, count: 3 };
attrTypeMap[FLOAT_MAT4] = { size: 16, setter: matAttribSetter, count: 4 };

function addLineNumbers(src, lineOffset = 0) {
  ++lineOffset;
  return src.split('\n').map((line, ndx) => {
    return (ndx + lineOffset) + ": " + line;
  }).join('\n');
}

var spaceRE = /^[ \t]*\n/;

function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
  var errFn = opt_errorCallback || error;
  var shader = gl.createShader(shaderType);
  var lineOffset = 0;
  if (spaceRE.test(shaderSource)) {
    lineOffset = 1;
    shaderSource = shaderSource.replace(spaceRE, '');
  }
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var lastError = gl.getShaderInfoLog(shader);
    errFn(addLineNumbers(shaderSource, lineOffset) + "\n*** Error compiling shader: " + lastError);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function getProgramOptions(opt_attribs, opt_locations, opt_errorCallback) {
  if (typeof opt_locations === 'function') {
    opt_errorCallback = opt_locations;
    opt_locations = undefined;
  }
  if (typeof opt_attribs === 'function') {
    opt_errorCallback = opt_attribs;
    opt_attribs = undefined;
  } else if (opt_attribs && !Array.isArray(opt_attribs)) {
    if (opt_attribs.errorCallback) return opt_attribs;
    var opt = opt_attribs;
    opt_errorCallback = opt.errorCallback;
    opt_attribs = opt.attribLocations;
    var transformFeedbackVaryings = opt.transformFeedbackVaryings;
  }

  var options = {
    errorCallback: opt_errorCallback || error,
    transformFeedbackVaryings,
  };

  if (opt_attribs) {
    var attribLocations = {};
    if (Array.isArray(opt_attribs)) {
      opt_attribs.forEach((attrib, ndx) => {
        attribLocations[attrib] = opt_locations ? opt_locations[ndx] : ndx;
      });
    } else {
      attribLocations = opt_attribs;
    }
    options.attribLocations = attribLocations;
  }

  return options;
}

const defaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER'];

function getShaderTypeFromScriptType(scriptType) {
  if (scriptType.indexOf('frag') >= 0) {
    return gl.FRAGMENT_SHADER;
  } else if (scriptType.indexOf('vert') >= 0) {
    return gl.VERTEX_SHADER;
  }
  return undefined;
}

function deleteShaders(gl, shaders) {
  shaders.forEach((shader) => {
    gl.deleteShader(shader);
  });
}

function createProgram(
    gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
  var progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  var realShaders = [];
  var newShaders = [];
  for (var ndx = 0; ndx < shaders.length; ++ndx) {
    var shader = shaders[ndx];
    if (typeof (shader) === 'string') {
      const elem = document.getElementById(shader);
      const src = elem ? elem.text : shader;
      var type = gl[defaultShaderType[ndx]];
      if (elem && elem.type) {
        type = getShaderTypeFromScriptType(elem.type) || type;
      }
      shader = loadShader(gl, src, type, progOptions.errorCallback);
      newShaders.push(shader);
    }
    if (shader instanceof WebGLShader) {
      realShaders.push(shader);
    }
  }
  if (realShaders.length !== shaders.length) {
    programOptions.errorCallback("not enough shaders for program");
    deleteShaders(gl, newShaders);
    return null;
  }

  var program = gl.createProgram();
  realShaders.forEach(function(shader) {
    gl.attachShader(program, shader);
  });
  if (progOptions.attribLocations) {
    Object.keys(progOptions.attribLocations).forEach(function(attrib) {
      gl.bindAttribLocation(program, progOptions.attribLocations[attrib], attrib);
    });
  }
  var varyings = progOptions.transformFeedbackVaryings;
  if (varyings) {
    if (varyings.attribs) {
      varyings = varyings.attribs;
    }
    if (!Array.isArray(varyings)) {
      varyings = Object.keys(varyings);
    }
    gl.transformFeedbackVaryings(program, varyings, progOptions.transformFeedbackMode || gl.SEPARATE_ATTRIBS);
  }
  gl.linkProgram(program);
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var lastError = gl.getProgramInfoLog(program);
    progOptions.errorCallback("Error in program linking:" + lastError);
    gl.deleteProgram(program);
    deleteShaders(gl, newShaders);
    return null;
  }
  return program;
}

function createShaderFromScript(
    gl, scriptId, opt_shaderType, opt_errorCallback) {
  var shaderSource = "";
  var shaderScript = document.getElementById(scriptId);
  if (!shaderScript) {
    throw "*** Error: unknown script element" + scriptId;
  }
  shaderSource = shaderScript.text;
  var shaderType = opt_shaderType || getShaderTypeFromScriptType(shaderScript.type);
  if (!shaderType) {
    throw "*** Error: unknown shader type";
  }
  return loadShader(gl, shaderSource, shaderType, opt_errorCallback);
}

function createProgramFromScripts(
    gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
  var progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  var shaders = [];
  for (var ii = 0; ii < shaderScriptIds.length; ++ii) {
    var shader = createShaderFromScript(
        gl, shaderScriptIds[ii], gl[defaultShaderType[ii]], progOptions.errorCallback);
    if (!shader) {
      return null;
    }
    shaders.push(shader);
  }
  return createProgram(gl, shaders, progOptions);
}

function createProgramFromSources(
    gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
  var progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  var shaders = [];
  for (var ii = 0; ii < shaderSources.length; ++ii) {
    var shader = loadShader(
        gl, shaderSources[ii], gl[defaultShaderType[ii]], progOptions.errorCallback);
    if (!shader) {
      return null;
    }
    shaders.push(shader);
  }
  return createProgram(gl, shaders, progOptions);
}

function createUniformSetters(gl, program) {
  var textureUnit = 0;
  function createUniformSetter(program, uniformInfo) {
    var location = gl.getUniformLocation(program, uniformInfo.name);
    var isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === "[0]");
    var type = uniformInfo.type;
    var typeInfo = typeMap[type];
    if (!typeInfo) {
      throw ("unknown type: 0x" + type.toString(16));
    }
    var setter;
    if (typeInfo.bindPoint) {
      var unit = textureUnit;
      textureUnit += uniformInfo.size;
      if (isArray) {
        setter = typeInfo.arraySetter(gl, type, unit, location, uniformInfo.size);
      } else {
        setter = typeInfo.setter(gl, type, unit, location, uniformInfo.size);
      }
    } else {
      if (typeInfo.arraySetter && isArray) {
        setter = typeInfo.arraySetter(gl, location);
      } else {
        setter = typeInfo.setter(gl, location);
      }
    }
    setter.location = location;
    return setter;
  }

  var uniformSetters = { };
  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (var ii = 0; ii < numUniforms; ++ii) {
    var uniformInfo = gl.getActiveUniform(program, ii);
    if (!uniformInfo) break;
    var name = uniformInfo.name;
    if (name.substr(-3) === "[0]") {
      name = name.substr(0, name.length - 3);
    }
    var setter = createUniformSetter(program, uniformInfo);
    uniformSetters[name] = setter;
  }
  return uniformSetters;
}

function createTransformFeedbackInfo(gl, program) {
  var info = {};
  var numVaryings = gl.getProgramParameter(program, gl.TRANSFORM_FEEDBACK_VARYINGS);
  for (var ii = 0; ii < numVaryings; ++ii) {
    var varying = gl.getTransformFeedbackVarying(program, ii);
    info[varying.name] = {
      index: ii,
      type: varying.type,
      size: varying.size,
    };
  }
  return info;
}

function bindTransformFeedbackInfo(gl, transformFeedbackInfo, bufferInfo) {
  if (transformFeedbackInfo.transformFeedbackInfo) {
    transformFeedbackInfo = transformFeedbackInfo.transformFeedbackInfo;
  }
  if (bufferInfo.attribs) {
    bufferInfo = bufferInfo.attribs;
  }
  for (var name in bufferInfo) {
    var varying = transformFeedbackInfo[name];
    if (varying) {
      var buf = bufferInfo[name];
      if (buf.offset) {
        gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, varying.index, buf.buffer, buf.offset, buf.size);
      } else {
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.index, buf.buffer);
      }
    }
  }
}

function unbindTransformFeedbackInfo(gl, transformFeedbackInfo, bufferInfo) {
  if (transformFeedbackInfo.transformFeedbackInfo) {
    transformFeedbackInfo = transformFeedbackInfo.transformFeedbackInfo;
  }
  if (bufferInfo.attribs) {
    bufferInfo = bufferInfo.attribs;
  }
  for (var name in bufferInfo) {
    var varying = transformFeedbackInfo[name];
    if (varying) {
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.index, null);
    }
  }
}

function createTransformFeedback(gl, programInfo, bufferInfo) {
  var tf = gl.createTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
  gl.useProgram(programInfo.program);
  bindTransformFeedbackInfo(gl, programInfo, bufferInfo);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  unbindTransformFeedbackInfo(gl, programInfo, bufferInfo);
  return tf;
}

function createUniformBlockSpecFromProgram(gl, program) {
  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  var uniformData = [];
  var uniformIndices = [];
  for (var ii = 0; ii < numUniforms; ++ii) {
    uniformIndices.push(ii);
    uniformData.push({});
    var uniformInfo = gl.getActiveUniform(program, ii);
    if (!uniformInfo) {
      break;
    }
    uniformData[ii].name = uniformInfo.name;
  }
  [
    [ "UNIFORM_TYPE", "type" ],
    [ "UNIFORM_SIZE", "size" ],
    [ "UNIFORM_BLOCK_INDEX", "blockNdx" ],
    [ "UNIFORM_OFFSET", "offset", ],
  ].forEach(function(pair) {
    var pname = pair[0];
    var key = pair[1];
    gl.getActiveUniforms(program, uniformIndices, gl[pname]).forEach(function(value, ndx) {
      uniformData[ndx][key] = value;
    });
  });
  var blockSpecs = {};
  var numUniformBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
  for (ii = 0; ii < numUniformBlocks; ++ii) {
    var name = gl.getActiveUniformBlockName(program, ii);
    var blockSpec = {
      index: ii,
      usedByVertexShader: gl.getActiveUniformBlockParameter(program, ii, gl.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
      usedByFragmentShader: gl.getActiveUniformBlockParameter(program, ii, gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER),
      size: gl.getActiveUniformBlockParameter(program, ii, gl.UNIFORM_BLOCK_DATA_SIZE),
      uniformIndices: gl.getActiveUniformBlockParameter(program, ii, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES),
    };
    blockSpec.used = blockSpec.usedByVertexSahder || blockSpec.usedByFragmentShader;
    blockSpecs[name] = blockSpec;
  }
  return {
    blockSpecs: blockSpecs,
    uniformData: uniformData,
  };
}

var arraySuffixRE = /\[\d+\]\.$/;

function createUniformBlockInfoFromProgram(gl, program, uniformBlockSpec, blockName) {
  var blockSpecs = uniformBlockSpec.blockSpecs;
  var uniformData = uniformBlockSpec.uniformData;
  var blockSpec = blockSpecs[blockName];
  if (!blockSpec) {
    warn("no uniform block object named:", blockName);
    return {
      name: blockName,
      uniforms: {},
    };
  }
  var array = new ArrayBuffer(blockSpec.size);
  var buffer = gl.createBuffer();
  var uniformBufferIndex = blockSpec.index;
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
  gl.uniformBlockBinding(program, blockSpec.index, uniformBufferIndex);

  var prefix = blockName + ".";
  if (arraySuffixRE.test(prefix)) {
    prefix = prefix.replace(arraySuffixRE, ".");
  }
  var uniforms = {};
  blockSpec.uniformIndices.forEach(function(uniformNdx) {
    var data = uniformData[uniformNdx];
    var typeInfo = typeMap[data.type];
    var Type = typeInfo.Type;
    var length = data.size * typeInfo.size;
    var name = data.name;
    if (name.substr(0, prefix.length) === prefix) {
      name = name.substr(prefix.length);
    }
    uniforms[name] = new Type(array, data.offset, length / Type.BYTES_PER_ELEMENT);
  });
  return {
    name: blockName,
    array,
    asFloat: new Float32Array(array),
    buffer,
    uniforms,
  };
}

function createUniformBlockInfo(gl, programInfo, blockName) {
  return createUniformBlockInfoFromProgram(gl, programInfo.program, programInfo.uniformBlockSpec, blockName);
}

function bindUniformBlock(gl, programInfo, uniformBlockInfo) {
  var uniformBlockSpec = programInfo.uniformBlockSpec || programInfo;
  var blockSpec = uniformBlockSpec.blockSpecs[uniformBlockInfo.name];
  if (blockSpec) {
    var bufferBindIndex = blockSpec.index;
    gl.bindBufferRange(gl.UNIFORM_BUFFER, bufferBindIndex, uniformBlockInfo.buffer, uniformBlockInfo.offset || 0, uniformBlockInfo.array.byteLength);
    return true;
  }
  return false;
}

function setUniformBlock(gl, programInfo, uniformBlockInfo) {
  if (bindUniformBlock(gl, programInfo, uniformBlockInfo)) {
    gl.bufferData(gl.UNIFORM_BUFFER, uniformBlockInfo.array, gl.DYNAMIC_DRAW);
  }
}

function setBlockUniforms(uniformBlockInfo, values) {
  var uniforms = uniformBlockInfo.uniforms;
  for (var name in values) {
    var array = uniforms[name];
    if (array) {
      var value = values[name];
      if (value.length) {
        array.set(value);
      } else {
        array[0] = value;
      }
    }
  }
}

function setUniforms(setters, values) {
  var actualSetters = setters.uniformSetters || setters;
  var numArgs = arguments.length;
  for (var andx = 1; andx < numArgs; ++andx) {
    var vals = arguments[andx];
    if (Array.isArray(vals)) {
      var numValues = vals.length;
      for (var ii = 0; ii < numValues; ++ii) {
        setUniforms(actualSetters, vals[ii]);
      }
    } else {
      for (var name in vals) {
        var setter = actualSetters[name];
        if (setter) setter(vals[name]);
      }
    }
  }
}

function createAttributeSetters(gl, program) {
  var attribSetters = {};
  var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var ii = 0; ii < numAttribs; ++ii) {
    var attribInfo = gl.getActiveAttrib(program, ii);
    if (!attribInfo) break;
    var index = gl.getAttribLocation(program, attribInfo.name);
    var typeInfo = attrTypeMap[attribInfo.type];
    var setter = typeInfo.setter(gl, index, typeInfo);
    setter.location = index;
    attribSetters[attribInfo.name] = setter;
  }
  return attribSetters;
}

function setAttributes(setters, buffers) {
  for (var name in buffers) {
    var setter = setters[name];
    if (setter) setter(buffers[name]);
  }
}

function setBuffersAndAttributes(gl, programInfo, buffers) {
  if (buffers.vertexArrayObject) {
    gl.bindVertexArray(buffers.vertexArrayObject);
  } else {
    setAttributes(programInfo.attribSetters || programInfo, buffers.attribs);
    if (buffers.indices) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    }
  }
}

function createProgramInfoFromProgram(gl, program) {
  var uniformSetters = createUniformSetters(gl, program);
  var attribSetters = createAttributeSetters(gl, program);
  var programInfo = { program, uniformSetters, attribSetters };
  if (utils.isWebGL2(gl)) {
    programInfo.uniformBlockSpec = createUniformBlockSpecFromProgram(gl, program);
    programInfo.transformFeedbackInfo = createTransformFeedbackInfo(gl, program);
  }
  return programInfo;
}

function createProgramInfo(
    gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
  var progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  var good = true;
  shaderSources = shaderSources.map(function(source) {
    if (source.indexOf('\n') < 0) {
      var script = document.getElementById(source);
      if (!script) {
        progOptions.errorCallback("no element with id: " + source);
        good = false;
      } else {
        source = script.text;
      }
    }
    return source;
  });
  if (!good) return null;
  const program = createProgramFromSources(gl, shaderSources, progOptions);
  if (!program) return null;
  return createProgramInfoFromProgram(gl, program);
}

export default {
  createAttributeSetters,
  createProgram,
  createProgramFromScripts,
  createProgramFromSources,
  createProgramInfo,
  createProgramInfoFromProgram,
  createUniformSetters,
  createUniformBlockSpecFromProgram,
  createUniformBlockInfoFromProgram,
  createUniformBlockInfo,
  createTransformFeedback,
  createTransformFeedbackInfo,
  bindTransformFeedbackInfo,
  setAttributes,
  setBuffersAndAttributes,
  setUniforms,
  setUniformBlock,
  setBlockUniforms,
  bindUniformBlock,
};
