import textures from './textures.js';
import utils from './utils.js';

const UNSIGNED_BYTE = 0x1401;

/* PixelFormat */
const DEPTH_COMPONENT = 0x1902;
const RGBA = 0x1908;

/* Framebuffer Object. */
const RGBA4 = 0x8056;
const RGB5_A1 = 0x8057;
const RGB565 = 0x8D62;
const DEPTH_COMPONENT16 = 0x81A5;
const STENCIL_INDEX = 0x1901;
const STENCIL_INDEX8 = 0x8D48;
const DEPTH_STENCIL = 0x84F9;
const COLOR_ATTACHMENT0 = 0x8CE0;
const DEPTH_ATTACHMENT = 0x8D00;
const STENCIL_ATTACHMENT = 0x8D20;
const DEPTH_STENCIL_ATTACHMENT = 0x821A;

/* TextureWrapMode */
const REPEAT = 0x2901;
const CLAMP_TO_EDGE = 0x812F;
const MIRRORED_REPEAT = 0x8370;

/* TextureMagFilter */
const NEAREST = 0x2600;
const LINEAR = 0x2601;

/* TextureMinFilter */
const NEAREST_MIPMAP_NEAREST = 0x2700;
const LINEAR_MIPMAP_NEAREST = 0x2701;
const NEAREST_MIPMAP_LINEAR = 0x2702;
const LINEAR_MIPMAP_LINEAR = 0x2703;

const defaultAttachments = [
  { format: RGBA, type: UNSIGNED_BYTE, min: LINEAR, wrap: CLAMP_TO_EDGE },
  { format: DEPTH_STENCIL },
];

const attachmentsByFormat = {};
attachmentsByFormat[DEPTH_STENCIL] = DEPTH_STENCIL_ATTACHMENT;
attachmentsByFormat[STENCIL_INDEX] = STENCIL_ATTACHMENT;
attachmentsByFormat[STENCIL_INDEX8] = STENCIL_ATTACHMENT;
attachmentsByFormat[DEPTH_COMPONENT] = DEPTH_ATTACHMENT;
attachmentsByFormat[DEPTH_COMPONENT16] = DEPTH_ATTACHMENT;

const getAttachmentPointForFormat = format => attachmentsByFormat[format];

const renderbufferFormats = {};
renderbufferFormats[RGBA4] = true;
renderbufferFormats[RGB5_A1] = true;
renderbufferFormats[RGB565] = true;
renderbufferFormats[DEPTH_STENCIL] = true;
renderbufferFormats[DEPTH_COMPONENT16] = true;
renderbufferFormats[STENCIL_INDEX] = true;
renderbufferFormats[STENCIL_INDEX8] = true;

const isRenderbufferFormat = format => renderbufferFormats[format];

const createFramebufferInfo = (
  gl,
  attachments = defaultAttachments,
  width = gl.drawingBufferWidth,
  height = gl.drawingBufferHeight,
) => {
  const target = gl.FRAMEBUFFER;
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(target, fb);
  let colorAttachmentCount = 0;
  const framebufferInfo = {
    framebuffer: fb,
    attachments: [],
    width,
    height,
  };
  attachments.forEach((attachmentOptions) => {
    var attachment = attachmentOptions.attachment;
    var format = attachmentOptions.format;
    var attachmentPoint = getAttachmentPointForFormat(format);
    if (!attachmentPoint) {
      attachmentPoint = COLOR_ATTACHMENT0 + colorAttachmentCount++;
    }
    if (!attachment) {
      if (isRenderbufferFormat(format)) {
        attachment = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, attachment);
        gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
      } else {
        const textureOptions = utils.shallowCopy(attachmentOptions);
        textureOptions.width = width;
        textureOptions.height = height;
        if (textureOptions.auto === undefined) {
          textureOptions.auto = false;
          textureOptions.min = textureOptions.min || textureOptions.minMag || gl.LINEAR;
          textureOptions.mag = textureOptions.mag || textureOptions.minMag || gl.LINEAR;
          textureOptions.wrapS = textureOptions.wrapS || textureOptions.wrap || gl.CLAMP_TO_EDGE;
          textureOptions.wrapT = textureOptions.wrapT || textureOptions.wrap || gl.CLAMP_TO_EDGE;
        }
        attachment = textures.createTexture(gl, textureOptions);
      }
    }
    if (attachment instanceof WebGLRenderbuffer) {
      gl.framebufferRenderbuffer(target, attachmentPoint, gl.RENDERBUFFER, attachment);
    } else if (attachment instanceof WebGLTexture) {
      gl.framebufferTexture2D(
          target,
          attachmentPoint,
          attachmentOptions.texTarget || gl.TEXTURE_2D,
          attachment,
          attachmentOptions.level || 0);
    } else {
      throw new Error('unknown attachment type');
    }
    framebufferInfo.attachments.push(attachment);
  });
  return framebufferInfo;
};

const resizeFramebufferInfo = (
  gl,
  framebufferInfo,
  attachments = defaultAttachments,
  width = gl.drawingBufferWidth,
  height = gl.drawingBufferHeight,
) => {
  framebufferInfo.width = width;
  framebufferInfo.height = height;
  attachments.forEach((attachmentOptions, ndx) => {
    const attachment = framebufferInfo.attachments[ndx];
    const { format } = attachmentOptions;
    if (attachment instanceof WebGLRenderbuffer) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, attachment);
      gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
    } else if (attachment instanceof WebGLTexture) {
      textures.resizeTexture(gl, attachment, attachmentOptions, width, height);
    } else {
      throw new Error('unknown attachment type');
    }
  });
};

const bindFramebufferInfo = (gl, framebufferInfo, target = gl.FRAMEBUFFER) => {
  if (framebufferInfo) {
    const { framebuffer, width, height } = framebufferInfo;
    gl.bindFramebuffer(target, framebuffer);
    gl.viewport(0, 0, width, height);
  } else {
    gl.bindFramebuffer(target, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
};

export default { bindFramebufferInfo, createFramebufferInfo, resizeFramebufferInfo };
