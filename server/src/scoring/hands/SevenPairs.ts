import {Index} from '../../shared/types';
import {Meld} from '../../Meld';
import HiddenHand from './HiddenHand';
import Scoring from '../Scoring';

// TODO: Score these hands

export class SevenPairs extends HiddenHand {
  protected doCheck(tiles: Index[], melds: Meld[], scoring: Scoring): boolean {
    return false;
  }
  getValue(): number {
    return 8;
  }
  getName(): string {
    return 'seven pairs';
  }
}

export class DragonSevenPairs extends HiddenHand {
  protected doCheck(tiles: Index[], melds: Meld[], scoring: Scoring): boolean {
    return false;
  }

  getValue(): number {
    return 16;
  }
  getName(): string {
    return 'dragon seven pairs';
  }
}