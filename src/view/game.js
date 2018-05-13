import { View, CanvasLayer2d, CanvasRenderer2d, Wave } from '@picabia/picabia';

import { BackgroundView } from './background';
import { PlayerView } from './player';
import { PlatformView } from './platform';
import { GridView } from './grid';

class GameView extends View {
  _constructor (game) {
    this._game = game;
    this._cameras = this._vm.getViewports();
    this._vm.addRenderer(new CanvasRenderer2d('2d'));

    this._bgLayer = new CanvasLayer2d('layer-bg');
    this._vm.addLayer('main', this._bgLayer);

    this._createChild(BackgroundView, [], '2d', 'camera-bg', 'layer-bg');

    this._sceneLayers = [];
    this._sceneLayers.push(new CanvasLayer2d('layer-scene-1'));
    this._sceneLayers.push(new CanvasLayer2d('layer-scene-2'));
    this._sceneLayers.forEach((layer) => this._vm.addLayer('main', layer));

    this._game.on('new-player', (player) => {
      this._player = player;
      this._playerView = this._createChild(PlayerView, [player], '2d', 'camera-scene-2', 'layer-scene-2');
      this._cameras.forEach((viewport) => viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y - 100 }));

      this._player.on('move', () => {
        this._cameras.forEach((viewport) => {
          viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y - 100 });
          viewport.setZoom(1 - this._player._speed.h / 2);
        });
        if (this._platformGenerator) {
          this._platformGenerator.generate(this._cameras[0].getShape());
        };
      });
    });

    this._game.on('new-platform-generator', (platformGenerator) => {
      this._platformGenerator = platformGenerator;
      this._platformGenerator.generate(this._cameras[0].getShape());
    });

    this._game.on('new-platform', (platform) => {
      this._platform = platform;
      const layer = 'layer-scene-' + platform.layer;
      const camera = 'camera-scene-' + platform.layer;
      this._platformView = this._createChild(PlatformView, [platform], '2d', camera, layer);
    });

    this._game.on('new-grid', (grid) => {
      this._createChild(GridView, [grid], '2d', 'camera-bg', 'layer-bg');
    });
  }

  render (delta, timestamp) {
    if (!this._wave) {
      this._wave = Wave.sine(timestamp, 0, Math.PI / 4, 5000);
    }

    const oscillatingNumber = this._wave(timestamp);
    this._cameras.forEach(viewport => viewport.setAngle(oscillatingNumber));
  }
}

export {
  GameView
};
