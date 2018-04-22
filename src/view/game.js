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

    this._handlePlayerMove = (player) => {
      const newAngle = viewport._angle + 0.001;
      viewport.setAngle(newAngle);
    };

    this._handleNewPlayer = (player) => {
      this._playerView = new PlayerView(player, this._layer);
      this._layer.addView(this._playerView);
      player.on('move', this._handlePlayerMove);
    };

    this._model.on('new-player', this._handleNewPlayer);
  }

  render () {
    this._layer.clear();
  }
}

export {
  GameView
};
