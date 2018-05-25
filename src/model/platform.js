import { Model, Emitter, Shape } from '@picabia/picabia';

class PlatformModel extends Model {
  constructor (layer, pos, size) {
    super();

    this._layer = layer;
    this._pos = pos;

    this._polygon = Shape.Polygon.fromPoints(this._pos, [
      { x: -size.w / 2, y: -size.h / 2 },
      { x: size.w / 2, y: -size.h / 2 },
      { x: size.w / 2, y: size.h / 2 },
      { x: -size.w / 2, y: size.h / 2 }
    ]);

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  get layer () {
    return this._layer;
  }

  get shape () {
    return this._polygon;
  }

  get segment () {
    const start = {
      x: this._polygon.points[0].x + this._pos.x,
      y: this._polygon.points[0].y + this._pos.y
    };
    const end = {
      x: this._polygon.points[1].x + this._pos.x,
      y: this._polygon.points[0].y + this._pos.y
    };
    return Shape.Segment.fromPoints([start, end]);
  }

  // -- model

  _destroy () {
    this._emitter.destroy();
  }
}

export {
  PlatformModel
};
