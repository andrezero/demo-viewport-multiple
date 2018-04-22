import { Emitter, Node } from '@picabia/picabia';
import { PlayerModel } from './player.js';

class GameModel {
  constructor () {
    Node.mixin(this);

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  start () {
    this._player = new PlayerModel();
    this._addChild(this._player);
    this._emitter.emit('new-player', this._player);
  }

  _destroy () {
    this._emitter.destroy();
  }
}

export {
  GameModel
};
