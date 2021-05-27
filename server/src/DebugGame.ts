import {Game} from './Game';
import {Deque} from './deque';
import {Index} from './shared/types';
import {Tiles, TileType} from './shared/Tiles';
import {Meld} from './Meld';

export default class DebugGame extends Game {
  protected genTiles(): Deque<Index> {
    const tiles = Tiles.generate([], [TileType.DOTS]);
    tiles.sort((a,b) => Tiles.getValue(a) - Tiles.getValue(b));
    return new Deque(tiles);
  }

  protected preGame() {
    super.preGame();
    this.handTiles = Array(4).fill(0).map(() => {
      return new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
    });
    this.meldTiles = Array(4).fill(0).map(() => {
      return Array(4).fill(0).map(() => {
        return Meld.makeKong([40,40,40,40], false);
      });
    });
    this.broadcastTiles();
    this.broadcastMelds();
    this.broadcast({
      names: Array(4).fill('long name long'),
    });
  }
}