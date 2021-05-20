import {Game, State} from "../Game";
import {Index} from "../shared/types";
import {Move} from "../events";
import {WaitingState} from "./WaitingState";
import {TurnState} from "./TurnState";

export class DiscardState implements State {
  private readonly game: Game;
  private readonly player: Index;
  constructor(game: Game, player: Index) {
    this.game = game;
    this.player = player;
    game.broadcast({
      message: this.string()
    });
  }
  onMove(player: Index, move: Move, tiles: Index[]) {
    if (player !== this.player) return;
    if (move !== Move.HIT) return;
    if (tiles.length === 0) {
      // cancel
      this.game.setState(new TurnState(this.game, this.player));
      return;
    }
    if (tiles.length === 1) {
      const tile = tiles[0];
      if (this.game.noWildcards(player, [tile])) {
        if (this.game.discardTile(player, tiles[0])) {
          this.game.setTurn(this.player+1);
          this.game.broadcast({
            message: 'tile discarded'
          });
          this.game.setState(new WaitingState(this.game));
        }
      }
    }
  }
  string() {
    return `${this.game.getPlayerName(this.player)} is discarding a tile`;
  }
}
