import { Model, Emitter, Intersection } from '@picabia/picabia';

class PlatformCollision extends Model {
  constructor () {
    super();

    this._platforms = [];
    this._objects = [];

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  _checkObj (obj) {
    this._platforms.forEach((platform) => {
      const intersections = Intersection.between(platform.segment, obj.shape);
      if (intersections.length) {
        if (!obj.ground) {
          obj.setGround(platform);
        }
      }
    });
  }

  // -- model

  _preUpdate () {
    this._objects.forEach((obj) => {
      if (!obj.ground && obj.falling) {
        this._checkObj(obj);
      }
    });
  }

  // -- api

  addPlatform (platform) {
    this._platforms.push(platform);
  }

  removePlatform (platform) {
    const index = this._platforms.indexOf(platform);
    if (index !== -1) {
      this._platforms.splice(index, 1);
    }
  }

  addObject (object) {
    this._objects.push(object);
  }

  removeObject (object) {
    const index = this._objects.indexOf(object);
    if (index !== -1) {
      this._objects.splice(index, 1);
    }
  }
}

export {
  PlatformCollision
};
