const Canvas = require('canvas');

const MS = {
  NONE: 0,
  UP: 1,
  LEFT: 2,
  DOWN: 3,
  RIGHT: 4,
  getBlobOutlinePoints(sourceCanvas) {
    MS.sourceCanvas = new Canvas(sourceCanvas.width + 2, sourceCanvas.height + 2);
    MS.sourceContext = MS.sourceCanvas.getContext('2d');
    MS.sourceContext.drawImage(sourceCanvas, 1, 1);
    const startingPoint = MS.getFirstNonTransparentPixelTopDown(MS.sourceCanvas);
    if (startingPoint == null) return [];
    const points = MS.walkPerimeter(startingPoint.x, startingPoint.y);
    const border = [];
    for (let i = 0; i < points.length; i += 2) {
      border.push({ x: points[i], y: points[i + 1] });
    }
    return border;
  },
  getFirstNonTransparentPixelTopDown(canvas) {
    const context = canvas.getContext('2d');
    for (let y = 0; y < canvas.height; y++) {
      const rowData = context.getImageData(0, y, canvas.width, 1).data;
      for (let i = 0; i < rowData.length; i += 4) {
        if (rowData[i + 3] > 0) return { x: i / 4, y };
      }
    }
    return null;
  },
  walkPerimeter(startX, startY) {
    const { sourceCanvas, sourceContext } = MS;
    const pointList = [];
    let x = Math.min(Math.max(startX, 0), sourceCanvas.width);
    let y = Math.min(Math.max(startY, 0), sourceCanvas.height);
    const imageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    let index;
    const width4 = imageData.width * 4;
    do {
      index = ((y - 1) * width4) + ((x - 1) * 4);
      MS.step(index, imageData.data, width4);
      if (x >= 0 && x < sourceCanvas.width && y >= 0 && y < sourceCanvas.height) {
        pointList.push(x - 2, y - 1);
      }
      switch (MS.nextStep) {
        case MS.UP: y--; break;
        case MS.LEFT: x--; break;
        case MS.DOWN: y++; break;
        case MS.RIGHT: x++; break;
        default: break;
      }
    } while (x !== startX || y !== startY);
    pointList.push(x - 1, y - 1);
    return pointList;
  },
  step(index, data, width4) {
    MS.upLeft = data[index + 3] > 0;
    MS.upRight = data[index + 7] > 0;
    MS.downLeft = data[index + width4 + 3] > 0;
    MS.downRight = data[index + width4 + 7] > 0;
    MS.previousStep = MS.nextStep;
    MS.state = 0;
    if (MS.upLeft) MS.state |= 1;
    if (MS.upRight) MS.state |= 2;
    if (MS.downLeft) MS.state |= 4;
    if (MS.downRight) MS.state |= 8;
    switch (MS.state) {
      case 1: MS.nextStep = MS.UP; break;
      case 2: MS.nextStep = MS.RIGHT; break;
      case 3: MS.nextStep = MS.RIGHT; break;
      case 4: MS.nextStep = MS.LEFT; break;
      case 5: MS.nextStep = MS.UP; break;
      case 6: MS.nextStep = MS.previousStep === MS.UP ? MS.LEFT : MS.RIGHT; break;
      case 7: MS.nextStep = MS.RIGHT; break;
      case 8: MS.nextStep = MS.DOWN; break;
      case 9: MS.nextStep = MS.previousStep === MS.RIGHT ? MS.UP : MS.DOWN; break;
      case 10: MS.nextStep = MS.DOWN; break;
      case 11: MS.nextStep = MS.DOWN; break;
      case 12: MS.nextStep = MS.LEFT; break;
      case 13: MS.nextStep = MS.UP; break;
      case 14: MS.nextStep = MS.LEFT; break;
      default: MS.nextStep = MS.NONE; break;
    }
  },
};

module.exports = MS;
