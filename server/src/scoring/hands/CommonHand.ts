import MeldHand from './MeldHand';
import {Index} from '../../shared/types';
import Scoring from '../Scoring';
import {Meld, MeldType} from '../../Meld';

/**
 * Hand consisting of all chows
 */
export default class CommonHand extends MeldHand {
  protected preCheck(_tiles: Index[], melds: Meld[]): boolean {
    return melds.every((meld) => meld.getType() === MeldType.CHOW);
  }

  protected makeMeld(tiles: Index[], scoring: Scoring): Meld | null {
    return scoring.makeChow(tiles);
  }
  getValue(): number {
    return 1;
  }
  getName(): string {
    return 'common hand';
  }
}