import { View, CanvasLayer2d, CanvasRenderer2d } from '@picabia/picabia';

import { BackgroundView } from './background';
import { PlayerView } from './player';
import { GridView } from './grid';

class GameView extends View {
  _constructor (model) {
    this._model = model;
    this._viewport = this._vm.getViewport('camera');
    this._vm.addRenderer(new CanvasRenderer2d('2d'));

    this._bgLayer = new CanvasLayer2d('bg');
    this._vm.addLayer('main', this._bgLayer);

    this._vm.createView(BackgroundView, [], '2d', 'bg', 'camera');

    this._sceneLayer = new CanvasLayer2d('scene');
    this._vm.addLayer('main', this._sceneLayer);

    this._model.on('new-player', (player) => {
      this._player = player;
      this._playerView = this._vm.createView(PlayerView, [player], '2d', 'scene', 'camera');

      this._player.on('move', () => {
        this._viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y });
        this._viewport.setZoom(1 - this._player._speed / 2);
      });
    });

    this._model.on('new-grid', (grid) => {
      this._vm.createView(GridView, [grid], '2d', 'bg', 'camera');
    });
  }
}

export {
  GameView
};
