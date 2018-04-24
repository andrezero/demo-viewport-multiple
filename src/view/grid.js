import { Time } from '@picabia/picabia';

class GridView {
  constructor (grid, viewport) {
    this._grid = grid;
    this._viewport = viewport;

    this._grid.setPoints(this._viewport._pos, this._viewport.getShape());

    this._viewport.on('change', Time.throttle(() => {
      this._grid.setPoints(this._viewport._pos, this._viewport.getShape());
    }, 100));
  }

  // -- public

  render (layer, delta, timestamp) {
    const points = this._grid._points;

    layer.setStrokeWidth(1);
    layer.setFillStyle('rgba(1, 1, 1, 1)');
    points.forEach(point => {
      layer.beginPath();
      layer.moveTo(point.x - 5, point.y);
      layer.lineTo(point.x + 5, point.y);
      layer.stroke();
      layer.moveTo(point.x, point.y + 5);
      layer.lineTo(point.x, point.y - 5);
      layer.stroke();
    });
  }
}

export {
  GridView
};
