import MeldHand from './MeldHand';
import {Index} from '../../shared/types';
import Scoring from '../Scoring';
import {Meld, MeldType} from '../../Meld';

/**
 * Hand consisting of all pongs
 */
export default class AllInTriplets extends MeldHand {
  protected preCheck(_tiles: Index[], melds: Meld[]): boolean {
    return melds.every((meld) => meld.getType() === MeldType.PONG);
  }

  protected makeMeld(tiles: Index[], scoring: Scoring): Meld | null {
    return scoring.makePong(tiles);
  }
  getValue(): number {
    return 3;
  }
  getName(): string {
    return 'all in triplets';
  }
}