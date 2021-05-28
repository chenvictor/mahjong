import Hand from './Hand';
import {Index} from '../../shared/types';
import {Meld} from '../../Meld';
import Scoring from '../Scoring';

export default class Null extends Hand {

  constructor(tiles: Index[], melds: Meld[]) {
    super();
    tiles.sort();
    this.melds = [Meld.makeNull(tiles)];
  }

  doCheck(_tiles: Index[], _melds: Meld[], _scoring: Scoring): true {
    console.error('Should not check Null hand!');
    return true;
  }

  getValue(): number {
    return -1;
  }
  getName(): string {
    return 'null';
  }

}