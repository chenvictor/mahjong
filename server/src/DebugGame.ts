import {Game} from './Game';
import {Deque} from './deque';
import {Index} from './shared/types';
import {Tiles, TileType} from './shared/Tiles';

export default class DebugGame extends Game {
  protected genTiles(): Deque<Index> {
    const tiles = Tiles.generate([], [TileType.DOTS]);
    tiles.sort((a,b) => Tiles.getValue(a) - Tiles.getValue(b));
    return new Deque(tiles);
  }

  protected preGame() {
    super.preGame();
    this.handTiles[0] = new Set([0,1,2, 3,4,5, 6,7,8, 9,10,11, 12, 12+Tiles.NUM_TILES])
    this.broadcastTiles();
  }
}