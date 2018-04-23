import { Canvas, Frame, Node, Viewport, KeyboardInput } from '@picabia/picabia';

import { GameModel } from './model/game';
import { GameView } from './view/game';

import style from './styles/style.css';

class Application {
  constructor (container) {
    this._container = container;

    Node.mixin(this);

    // -- model

    this._model = new GameModel();
    this._player = null;

    // -- view

    const canvasOptions = {
      mode: 'cover',
      ratio: 2,
      scaleAxis: 'width',
      maxPixels: 1200 * 1200
    };
    this._canvas = new Canvas(this._container, canvasOptions);

    this._viewport = new Viewport();
    this._view = new GameView(this._model, this._canvas, this._viewport);

    this._canvas.on('resize', () => {
      this._viewport.setSize({ w: this._canvas.width, h: this._canvas.height });
      this._viewport.setScale(this._canvas.width / 1000);
    });

    // -- input

    this._keyboard = new KeyboardInput();
    this._keyboard.addGroup('move', {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      'a+w': 'up+left',
      'd+w': 'up+right',
      'a+s': 'down+left',
      'd+s': 'down+right'
    }, 'center');
    this._keyboard.addGroup('dash', {
      'shift': 'start'
    }, 'stop');

    this._model.on('new-player', (player) => (this._player = player));

    this._keyboard.on('move:up', () => this._player.setDirection(0, -1));
    this._keyboard.on('move:down', () => this._player.setDirection(0, 1));
    this._keyboard.on('move:left', () => this._player.setDirection(-1, 0));
    this._keyboard.on('move:right', () => this._player.setDirection(1, 0));
    this._keyboard.on('move:up+left', () => this._player.setDirection(-1, -1));
    this._keyboard.on('move:up+right', () => this._player.setDirection(1, -1));
    this._keyboard.on('move:down+left', () => this._player.setDirection(-1, 1));
    this._keyboard.on('move:down+right', () => this._player.setDirection(1, 1));
    this._keyboard.on('move:center', () => this._player.stop());

    this._keyboard.on('dash:start', () => this._player.startDash());
    this._keyboard.on('dash:stop', () => this._player.stopDash());

    // -- start

    this.resize();

    const frameOptions = {
      freeze: true,
      maxDelta: 20,
      interval: false,
      intervalMs: 1000 / 50
    };
    this._frame = new Frame(frameOptions);
    this._frame.on('update', (delta, timestamp) => this._model.update(delta, timestamp));
    this._frame.on('update', (delta, timestamp) => this._canvas.render(delta, timestamp));
    this._frame.start();

    this._model.start();
  }

  resize () {
    this._canvas.resize();
  }
}

export {
  Application
};
