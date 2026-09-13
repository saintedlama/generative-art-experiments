export class PixelCanvas {
  constructor(width, height) {
    const pixelCanvas = [];

    for (let x = 0; x < width; x++) {
      pixelCanvas[x] = [];

      for (let y = 0; y < height; y++) {
        pixelCanvas[x][y] = 0;
      }
    }

    this.width = width;
    this.height = height;

    this.pixelCanvas = pixelCanvas;
  }

  setPixel(x, y, color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.pixelCanvas[x][y] = color;
    }
  }

  getPixel(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.pixelCanvas[x][y];
    }
    return 0;
  }

  drawRect(x, y, width, height, color) {
    for (let curY = y; curY < y + height; curY++) {
      for (let curX = x; curX < x + width; curX++) {
        this.setPixel(curX, curY, color);
      }
    }
  }
}
