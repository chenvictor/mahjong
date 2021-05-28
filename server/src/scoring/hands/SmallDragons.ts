import MeldHand from './MeldHand';
import {Meld, MeldType} from '../../Meld';
import Scoring from '../Scoring';
import {Tiles, TileType} from '../../shared/Tiles';
import PlainHand from './PlainHand';

/**
 * 2 dragons + 3rd dragon pair
 */
export default class SmallDragons extends PlainHand {
  protected postCheck(melds: Meld[], scoring: Scoring): boolean {
    let pongCount = 0;
    let eyes = false;
    for (const meld of melds) {
      if (
        meld.getType() === MeldType.EYES
        && Tiles.getType(meld.getValues()[0]) === TileType.DRAGONS
      ) {
        eyes = true;
      } else if (
        meld.getType() === MeldType.PONG
        && Tiles.getType(meld.getValues()[0]) === TileType.DRAGONS
      ) {
        pongCount++;
      }
    }
    return eyes && pongCount >= 2;
  }
  getValue(): number {
    return 1;
  }
  getName(): string {
    return 'small dragons';
  }
}