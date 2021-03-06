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
const UNSIGNED_INT_2_10_10_10_REV = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD;
const UNSIGNED_INT_24_8 = 0x84FA;

const glTypeToTypedArray = {};
{
  const tt = glTypeToTypedArray;
  tt[BYTE] = Int8Array;
  tt[UNSIGNED_BYTE] = Uint8Array;
  tt[SHORT] = Int16Array;
  tt[UNSIGNED_SHORT] = Uint16Array;
  tt[INT] = Int32Array;
  tt[UNSIGNED_INT] = Uint32Array;
  tt[FLOAT] = Float32Array;
  tt[UNSIGNED_SHORT_4_4_4_4] = Uint16Array;
  tt[UNSIGNED_SHORT_5_5_5_1] = Uint16Array;
  tt[UNSIGNED_SHORT_5_6_5] = Uint16Array;
  tt[HALF_FLOAT] = Uint16Array;
  tt[UNSIGNED_INT_2_10_10_10_REV] = Uint32Array;
  tt[UNSIGNED_INT_10F_11F_11F_REV] = Uint32Array;
  tt[UNSIGNED_INT_5_9_9_9_REV] = Uint32Array;
  tt[FLOAT_32_UNSIGNED_INT_24_8_REV] = Uint32Array;
  tt[UNSIGNED_INT_24_8] = Uint32Array;
}

const getGLTypeForTypedArray = (typedArray) => {
  if (typedArray instanceof Int8Array) return BYTE;
  if (typedArray instanceof Uint8Array) return UNSIGNED_BYTE;
  if (typedArray instanceof Uint8ClampedArray) return UNSIGNED_BYTE;
  if (typedArray instanceof Int16Array) return SHORT;
  if (typedArray instanceof Uint16Array) return UNSIGNED_SHORT;
  if (typedArray instanceof Int32Array) return INT;
  if (typedArray instanceof Uint32Array) return UNSIGNED_INT;
  if (typedArray instanceof Float32Array) return FLOAT;
  throw new Error('unsupported typed array type');
};

const getGLTypeForTypedArrayType = (typedArrayType) => {
  if (typedArrayType === Int8Array) return BYTE;
  if (typedArrayType === Uint8Array) return UNSIGNED_BYTE;
  if (typedArrayType === Uint8ClampedArray) return UNSIGNED_BYTE;
  if (typedArrayType === Int16Array) return SHORT;
  if (typedArrayType === Uint16Array) return UNSIGNED_SHORT;
  if (typedArrayType === Int32Array) return INT;
  if (typedArrayType === Uint32Array) return UNSIGNED_INT;
  if (typedArrayType === Float32Array) return FLOAT;
  throw new Error('unsupported typed array type');
};

const getTypedArrayTypeForGLType = (type) => {
  const CTOR = glTypeToTypedArray[type];
  if (!CTOR) throw new Error('unknown gl type');
  return CTOR;
};

const isArrayBuffer = a => a && a.buffer && a.buffer instanceof ArrayBuffer;

export default {
  getGLTypeForTypedArray,
  getGLTypeForTypedArrayType,
  getTypedArrayTypeForGLType,
  isArrayBuffer,
};
