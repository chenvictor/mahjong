/**
 * Either a hidden, or a 3+1 kong
 */
import {Index} from '../shared/types';
import {Game, State} from '../Game';
import {Move} from '../events';
import {TurnState} from './TurnState';
import {Meld} from '../Meld';

export class SelfKongState implements State {
  private readonly game: Game;
  private readonly player: Index;

  constructor(game: Game, player: Index) {
    this.game = game;
    this.player = player;
    game.broadcast({
      message: this.string(),
    });
  }

  onMove(player: Index, move: Move, tiles: Index[]) {
    if (player !== this.player) return;
    switch (move) {
      case Move.KONG:
        //cancel
        this.game.setState(new TurnState(this.game, this.player));
        break;
      case Move.HIT:
        if (this.game.noWildcards(player, tiles)) {
          if (tiles.length === 1) {
            // pong => kong meld
            if (!this.game.exposedPongToKong(this.player, tiles[0])) {
              return;
            }
          } else {
            // hidden kong
            const kong = Meld.makeKong(tiles, false);
            if (kong === null) {
              return;
            }
            this.game.addMeld(player, kong);
          }
          this.game.removeTiles(this.player, tiles);
          const tile = this.game.tiles.popBack();
          this.game.drawTile(this.player, tile);
          this.game.setState(new TurnState(this.game, this.player));
        }
        break;
    }
  }

  string() {
    return `${this.game.getPlayerName(this.player)} kong`;
  }
}
