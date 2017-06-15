import programs from './programs.js';

const { setBuffersAndAttributes, setAttributes } = programs;

const createVertexArrayInfo = (gl, programInfos, bufferInfo) => {
  const { createVertexArray, bindVertexArray } = gl;
  const vertexArrayObject = createVertexArray();
  bindVertexArray(vertexArrayObject);
  const programInfoArray = programInfos.length ? programInfos : [programInfos];
  programInfoArray.forEach((programInfo) => {
    setBuffersAndAttributes(gl, programInfo, bufferInfo);
  });
  bindVertexArray(null);
  const { numElements, elementType } = bufferInfo;
  return { numElements, elementType, vertexArrayObject };
};

const createVAOAndSetAttributes = (gl, setters, attribs, indices) => {
  const { ELEMENT_ARRAY_BUFFER, createVertexArray, bindVertexArray, bindBuffer } = gl;
  const vao = createVertexArray();
  bindVertexArray(vao);
  setAttributes(setters, attribs);
  if (indices) bindBuffer(ELEMENT_ARRAY_BUFFER, indices);
  bindVertexArray(null);
  return vao;
};

const createVAOFromBufferInfo = (gl, programInfo, { attribs, indices }) =>
  createVAOAndSetAttributes(gl, programInfo.attribSetters || programInfo, attribs, indices);

export default {
  createVertexArrayInfo,
  createVAOAndSetAttributes,
  createVAOFromBufferInfo,
};
