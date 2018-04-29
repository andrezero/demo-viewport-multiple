import { Model, Emitter, Geometry } from '@picabia/picabia';

import { PlatformModel } from './platform';

class PlatformGeneratorModel extends Model {
  constructor () {
    super();

    this._numLayers = 2;
    this._batchSize = 50;
    this._minX = 0;
    this._maxX = 0;
    this._platforms = [];
    this._platformHeight = 30;

    this._y = -500;
    this._height = 1000;
    this._distance = 1;
    this._minWidth = 300;
    this._maxWidth = 400;

    this._viewportThreshold = 500;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  _generatePlatform (x) {
    const layer = Math.floor(Math.random() * this._numLayers) + 1;
    const y = this._y + Math.floor(Math.random() * this._height);
    const w = Math.floor(Math.random() * (this._maxWidth - this._minWidth)) + this._minWidth;
    const h = this._platformHeight;

    const platform = new PlatformModel(layer, {x, y}, {w, h});
    this._platforms.push(platform);
    this._addChild(platform);
    this._emitter.emit('new-platform', platform);
  }

  _generateRight () {
    this._generatePlatform(0);
    for (var ix = this._maxX; ix < this._maxX + this._batchSize; ix += this._distance) {
      this._generatePlatform(ix);
    }
    this._maxX += this._batchSize;
  }

  _generateLeft () {
    for (var ix = this._minX; ix > this._minX - this._batchSize; ix -= this._distance) {
      this._generatePlatform(ix);
    }
    this._minX -= this._batchSize;
  }

  // -- model

  _update (delta, timestamp) {

  }

  _destroy () {
    this._emitter.destroy();
  }

  // -- api

  generate (viewportShape) {
    if (this._platforms.length) {
      return;
    }
    const rect = Geometry.getAABBRect(viewportShape);
    rect[0] -= this._viewportThreshold;
    rect[2] += this._viewportThreshold * 2;
    const generateRight = rect[0] + rect[2] >= this._maxX;
    // const generateLeft = rect[0] <= this._minX;
    if (generateRight) {
      this._generateRight(rect[1], rect[3]);
    }
    // if (generateLeft) {
    //   this._generateLeft(rect[1], rect[3]);
    // }
    console.log('generate', this._platforms.length);
  }
}

export {
  PlatformGeneratorModel
};
