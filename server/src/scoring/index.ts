import {Index} from '../shared/types';
import {Meld} from '../Meld';
import Hand from './hands/Hand';
import Scoring from './Scoring';
import Null from './hands/Null';
import PlainHand from './hands/PlainHand';

export const evaluate = (tiles: Index[], melds: Meld[], scoring: Scoring = new Scoring()): Hand => {
  const hands: Hand[] = [
    new PlainHand(),
  ].filter((hand) => hand.check(tiles, melds, scoring));
  return hands.reduce(Hand.max, new Null(tiles, melds));
}