import {Game, State} from "../Game";
import {Index} from "../shared/types";
import {Move} from "../events";
import {DiscardState} from "./DiscardState";
import {WaitingState} from "./WaitingState";
import {MeldType, Meld} from "../Meld";

type MeldFunction = (tiles: Index[], exposed: boolean) => Meld | null;

export class MeldState implements State {
  protected readonly game: Game;
  protected readonly player: Index;
  private readonly discarded: Index;
  private readonly makeMeld: MeldFunction;
  private readonly cancelMove: Move;
  private readonly meldType: MeldType;
  constructor(game: Game, player: Index, makeMeld: MeldFunction, cancelMove: Move, meldType: MeldType) {
    this.game = game;
    this.player = player;
    this.makeMeld = makeMeld;
    this.cancelMove = cancelMove;
    this.meldType = meldType;
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
          const meld = this.makeMeld([...tiles, this.discarded], true);
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
    return `${this.game.getPlayerName(this.player)} ${this.meldType}`;
  }
}
