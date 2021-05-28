import {Index} from '../../shared/types';
import {Meld} from '../../Meld';
import Scoring from '../Scoring';
import {flatten} from '../../utils';

export default abstract class Hand {
  protected melds: Meld[] = [];

  /**
   * Returns true if the given tiles + melds form such a hand
   * If true, results retrieved using getMelds
   */
  public check(tiles: Index[], melds: Meld[], scoring: Scoring): boolean {
    return this.preCheck(tiles, melds) && this.doCheck(tiles, melds, scoring);
  }
  protected preCheck(_tiles: Index[], _melds: Meld[]): boolean {
    return true;
  }
  protected abstract doCheck(tiles: Index[], melds: Meld[], scoring: Scoring): boolean;
  public abstract getValue(): number;
  public abstract getName(): string;
  public getHand(): Index[] {
    return flatten(this.melds.map((meld) => meld.getRawTiles()));
  }
  public static max(a: Hand, b: Hand): Hand {
    if (a.getValue() > b.getValue()) {
      return a;
    }
    return b;
  }
}
