import { Canvas, Frame, Node, Viewport, KeyboardInput } from '@picabia/picabia';

import { GameModel } from './model/game';
import { GameView } from './view/game';

class Application {
  constructor (container) {
    this._container = container;

    // -- model

    this._model = new GameModel();

    // -- view

    const canvasOptions = {
      mode: 'cover',
      ratio: 1,
      maxPixels: 1000 * 1000
    };
    this._canvas = new Canvas(this._container, canvasOptions);

    this._viewport = new Viewport();
    this._view = new GameView(this._model, this._canvas, this._viewport);

    this._viewport.setScale(1);
    this._viewport.setZoom(1);
    this._viewport.setPos({ x: 100, y: 100 });
    // this._viewport.setAngle(Math.PI / 4);

    this._canvas.on('resize', () => {
      this._viewport.setSize({ w: this._canvas.width, h: this._canvas.height });
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

    this._keyboard.on('control', (control) => this._model.input(control));

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
  }

  resize () {
    this._canvas.resize();
  }
}

export {
  Application
};
