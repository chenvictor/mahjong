import Hand from './Hand';
import {Index} from '../../shared/types';
import {Meld} from '../../Meld';
import Scoring from '../Scoring';
import {extractIndices, spliceIndices} from '../../utils';

export default abstract class MeldHand extends Hand {
  doCheck(tiles: Index[], _melds: Meld[], scoring: Scoring): boolean {
    this.melds = [];
    return this.dfs(tiles, scoring);
  }
  protected abstract makeMeld(tiles: Index[], scoring: Scoring): Meld | null;
  protected postCheck(_melds: Meld[], _scoring: Scoring): boolean {
    return true;
  }
  protected dfs(tiles: Index[], scoring: Scoring): boolean {
    const n = tiles.length;
    if (n === 2) {
      const eyes = scoring.makeEyes(tiles);
      if (eyes !== null) {
        this.melds.push(eyes);
        return true;
      }
      return false;
    }
    for (let i = 2; i < n; ++i) {
      for (let j = 1; j < i; ++j) {
        for (let k = 0; k < j; ++k) {
          const meldTiles = extractIndices(tiles, [i,j,k]);
          const meld = scoring.makeChow(meldTiles) || scoring.makePong(meldTiles);
          if (meld !== null) {
            this.melds.push(meld);
            if (this.dfs(spliceIndices(tiles, [i,j,k]), scoring)) {
              if (this.postCheck(this.melds, scoring)) {
                return true;
              }
            }
            this.melds.pop();
          }
        }
      }
    }
    return false;
  }
}
