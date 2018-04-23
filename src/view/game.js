import { PlayerView } from './player';

class GameView {
  constructor (model, canvas, viewport) {
    this._model = model;
    this._canvas = canvas;
    this._viewport = viewport;

    this._bgLayer = this._canvas.newLayer('bg', null, null, null, this._viewport);
    this._bgCtx = this._bgLayer.ctx;

    this._layer = this._canvas.newLayer('scene', null, null, null, this._viewport);
    this._layer.addView(this);

    this._pos = [];

    this._handleNewPlayer = (player) => {
      this._playerView = new PlayerView(player, this._layer);
      this._layer.addView(this._playerView);
    };

    this._model.on('new-player', this._handleNewPlayer);
  }

  render (layer, delta, timestamp) {
    this._layer.clear();

    this._viewport.setPos({ x: this._viewport._pos.x - 1, y: this._viewport._pos.y - 1 });
    this._viewport.setAngle(this._viewport._angle + 0.005);
    this._viewport.setZoom(this._viewport._zoom + 0.01);

    layer.setStrokeStyle('rgba(0,0,0,1)');
    layer.setStrokeWidth(50);
    layer.beginPath();
    const shape = this._viewport.getShape();
    shape.forEach(vector => layer.lineTo(vector.x, vector.y));
    layer.lineTo(shape[0].x, shape[0].y);
    layer.stroke();
  }
}

export {
  GameView
};
