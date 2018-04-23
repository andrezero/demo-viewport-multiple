import { Time } from '@picabia/picabia';

class PlayerView {
  constructor (player) {
    this._player = player;
  }

  // -- public

  render (layer, delta, timestamp) {
    const pos = this._player._pos;
    const size = this._player._size;

    const red = 100;
    const green = 10;
    const blue = 10;
    const alpha = 1;
    const rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    const polygon = this._player._shape.map((vector) => ({ x: vector.x + this._player._pos.x, y: vector.y + this._player._pos.y }));

    layer.setFillStyle(rgba);
    layer.beginPath();
    polygon.forEach(vector => layer.lineTo(vector.x, vector.y));
    layer.fill();
  }
}

export {
  PlayerView
};
