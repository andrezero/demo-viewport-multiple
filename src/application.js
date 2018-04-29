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
      ratio: 4 / 3,
      maxPixels: 1500 * 1500
    };
    this._container = new Container('main', this._dom, containerOptions);

    this._vm = new ViewManager();
    this._vm.addContainer(this._container);

    const viewportOptions = {
      pos: { x: 0, y: 0 }
    };
    this._viewports = [];
    this._viewports.push(new Viewport('camera-bg', viewportOptions));
    this._viewports.push(new Viewport('camera-scene-1', viewportOptions));
    this._viewports.push(new Viewport('camera-transitions', viewportOptions));
    this._viewports.push(new Viewport('camera-scene-2', viewportOptions));
    this._viewports.forEach((viewport) => this._vm.addViewport(viewport));

    this._container.on('resize', (size) => {
      this._viewports.forEach((viewport, index) => {
        viewport.setSize(size);
        viewport.setScale((1 + index * 0.25) * size.h / 1000);
      });
    });

    this._view = this._vm.createView(GameView, [this._model]);

    // -- input

    this._keyboard = new KeyboardInput();
    this._keyboard.addGroup('move', {
      a: 'left',
      d: 'right'
    }, 'center');
    this._keyboard.addGroup('dash', {
      'shift': 'start'
    }, 'stop');
    this._keyboard.addGroup('jump', {
      'space': 'start'
    }, 'stop');
    this._keyboard.addGroup('thrust', {
      w: 'up',
      s: 'down'
    }, 'center');

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
