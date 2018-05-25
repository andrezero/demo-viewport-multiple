import { View, Shape } from '@picabia/picabia';

class PlatformView extends View {
  constructor (v, target, platform) {
    super(v, target);

    this._platform = platform;
  }

  // -- view

  render (renderer) {
    const red = 10;
    const green = 10;
    const blue = this._platform._layer === 1 ? 100 : 200;
    const alpha = 1;
    const rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    const points = Shape.getPoints(this._platform.shape);

    renderer.setFillStyle(rgba);
    renderer.beginPath();
    points.forEach(vector => renderer.lineTo(vector.x, vector.y));
    renderer.lineTo(points[0].x, points[0].y);
    renderer.fill();
  }
}

export {
  PlatformView
};
