import { Emitter, Geometry } from '@picabia/picabia';

const MAX_SPEED = 1;
const MOVE_INCREMENT = 0.001;
const STOP_INCREMENT = 0.002;
const DASH_INCREMENT = 0.003;
const SLOW_INCREMENT = 0.001;
const MAX_MOVE_SPEED = 0.5;
const MAX_DASH_SPEED = 0.5;

class PlayerModel {
  constructor () {
    this._pos = { x: 0, y: 0 };
    this._dir = 0;
    this._speed = 0;
    this._shape = [{ x: -50, y: -50 }, { x: 50, y: -50 }, { x: 50, y: 50 }, { x: -50, y: 50 }];

    this._moveSpeed = 0;
    this._dashSpeed = 0;

    this._moving = false;
    this._stopping = false;
    this._dashing = false;
    this._slowing = false;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  // -- public

  center () {
    return Promise.resolve();
  }

  setDirection (x, y) {
    this._moving = null;
    if (x || y) {
      this._moving = true;
      this._stopping = null;
    }
    const oldDir = this._dir;
    this._dir = Math.atan2(y, x);
    const diff = Geometry.radiansDelta(this._dir, oldDir);

    if (Math.abs(diff) > Math.PI / 2) {
      this._moveSpeed = 0;
    }
  }

  stop () {
    this._moving = false;
    this._stopping = true;
  }

  startDash () {
    this._dashing = true;
    this._slowing = false;
  }

  stopDash () {
    this._dashing = false;
    this._slowing = true;
  }

  // -- AppObject API

  update (delta) {
    const dir = Geometry.radiansToVector(this._dir);

    if (this._moving) {
      this._moveSpeed += delta * MOVE_INCREMENT;
      if (this._moveSpeed >= MAX_MOVE_SPEED) {
        this._moveSpeed = MAX_MOVE_SPEED;
        this._moving = false;
      }
    }

    if (this._dashing && this._moveSpeed >= MAX_MOVE_SPEED) {
      this._dashSpeed += delta * DASH_INCREMENT;
      if (this._dashSpeed >= MAX_DASH_SPEED) {
        this._dashSpeed = MAX_DASH_SPEED;
        this._dashing = false;
      }
    }

    if (this._stopping) {
      this._moveSpeed -= delta * STOP_INCREMENT;
      if (this._moveSpeed <= 0) {
        this._moveSpeed = 0;
        if (this._dashSpeed <= 0) {
          this._stopping = false;
        }
      }
    }

    if (this._slowing || this._stopping) {
      this._dashSpeed -= delta * SLOW_INCREMENT;
      if (this._dashSpeed <= 0) {
        this._dashSpeed = 0;
        this._slowing = false;
      }
    }

    this._speed = this._moveSpeed + this._dashSpeed;

    if (this._speed && dir.x) {
      this._pos.x += dir.x * this._speed * delta;
    }
    if (this._speed && dir.y) {
      this._pos.y += dir.y * this._speed * delta;
    }

    if (this._speed && (dir.x || dir.y)) {
      this._emitter.emit('move', this);
    }
  }

  _destroy () {
    this._emitter.destroy();
  }
}

export {
  PlayerModel
};
