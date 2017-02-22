/* eslint-disable no-param-reassign, consistent-return */
const GeoCanvas = require('./GeoCanvas');

const DX = [0, -1, 1, 0];
const DY = [-1, 0, 0, 1];

module.exports = function floodFill(geoCanvas, { x, y }, color) {
  const { width, height, bbox } = geoCanvas;
  const img = geoCanvas.imagedata;
  const data = geoCanvas.data;
  const oldColor = geoCanvas.color({ x, y });
  if (oldColor === color) return;
  const fillCanvas = new GeoCanvas(width, height, bbox);
  const fill = fillCanvas.imagedata;
  const fillData = fillCanvas.data;
  let minX = x;
  let maxX = x;
  let minY = y;
  let maxY = y;
  const stack = [x, y];
  while (stack.length > 0) {
    const curY = stack.pop();
    const curX = stack.pop();
    for (let i = 0; i < 4; i++) {
      const nextX = curX + DX[i];
      const nextY = curY + DY[i];
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
      const offset = (nextY * width) + nextX;
      if (data[offset] === oldColor) {
        data[offset] = color;
        fillData[offset] = color;
        minX = Math.min(minX, nextX);
        maxX = Math.max(maxX, nextX);
        minY = Math.min(minY, nextY);
        maxY = Math.max(maxY, nextY);
        stack.push(nextX, nextY);
      }
    }
  }
  geoCanvas.image = img;
  return {
    image: fill,
    fillCanvas,
    x: minX,
    y: minY,
    w: 1 + (maxX - minX),
    h: 1 + (maxY - minY),
  };
};
