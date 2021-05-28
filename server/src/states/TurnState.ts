/**
 * After a player has drawn a tile, either
 * - discard tile
 * - win
 * - kong
 */
import {Game, State} from '../Game';
import {Index} from '../shared/types';
import {Move} from '../events';
import {DiscardState} from './DiscardState';
import {EndState} from './EndState';
import {SelfKongState} from './SelfKongState';
import WinState from './WinState';

export class TurnState implements State {
  private readonly game: Game;
  private readonly player: Index;

  constructor(game: Game, player: Index) {
    this.game = game;
    this.player = player;
    game.broadcast({
      message: this.string(),
    });
  }

  onMove(player: Index, move: Move, _tiles: Index[]) {
    if (player !== this.player) return;
    switch (move) {
      case Move.HIT:
        this.game.setState(new DiscardState(this.game, this.player));
        break;
      case Move.WIN:
        this.game.setState(new WinState(this.game, player));
        break;
      case Move.KONG:
        this.game.setState(new SelfKongState(this.game, player));
        break;
    }
  }

  string() {
    return `${this.game.getPlayerName(this.player)}'s turn`;
  }
}
