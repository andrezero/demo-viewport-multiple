import { Container, Frame, ViewManager, Viewport, KeyboardInput } from '@picabia/picabia';

import { GameModel } from './model/game';
import { GameView } from './view/game';

class Application {
  constructor (dom) {
    this._dom = dom;

    // -- model

    this._model = new GameModel();

    // -- view

    const containerOptions = {
      mode: 'cover',
      ratio: 1,
      maxPixels: 1000 * 1000
    };
    this._container = new Container('main', this._dom, containerOptions);

    this._vm = new ViewManager();
    this._vm.addContainer(this._container);

    const viewportOptions = {
      pos: { x: 100, y: 100 }
    };
    this._viewport = new Viewport('camera', viewportOptions);

    this._container.on('resize', (size) => this._viewport.setSize(size));
    this._vm.addViewport(this._viewport);

    this._view = this._vm.createView(GameView, [this._model]);

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
    this._frame.on('render', (delta, timestamp) => this._vm.render(delta, timestamp));
    this._frame.start();
  }

  resize () {
    this._container.resize();
  }
}

export {
  Application
};
