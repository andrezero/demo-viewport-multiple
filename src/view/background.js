import { View, Wave } from '@picabia/picabia';

class BackgroundView extends View {
  // -- view

  render (delta, timestamp) {
    if (!this._generateAngles) {
      this._generateAngles = Wave.cosine(timestamp, 0, Math.PI / 64, 5000);
    }
    this._viewport.setAngle(this._generateAngles(timestamp));

    const renderer = this._renderer;

    renderer.setStrokeStyle('rgba(0,0,0,1)');
    renderer.setStrokeWidth(50);
    renderer.beginPath();
    const shape = this._viewport.getShape();
    shape.forEach(vector => renderer.lineTo(vector.x, vector.y));
    renderer.lineTo(shape[0].x, shape[0].y);
    renderer.stroke();
  }
}

export {
  BackgroundView
};
