import programs from './programs.js';

const drawBufferInfo = (gl, bufferInfo, type = gl.TRIANGLES, count, offset = 0) => {
  const indices = bufferInfo.indices;
  const elementType = bufferInfo.elementType;
  const numElements = count === undefined ? bufferInfo.numElements : count;
  if (elementType || indices) {
    gl.drawElements(type, numElements, elementType === undefined
      ? gl.UNSIGNED_SHORT
      : bufferInfo.elementType, offset);
  } else {
    gl.drawArrays(type, offset, numElements);
  }
};

const drawObjectList = (gl, objectsToDraw) => {
  let lastUsedProgramInfo = null;
  let lastUsedBufferInfo = null;

  objectsToDraw.forEach((object) => {
    if (object.active === false) return;
    const programInfo = object.programInfo;
    const bufferInfo = object.vertexArrayInfo || object.bufferInfo;
    let bindBuffers = false;
    const type = object.type === undefined ? gl.TRIANGLES : object.type;
    if (programInfo !== lastUsedProgramInfo) {
      lastUsedProgramInfo = programInfo;
      gl.useProgram(programInfo.program);
      bindBuffers = true;
    }
    if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
      if (
        lastUsedBufferInfo &&
        lastUsedBufferInfo.vertexArrayObject &&
        !bufferInfo.vertexArrayObject
      ) gl.bindVertexArray(null);
      lastUsedBufferInfo = bufferInfo;
      programs.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    }
    programs.setUniforms(programInfo, object.uniforms);
    drawBufferInfo(gl, bufferInfo, type, object.count, object.offset);
  });
  if (lastUsedBufferInfo.vertexArrayObject) gl.bindVertexArray(null);
};

export default { drawBufferInfo, drawObjectList };
