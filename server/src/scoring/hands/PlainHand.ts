import MeldHand from './MeldHand';
import {Index} from '../../shared/types';
import Scoring from '../Scoring';
import {Meld} from '../../Meld';

export default class PlainHand extends MeldHand {
  protected makeMeld(tiles: Index[], scoring: Scoring): Meld | null {
    return scoring.makeChow(tiles) || scoring.makePong(tiles);
  }
  getName(): string {
    return 'plain hand';
  }
  getValue(): number {
    return 1;
  }
}