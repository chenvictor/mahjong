import {Index} from '../shared/types';
import {Meld} from '../Meld';

export default class Scoring {
  public makeEyes(tiles: Index[]): Meld | null {
    return Meld.makeEyes(tiles, true);
  }
  public makePong(tiles: Index[]): Meld | null {
    return Meld.makePong(tiles, true);
  }
  public makeChow(tiles: Index[]): Meld | null {
    return Meld.makeChow(tiles, true);
  }
  public makeKong(tiles: Index[]): Meld | null {
    return Meld.makeKong(tiles, true);
  }
  public getWildcard(): Index | null {
    return null;
  }
}