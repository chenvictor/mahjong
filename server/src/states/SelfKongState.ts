/**
 * Either a hidden, or a 3+1 kong
 */
import {Index} from "../shared/types";
import {Game, State} from "../Game";
import {Move} from "../events";
import {TurnState} from "./TurnState";
import {isSameValues, Meld} from "../Meld";

export class SelfKongState implements State {
  private readonly game: Game;
  private readonly player: Index;
  constructor(game: Game, player: Index, n: number = 3) {
    this.game = game;
    this.player = player;
    game.broadcast({
      message: this.string()
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
          let kong: Meld | null = null;
          if (tiles.length === 1) {
            // pong => kong meld
            kong = this.game.extractMeldKong(this.player, tiles[0]);
          } else {
            // hidden kong
            kong = isSameValues(tiles, 4);
            if (kong !== null) {
              kong.hidden = true;
            }
          }
          if (kong === null) break;
          this.game.addMeld(this.player, kong);
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
