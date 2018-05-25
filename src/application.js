import { Container, Frame, ViewEngine, Viewport, CanvasRenderer2d, KeyboardInput } from '@picabia/picabia';
import { FpsCanvas } from '@picabia/component-fps';

import { GameModel } from './model/game';
import { GameView } from './view/game';

class Application {
  constructor (dom) {
    // -- game

    this._game = new GameModel();

    // -- view

    const containerOptions = {
      mode: 'cover',
      ratio: 4 / 3,
      maxPixels: 1500 * 1500
    };
    this._container = new Container('main', dom, containerOptions);

    this._v = new ViewEngine(dom);
    this._v.add(this._container);

    const renderer = this._v.add(new CanvasRenderer2d('2d'));

    const viewportOptions = {
      pos: { x: 0, y: 0 }
    };
    this._viewports = [];
    this._viewports.push(new Viewport('bg', viewportOptions));
    this._viewports.push(new Viewport('scene-1', viewportOptions));
    this._viewports.push(new Viewport('transitions', viewportOptions));
    this._viewports.push(new Viewport('scene-2', viewportOptions));
    this._viewports.forEach((viewport) => this._v.add(viewport));

    this._container.on('resize', (size) => {
      this._viewports.forEach((viewport, index) => {
        viewport.setSize(size);
        viewport.setScale((1 + index * 0.25) * size.h / 1000);
      });
    });

    this._v.add(new FpsCanvas(this._v, { renderer }, this._container));
    this._v.add(new GameView(this._v, { renderer }, this._game, this._cache));

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

    this._keyboard.on('control', (control) => this._game.input(control));

    // -- start

    this.resize();

    const frameOptions = {
      freeze: true,
      maxDelta: 20,
      interval: false,
      intervalMs: 1000 / 50
    };
    this._frame = new Frame(frameOptions);
    this._frame.on('update', (time) => this._game.update(time));
    this._frame.on('render', (time) => this._v.render(time));
    this._frame.start();
  }

  resize () {
    this._container.resize();
    this._v.resize();
  }
}

export {
  Application
};
