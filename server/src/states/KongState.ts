import {Game, State} from "../Game";
import {Index} from "../shared/types";
import {PongState} from "./PongState";
import {TurnState} from "./TurnState";

export class KongState extends PongState {
  constructor(game: Game, player: Index) {
    super(game, player, 4);
  }
  protected afterMeld() {
    const tile = this.game.tiles.popBack();
    this.game.drawTile(this.player, tile);
    this.game.setState(new TurnState(this.game, this.player));
  }
  string() {
    return `${this.game.getPlayerName(this.player)} kong`;
  }
}
