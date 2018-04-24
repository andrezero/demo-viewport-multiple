import { Wave } from '@picabia/picabia';

import { PlayerView } from './player';
import { GridView } from './grid';

class GameView {
  constructor (model, canvas, viewport) {
    this._model = model;
    this._canvas = canvas;
    this._viewport = viewport;

    this._bgLayer = this._canvas.addLayer('bg', null, null, null, this._viewport);
    this._layer = this._canvas.addLayer('scene', null, null, null, this._viewport);
    this._canvas.addView(this);

    this._pos = [];

    this._model.on('new-player', (player) => {
      this._player = player;
      this._playerView = new PlayerView(player);
      this._layer.addView(this._playerView);

      this._player.on('move', () => {
        this._viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y });
        this._viewport.setZoom(1 - this._player._speed / 2);
      });
    });

    this._model.on('new-grid', (grid) => {
      this._gridView = new GridView(grid, viewport);
      this._bgLayer.addView(this._gridView);
    });
  }

  render (delta, timestamp) {
    this._bgLayer.clear();
    this._layer.clear();

    if (!this._generateAngles) {
      this._generateAngles = Wave.cosine(timestamp, 0, Math.PI / 64, 5000);
    }
    this._viewport.setAngle(this._generateAngles(timestamp));

    this._layer.setStrokeStyle('rgba(0,0,0,1)');
    this._layer.setStrokeWidth(50);
    this._layer.beginPath();
    const shape = this._viewport.getShape();
    shape.forEach(vector => this._layer.lineTo(vector.x, vector.y));
    this._layer.lineTo(shape[0].x, shape[0].y);
    this._layer.stroke();
  }
}

export {
  GameView
};
