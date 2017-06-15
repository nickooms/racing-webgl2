import typedArrays from './typedarrays.js';
import utils from './utils.js';

const defaults = { attribPrefix: '' };

const setAttributePrefix = prefix => (defaults.attribPrefix = prefix);

const setDefaults = newDefaults => utils.copyExistingProperties(newDefaults, defaults);

const setBufferFromTypedArray = (gl, type, buffer, array, drawType = gl.STATIC_DRAW) => {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType);
};

const createBufferFromTypedArray = (gl, typedArray, type = gl.ARRAY_BUFFER, drawType) => {
  if (typedArray instanceof WebGLBuffer) return typedArray;
  const buffer = gl.createBuffer();
  setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
  return buffer;
};

const isIndices = name => name === 'indices';

const getNormalizationForTypedArray = (typedArray) => {
  if (typedArray instanceof Int8Array) return true;
  if (typedArray instanceof Uint8Array) return true;
  return false;
};

const getNormalizationForTypedArrayType = (typedArrayType) => {
  if (typedArrayType === Int8Array) return true;
  if (typedArrayType === Uint8Array) return true;
  return false;
};

const getArray = array => (array.length ? array : array.data);

const texcoordRE = /coord|texture/i;
const colorRE = /color|colour/i;

const guessNumComponentsFromName = (name, length) => {
  let numComponents;
  if (texcoordRE.test(name)) {
    numComponents = 2;
  } else if (colorRE.test(name)) {
    numComponents = 4;
  } else {
    numComponents = 3;
  }
  if (length % numComponents > 0) {
    throw new Error(
      `Can not guess numComponents for attribute '${name}'.
      Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}.
      You should specify it.`);
  }
  return numComponents;
};

const getNumComponents = (array, arrayName) => (
  array.numComponents ||
  array.size ||
  guessNumComponentsFromName(arrayName, getArray(array).length)
);

const makeTypedArray = (array, name) => {
  if (typedArrays.isArrayBuffer(array)) return array;
  if (typedArrays.isArrayBuffer(array.data)) return array.data;
  if (Array.isArray(array)) array = { data: array };
  const Type = array.type || (isIndices(name) ? Uint16Array : Float32Array);
  return new Type(array.data);
};

const createAttribsFromArrays = (gl, arrays) => {
  const { ARRAY_BUFFER, STATIC_DRAW } = gl;
  const attribs = {};
  Object.keys(arrays).forEach((arrayName) => {
    if (!isIndices(arrayName)) {
      const array = arrays[arrayName];
      const attribName = (
        array.attrib ||
        array.name ||
        array.attribName ||
        (defaults.attribPrefix + arrayName)
      );
      let buffer;
      let type;
      let normalize;
      let numComponents;
      let numValues;
      if (typeof array === 'number' || typeof array.data === 'number') {
        numValues = array.data || array;
        const arrayType = array.type || Float32Array;
        const numBytes = numValues * arrayType.BYTES_PER_ELEMENT;
        type = typedArrays.getGLTypeForTypedArrayType(arrayType);
        normalize = array.normalize !== undefined
          ? array.normalize
          : getNormalizationForTypedArrayType(arrayType);
        numComponents = (
          array.numComponents ||
          array.size ||
          guessNumComponentsFromName(arrayName, numValues)
        );
        buffer = gl.createBuffer();
        gl.bindBuffer(ARRAY_BUFFER, buffer);
        gl.bufferData(ARRAY_BUFFER, numBytes, array.drawType || STATIC_DRAW);
      } else {
        const typedArray = makeTypedArray(array, arrayName);
        buffer = createBufferFromTypedArray(gl, typedArray, undefined, array.drawType);
        type = typedArrays.getGLTypeForTypedArray(typedArray);
        normalize = array.normalize !== undefined
          ? array.normalize
          : getNormalizationForTypedArray(typedArray);
        numComponents = getNumComponents(array, arrayName);
        numValues = typedArray.length;
      }
      const { stride = 0, offset = 0, drawType } = array;
      attribs[attribName] = { buffer, numComponents, type, normalize, stride, offset, drawType };
    }
  });
  gl.bindBuffer(ARRAY_BUFFER, null);
  return attribs;
};

const setAttribInfoBufferFromArray = (gl, attribInfo, array, offset) => {
  const { ARRAY_BUFFER } = gl;
  const { buffer, drawType } = attribInfo;
  array = makeTypedArray(array);
  if (offset !== undefined) {
    gl.bindBuffer(ARRAY_BUFFER, buffer);
    gl.bufferSubData(ARRAY_BUFFER, offset, array);
  } else {
    setBufferFromTypedArray(gl, ARRAY_BUFFER, buffer, array, drawType);
  }
};

const getBytesPerValueForGLType = (gl, type) => {
  const { BYTE, UNSIGNED_BYTE, SHORT, UNSIGNED_SHORT, INT, UNSIGNED_INT, FLOAT } = gl;
  switch (type) {
    case BYTE:
    case UNSIGNED_BYTE:
      return 1;
    case SHORT:
    case UNSIGNED_SHORT:
      return 2;
    case INT:
    case UNSIGNED_INT:
    case FLOAT:
      return 4;
    default:
      return 0;
  }
};

const positionKeys = ['position', 'positions', 'a_position'];

const getNumElementsFromNonIndexedArrays = (arrays) => {
  let key;
  let ii;
  for (ii = 0; ii < positionKeys.length; ++ii) {
    key = positionKeys[ii];
    if (key in arrays) break;
  }
  if (ii === positionKeys.length) key = Object.keys(arrays)[0];
  const array = arrays[key];
  const length = getArray(array).length;
  const numComponents = getNumComponents(array, key);
  const numElements = length / numComponents;
  if (length % numComponents > 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }
  return numElements;
};

const getNumElementsFromAttributes = (gl, attribs) => {
  let key;
  let ii;
  for (ii = 0; ii < positionKeys.length; ++ii) {
    key = positionKeys[ii];
    if (key in attribs) break;
    key = defaults.attribPrefix + key;
    if (key in attribs) break;
  }
  if (ii === positionKeys.length) key = Object.keys(attribs)[0];
  const attrib = attribs[key];
  gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer);
  const numBytes = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  const bytesPerValue = getBytesPerValueForGLType(gl, attrib.type);
  const totalElements = numBytes / bytesPerValue;
  const numComponents = attrib.numComponents || attrib.size;
  const numElements = totalElements / numComponents;
  if (numElements % 1 !== 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }
  return numElements;
};

const createBufferInfoFromArrays = (gl, arrays) => {
  const bufferInfo = { attribs: createAttribsFromArrays(gl, arrays) };
  let indices = arrays.indices;
  if (indices) {
    indices = makeTypedArray(indices, 'indices');
    bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
    bufferInfo.numElements = indices.length;
    bufferInfo.elementType = typedArrays.getGLTypeForTypedArray(indices);
  } else {
    bufferInfo.numElements = getNumElementsFromAttributes(gl, bufferInfo.attribs);
  }
  return bufferInfo;
};

const createBufferFromArray = (gl, array, arrayName) => {
  const type = arrayName === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
  const typedArray = makeTypedArray(array, arrayName);
  return createBufferFromTypedArray(gl, typedArray, type);
};

const createBuffersFromArrays = (gl, arrays) => {
  const buffers = {};
  Object.keys(arrays).forEach((key) => {
    buffers[key] = createBufferFromArray(gl, arrays[key], key);
  });
  if (arrays.indices) {
    buffers.numElements = arrays.indices.length;
    buffers.elementType = typedArrays.getGLTypeForTypedArray(makeTypedArray(arrays.indices), 'indices');
  } else {
    buffers.numElements = getNumElementsFromNonIndexedArrays(arrays);
  }
  return buffers;
};

export default {
  createAttribsFromArrays,
  createBuffersFromArrays,
  createBufferFromArray,
  createBufferFromTypedArray,
  createBufferInfoFromArrays,
  setAttribInfoBufferFromArray,
  setAttributePrefix,
  setDefaults_: setDefaults,
  getNumComponents_: getNumComponents,
  getArray_: getArray,
};
