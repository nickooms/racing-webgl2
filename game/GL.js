import twgl from './twgl.js';
import CachedClass from './CachedClass.js';

export default class GL extends CachedClass {
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
}
