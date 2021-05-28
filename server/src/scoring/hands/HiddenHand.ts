import Hand from './Hand';
import {Index} from '../../shared/types';
import {Meld} from '../../Meld';

export default abstract class HiddenHand extends Hand {
  protected preCheck(tiles: Index[], melds: Meld[]): boolean {
    return melds.length === 0;
  }
}