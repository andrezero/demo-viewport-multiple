import { View, Shape } from '@picabia/picabia';

class PlayerView extends View {
  _constructor (player) {
    this._player = player;
  }

  // -- view

  _render (delta, timestamp) {
    const red = 100;
    const green = 10;
    const blue = 10;
    const alpha = 1;
    const rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    const points = Shape.getPoints(this._player.shape);

    const renderer = this._renderer;

    renderer.setFillStyle(rgba);
    renderer.beginPath();
    points.forEach(vector => renderer.lineTo(vector.x, vector.y));
    renderer.lineTo(points[0].x, points[0].y);
    renderer.fill();
  }
}

export {
  PlayerView
};
