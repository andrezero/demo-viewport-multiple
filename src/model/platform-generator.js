import { Model, Emitter, Geometry } from '@picabia/picabia';

import { PlatformModel } from './platform';

class PlatformGeneratorModel extends Model {
  constructor () {
    super();

    this._numLayers = 2;
    this._batchSize = 5;
    this._minX = 0;
    this._maxX = 0;
    this._platforms = [];
    this._platformHeight = 30;

    this._height = 100;
    this._distance = 500;
    this._minWidth = 300;
    this._maxWidth = 400;

    this._viewportThreshold = 500;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  _generatePlatform (previousPos, vector, layer) {
    layer = layer || Math.floor(Math.random() * this._numLayers) + 1;
    const x = previousPos.x + vector.x;
    const y = previousPos.y + vector.y + Math.floor(Math.random() * this._height - this._height / 2);
    const w = Math.floor(Math.random() * (this._maxWidth - this._minWidth)) + this._minWidth;
    const h = this._platformHeight;

    const platform = new PlatformModel(layer, {x, y}, {w, h});
    this._addChild(platform);
    this._emitter.emit('new-platform', platform);
    return platform;
  }

  _generateRight () {
    let platform;
    for (let ix = this._maxX; ix < this._maxX + this._batchSize; ix++) {
      const pos = this._platforms[this._platforms.length - 1]._pos;
      const vector = {x: this._distance, y: 0};
      platform = this._generatePlatform(pos, vector);
      this._platforms.push(platform);
    }
    this._maxX = platform._pos.x;
  }

  _generateLeft () {
    let platform;
    for (let ix = this._minX; ix > this._minX - this._batchSize; ix--) {
      const pos = this._platforms[0]._pos;
      const vector = {x: -this._distance, y: 0};
      platform = this._generatePlatform(pos, vector);
      this._platforms.unshift(platform);
    }
    this._minX = platform._pos.x;
  }

  // -- model

  _destroy () {
    this._emitter.destroy();
  }

  // -- api

  generate (viewportShape) {
    const rect = Geometry.getAABBRect(viewportShape);
    rect[0] -= this._viewportThreshold;
    rect[2] += this._viewportThreshold * 2;
    if (!this._platforms.length) {
      const pos = { x: rect[0] + rect[2] / 2, y: rect[1] + rect[3] / 2 };
      const platform = this._generatePlatform(pos, { x: 0, y: 1000 }, 2);
      this._platforms.push(platform);
      return;
    }
    const generateRight = rect[0] + rect[2] >= this._maxX;
    if (generateRight) {
      this._generateRight(rect[1], rect[3]);
    }
    const generateLeft = rect[0] <= this._minX;
    if (generateLeft) {
      this._generateLeft(rect[1], rect[3]);
    }
  }
}

export {
  PlatformGeneratorModel
};
