import {EndState} from './EndState';
import {Index} from '../shared/types';
import {Game} from '../Game';
import {evaluate} from '../scoring';
import {flatten} from '../utils';

export default class WinState extends EndState {
  constructor(game: Game, winner: Index) {
    super(game);
    const tiles = Array.from(game.handTiles[winner]);
    const melds = game.meldTiles[winner];
    const hand = evaluate(tiles, melds);
    game.broadcast({
      winner: {
        tiles: hand.getHand(),
        melds: flatten(melds.map((meld) => meld.getRawTiles())),
        playerName: game.getPlayerName(winner),
        value: hand.getValue(),
        handName: hand.getName(),
      }
    });
  }
}