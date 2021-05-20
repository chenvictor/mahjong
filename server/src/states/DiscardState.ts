import {Game, State} from "../Game";
import {Index} from "../shared/types";
import {Move} from "../events";
import {WaitingState} from "./WaitingState";

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
    if (move === Move.HIT && tiles.length === 1) {
      if (this.game.discardTile(player, tiles[0])) {
        this.game.setTurn(this.player+1);
        this.game.broadcast({
          message: 'tile discarded'
        });
        this.game.setState(new WaitingState(this.game));
      }
    }
  }
  string() {
    return `${this.game.getPlayerName(this.player)} is discarding a tile`;
  }
}
