import {Game} from '../Game';
import {Index} from '../shared/types';
import {MeldState} from './MeldState';
import {TurnState} from './TurnState';
import {MeldType, Meld} from '../Meld';
import {Move} from '../events';

export class KongState extends MeldState {
  constructor(game: Game, player: Index) {
    super(game, player, Meld.makeKong, Move.KONG, MeldType.KONG);
  }

  protected afterMeld() {
    const tile = this.game.tiles.popBack();
    this.game.drawTile(this.player, tile);
    this.game.setState(new TurnState(this.game, this.player));
  }
}
