import {Move} from '../events';
import {Index} from '../shared/types';
import {mod} from '../utils';
import {Game, State} from '../Game';
import {TurnState} from './TurnState';
import {MeldState} from './MeldState';
import {EndState} from './EndState';
import {KongState} from './KongState';
import {MeldType, Meld} from '../Meld';
import WinState from './WinState';

const MOVE_NONE = (move: Move) => move === Move.NONE;

/**
 * Waiting for players to decide their move.
 * After a tile is discarded, either
 * - the next player draws a tile
 * - any player does a meld/wins
 */
export class WaitingState implements State {
  private static readonly WAIT_MS = 3000;
  private readonly game: Game;
  private readonly moves: Move[];
  private timeout: NodeJS.Timeout | null;

  constructor(game: Game) {
    this.game = game;
    this.moves = Array(game.nplayers).fill(Move.NONE);
    this.timeout = setTimeout(() => {
      this.timeout = null;
      if (!this.moves.every(MOVE_NONE) || this.shouldEnd(Move.NONE)) {
        this.next();
      }
    }, WaitingState.WAIT_MS);
  }

  private next() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    let nextPlayer: Index = -1;
    let nextMove: Move = Move.NONE;
    for (let i = 0; i < this.game.nplayers; ++i) {
      const player = mod(i + this.game.getTurn(), this.game.nplayers);
      console.log({
        player,
        move: this.moves[player],
      });
      if (this.moves[player] < nextMove) {
        nextMove = this.moves[player];
        nextPlayer = player;
      }
    }
    if (this.shouldEnd(nextMove)) {
      this.game.setState(new EndState(this.game));
      return;
    }
    switch (nextMove) {
      case Move.DEAL:
        const tile = this.game.tiles.popFront();
        this.game.drawTile(nextPlayer, tile);
        this.game.setState(new TurnState(this.game, nextPlayer));
        break;
      case Move.PONG:
        this.game.setState(new MeldState(this.game, nextPlayer, Meld.makePong, Move.PONG, MeldType.PONG));
        break;
      case Move.KONG:
        this.game.setState(new KongState(this.game, nextPlayer));
        break;
      case Move.WIN:
        this.game.drawTile(nextPlayer, <number>this.game.getDiscard());
        this.game.undiscardTile();
        this.game.setState(new WinState(this.game, nextPlayer));
        break;
    }
  }

  private set(player: Index, move: Move) {
    this.moves[player] = move;
    if (this.timeout === null || !this.moves.some(MOVE_NONE)) {
      this.next();
    }
  }

  private shouldEnd(move: Move) {
    return this.game.tiles.getSize() === 0 && move !== Move.WIN;
  }

  onMove(player: Index, move: Move, _tiles: Index[]) {
    if (this.shouldEnd(move)) return;
    switch (move) {
      case Move.WIN:
      case Move.PONG:
      case Move.KONG:
        if (this.game.hasDiscard()) {
          this.set(player, move);
        }
        break;
      case Move.DEAL:
        if (this.game.getTurn() === player) {
          this.set(player, move);
        }
        break;
      case Move.HIT:
      case Move.NONE:
        // nothing
        break;
    }
  }

  string() {
    return 'waiting for players to choose next action';
  }
}
