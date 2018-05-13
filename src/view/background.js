import { View } from '@picabia/picabia';

class BackgroundView extends View {
  // -- view

  _render (delta, timestamp) {
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
