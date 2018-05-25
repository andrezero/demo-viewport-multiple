import { View, CanvasLayer2d, Wave } from '@picabia/picabia';

import { BackgroundView } from './background';
import { PlayerView } from './player';
import { PlatformView } from './platform';
import { GridView } from './grid';

class GameView extends View {
  constructor (v, target, game, cache) {
    super(v, target);

    this._game = game;
    this._cache = cache;

    this._container = this._v.get('container:main');
    this._viewports = this._v.get(['viewport:bg', 'viewport:scene-1', 'viewport:transitions', 'viewport:scene-2']);

    this._bgLayer = new CanvasLayer2d('bg', this._container);
    this._v.add(this._bgLayer);

    this._createChild(BackgroundView, { viewport: 'bg', layer: 'bg' });

    this._sceneLayers = [];
    this._sceneLayers.push(new CanvasLayer2d('scene-1', this._container));
    this._sceneLayers.push(new CanvasLayer2d('scene-2', this._container));
    this._sceneLayers.forEach((layer) => this._v.add(layer));

    this._game.on('new-player', (player) => {
      this._player = player;
      this._createChild(PlayerView, { viewport: 'scene-2', layer: 'scene-2' }, player);
      this._viewports.forEach((viewport) => viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y - 100 }));

      this._player.on('move', () => {
        this._viewports.forEach((viewport) => {
          viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y - 100 });
          viewport.setZoom(1 - this._player._speed.h / 2);
        });
        if (this._platformGenerator) {
          this._platformGenerator.generate(this._viewports[0].getShape());
        };
      });
    });

    this._game.on('new-platform-generator', (platformGenerator) => {
      this._platformGenerator = platformGenerator;
      this._platformGenerator.generate(this._viewports[0].getShape());
    });

    this._game.on('new-platform', (platform) => {
      this._platform = platform;
      const layer = 'scene-' + platform.layer;
      const viewport = 'scene-' + platform.layer;
      this._createChild(PlatformView, { viewport, layer }, platform);
    });

    this._game.on('new-grid', (grid) => {
      this._createChild(GridView, { viewport: 'bg', layer: 'bg' }, grid);
    });
  }

  _preUpdate () {
    if (!this._wave) {
      this._wave = Wave.sine(this._time.t, 0, Math.PI / 30, 5000);
    }

    const oscillatingNumber = this._wave(this._time);
    this._viewports.forEach(viewport => viewport.setAngle(oscillatingNumber));
  }

  _destroy () {
    this._vm.purge(this._bgLayer);
    this._sceneLayers.forEach((layer) => this._vm.purge(layer));
  }
}

export {
  GameView
};
