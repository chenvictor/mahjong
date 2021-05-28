import {beforeEach, describe, expect, it} from '@jest/globals';
import Scoring from '../../Scoring';
import Hand from '../Hand';
import {rep, shuffle} from '../../../utils';
import {Meld} from '../../../Meld';
import PlainHand from '../PlainHand';

describe('PlainHand', () => {
  let scoring: Scoring;
  let hand: Hand;
  beforeEach(() => {
    scoring = new Scoring();
    hand = new PlainHand();
  });
  it('returns false', () => {
    const tiles = [0,1, 2,2, 4,4, 6,6, 5,8, 10,10, 10,12];
    rep(20, () => {
      shuffle(tiles);
      expect(hand.check(tiles, [], scoring)).toBeFalsy();
    })
  });
  it('only chows', () => {
    const tiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,12];
    rep(20, () => {
      shuffle(tiles);
      expect(hand.check(tiles, [], scoring)).toBeTruthy();
    });
  });
  it('only pongs', () => {
    const tiles = [0,0,0,3,3,3,4,4,4,1,1,1,5,5];
    rep(20, () => {
      shuffle(tiles);
      expect(hand.check(tiles, [], scoring)).toBeTruthy();
    });
  });
  it('mixed', () => {
    const tiles = [0,0,0,3,4,5,4,5,6,1,1,1,5,5];
    rep(20, () => {
      shuffle(tiles);
      expect(hand.check(tiles, [], scoring)).toBeTruthy();
    });
  });
  it('with melds', () => {
    const meld = Meld.makePong([2,2,2], true);
    expect(meld).not.toBeNull();
    const tiles = [0,0,0,3,4,5,1,1,1,5,5];
    rep(20, () => {
      shuffle(tiles);
      expect(hand.check(tiles, [<Meld>meld], scoring)).toBeTruthy();
    });
  });
});