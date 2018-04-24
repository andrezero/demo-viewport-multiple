import { Geometry } from '@picabia/picabia';

class PlayerView {
  constructor (player) {
    this._player = player;
  }

  // -- public

  render (layer, delta, timestamp) {
    const red = 100;
    const green = 10;
    const blue = 10;
    const alpha = 1;
    const rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    const polygon = this._player._shape
      .map((vector) => ({ x: vector.x + this._player._pos.x, y: vector.y + this._player._pos.y }))
      .map(vector => Geometry.rotateVector(vector, -this._player._facing - Math.PI / 2, this._player._pos));

    layer.setFillStyle(rgba);
    layer.beginPath();
    polygon.forEach(vector => layer.lineTo(vector.x, vector.y));
    layer.lineTo(polygon[0].x, polygon[0].y);
    layer.fill();
  }
}

export {
  PlayerView
};
