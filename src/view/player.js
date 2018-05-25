import { View, Shape } from '@picabia/picabia';

class PlayerView extends View {
  constructor (v, target, player) {
    super(v, target);

    this._player = player;
  }

  // -- view

  render (renderer) {
    const red = 100;
    const green = 10;
    const blue = 10;
    const alpha = 1;
    const rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    const points = Shape.getPoints(this._player.shape);

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
