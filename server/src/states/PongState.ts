import {Game, State} from "../Game";
import {Index} from "../shared/types";
import {Move} from "../events";
import {DiscardState} from "./DiscardState";
import {isSameValues, Meld} from "../Meld";
import {WaitingState} from "./WaitingState";

export class PongState implements State {
  protected readonly game: Game;
  protected readonly player: Index;
  private readonly discarded: Index;
  private readonly n: number;
  private readonly cancelMove: Move;
  constructor(game: Game, player: Index, n: number = 3, cancelMove: Move = Move.PONG) {
    this.game = game;
    this.player = player;
    this.n = n;
    this.cancelMove = cancelMove;
    game.broadcast({
      message: this.string()
    });
    this.discarded = <Index>this.game.getDiscard();
  }
  protected afterMeld() {
    this.game.setState(new DiscardState(this.game, this.player));
  }
  onMove(player: Index, move: Move, tiles: Index[]) {
    if (player !== this.player) return;
    if (move === this.cancelMove) {
      this.game.setState(new WaitingState(this.game));
      this.game.broadcast({
        message: this.string() + ' canceled'
      });
      return;
    }
    switch (move) {
      case Move.HIT:
        if (this.game.noWildcards(player, tiles)) {
          const meld = isSameValues([this.discarded, ...tiles], this.n);
          if (meld !== null) {
            this.game.addMeld(this.player, meld);
            this.game.removeTiles(this.player, tiles);
            this.game.undiscardTile();
            this.afterMeld();
          }
        }
        break;
    }
  }
  string() {
    return `${this.game.getPlayerName(this.player)} pong`;
  }
}
