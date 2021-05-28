import {EndState} from './EndState';
import {Index} from '../shared/types';
import {Game} from '../Game';

export default class WinState extends EndState {
  constructor(game: Game, winner: Index) {
    super(game);
    game.broadcast({
      winner: {
        tiles: [0,1,2],
        melds: [4,5,6],
        playerName: 'todo',
        value: -1,
        handName: 'todo todo',
      }
    });
  }
}