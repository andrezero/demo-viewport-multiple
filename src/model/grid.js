import { Geometry } from '@picabia/picabia';

class GridModel {
  constructor () {
    this._points = [];
  }

  setPoints (center, shape) {
    let rect = Geometry.getAABBRect(shape);

    rect[0] = rect[0] - rect[0] % 50;
    rect[1] = rect[1] - rect[1] % 50;
    rect[2] = rect[2] - rect[2] % 50 + 50;
    rect[3] = rect[3] - rect[3] % 50 + 50;

    this._points = [];
    for (let ix = rect[0]; ix < rect[0] + rect[2]; ix += 50) {
      for (let iy = rect[1]; iy < rect[1] + rect[3]; iy += 50) {
        this._points.push({ x: ix, y: iy });
      }
    }
  }

  _destroy () {

  }
}

export {
  GridModel
};
