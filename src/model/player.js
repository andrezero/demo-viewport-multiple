import { Model, Emitter, Time, Geometry, Shape } from '@picabia/picabia';

const MOVE_INCREMENT = 0.001;
const STOP_INCREMENT = 0.002;
const DASH_INCREMENT = 0.003;
const SLOW_INCREMENT = 0.001;
const MAX_MOVE_SPEED = 0.5;
const MAX_DASH_SPEED = 0.5;

const FALL_INCREMENT = 0.001;
const MAX_FALL_SPEED = 2;

class PlayerModel extends Model {
  constructor () {
    super();
    this._pos = { x: 0, y: 0 };
    this._dir = 0;
    this._angle = 0;
    this._facing = 0;
    this._thrust = 0;

    this._speed = {
      h: 0,
      v: 0
    };

    this._moveSpeed = 0;
    this._dashSpeed = 0;
    this._fallSpeed = 0;
    this._thrustForce = 0;

    this._polygon = Shape.Polygon.fromPoints(this._pos, [
      { x: -25, y: -75 },
      { x: 25, y: -75 },
      { x: 50, y: -50 },
      { x: 25, y: -25 },
      { x: 25, y: 75 },
      { x: -25, y: 75 }
    ]);

    this._moving = false;
    this._stopping = false;
    this._dashing = false;
    this._slowing = false;
    this._jumping = false;
    this._rising = false;
    this._falling = true;
    this._ground = null;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  get ground () {
    return this._ground;
  }

  get falling () {
    return this._falling;
  }

  get shape () {
    return this._polygon;
  }

  // -- model

  _init () {
    this._log = Time.throttle(() => {
      console.log('player view render', this);
    }, 5000);
  }

  _preUpdate () {
    const time = this._time;

    if (this._ground) {
      if (this._moving) {
        this._moveSpeed += time.d * MOVE_INCREMENT;
        if (this._moveSpeed >= MAX_MOVE_SPEED) {
          this._moveSpeed = MAX_MOVE_SPEED;
          this._moving = false;
        }
      }

      if (this._dashing && this._moveSpeed >= MAX_MOVE_SPEED) {
        this._dashSpeed += time.d * DASH_INCREMENT;
        if (this._dashSpeed >= MAX_DASH_SPEED) {
          this._dashSpeed = MAX_DASH_SPEED;
          this._dashing = false;
        }
      }
    }

    if (this._ground && this._stopping) {
      this._moveSpeed -= time.d * STOP_INCREMENT;
      if (this._moveSpeed <= 0) {
        this._moveSpeed = 0;
        if (this._dashSpeed <= 0) {
          this._stopping = false;
        }
      }
    }

    if (this._ground && (this._slowing || this._stopping)) {
      this._dashSpeed -= time.d * SLOW_INCREMENT;
      if (this._dashSpeed <= 0) {
        this._dashSpeed = 0;
        this._slowing = false;
      }
    }

    if (!this._ground) {
      this._fallSpeed += time.d * FALL_INCREMENT;
      if (this._fallSpeed > MAX_FALL_SPEED) {
        this._fallSpeed = MAX_FALL_SPEED;
      }
    } else {
      this._fallSpeed = 0;
    }

    this._speed.v = this._fallSpeed + this._thrustForce;
    this._speed.h = this._moveSpeed + this._dashSpeed;

    this._angle = Math.atan2(this._speed.v, this._speed.h * this._dir);
    const angle = Geometry.radiansToVector(this._angle);

    if (this._speed.h && angle.x) {
      this._pos.x += angle.x * this._speed.h * time.d;
    }
    if (this._speed.v && angle.y) {
      this._pos.y += angle.y * this._speed.v * time.d;
    }

    if ((this._speed.h || this._speed.v) && (angle.x || angle.y)) {
      this._emitter.emit('move', this);
    }

    if ((this._speed.h || this._speed.v) && this._facing !== this._angle) {
      let diff = this._angle - this._facing;
      if (Math.abs(diff) > Math.PI) {
        this._facing += Math.sign(diff) * Math.PI * 2;
        diff = this._angle - this._facing;
      }
      if (Math.abs(diff) < 0.2) {
        this._facing = this._angle;
      } else {
        this._facing += (diff) * 0.1;
      }
    }

    this._log(time.d, time.t, this._facing);
  }

  _destroy () {
    this._emitter.destroy();
  }

  // -- api

  setDirection (x) {
    this._moving = null;
    if (x) {
      this._moving = true;
      this._stopping = null;
    }
    const oldDir = this._dir;
    this._dir = x;

    if (Math.abs(this._dir - oldDir) > 0) {
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

  startJump () {
    this._jumping = true;
  }

  stopJump () {
    this._jumping = false;
  }

  applyThrust (thrust) {
    this._thrust = thrust;
  }

  setGround (ground) {
    this._ground = ground;
    this._falling = false;
  }
}

export {
  PlayerModel
};
