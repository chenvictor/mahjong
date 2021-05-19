import {Index} from "../../js/types";
import * as WebSocket from 'ws';
import {broadcast, noop, send, shuffle} from "./utils";
import {ServerMessage, MOVE, ClientMessage} from "./events";
import {Deque} from "./deque";

const genTiles = () => {
  const ret = [];
  for (let i = 0; i < 42; ++i) {
    ret.push(i,i,i,i);
  }
  return ret;
};

export class Game {
  private readonly wss: WebSocket.Server;
  private readonly players: WebSocket[];
  public tiles: Deque<Index>;
  private turn: Index;
  // @ts-ignore
  private state: State;
  constructor(wss: WebSocket.Server) {
    this.wss = wss;
    this.players = shuffle([...wss.clients]);
    this.tiles = new Deque(shuffle(genTiles()));
    this.turn = 0;
    this.setState(new WaitingState(this));
  }
  public onMessage(ws: WebSocket, message: ClientMessage) {
    const player = this.players.findIndex((player) => player === ws);
    console.log({
      player,
      message,
    });
    switch (message.move) {
      case MOVE.WIN:
        if (this.state.onWin) {
          this.state.onWin(player);
        }
        break;
      case MOVE.PONG:
        if (this.state.onPong) {
          this.state.onPong(player);
        }
        break;
      case MOVE.KONG:
        if (this.state.onKong) {
          this.state.onKong(player);
        }
        break;
      case MOVE.DEAL:
        if (this.state.onDeal) {
          this.state.onDeal(player);
        }
        break;
      case MOVE.HIT:
        if (this.state.onHit) {
          this.state.onHit(player, message.tiles);
        }
        break;
      default:
        console.log('not implemented');
    }
  }
  send(player: Index, message: ServerMessage) {
    send(this.players[player], message);
  }
  broadcast(message: ServerMessage) {
    broadcast(this.wss, message);
  }
  setState(state: State) {
    this.state = state;
    console.log(`state: ${state.string()}`);
  }
  getTurn() {
    return this.turn;
  }
  setTurn(turn: Index) {
    this.turn = turn;
  }
}

interface State {
  onWin?:   (player: Index) => void;
  onPong?:  (player: Index) => void;
  onKong?:  (player: Index) => void;
  onDeal?:  (player: Index) => void;
  onHit?:   (player: Index, tiles: Index[]) => void;
  string:   () => string;
}

/**
 * After a tile is discarded, either
 * - the next player draws a tile
 * - any player does a meld/wins
 */
class WaitingState implements State {
  private static readonly WAIT_MS = 3000;
  private readonly game: Game;
  private readonly moves: MOVE[];
  private timeout: NodeJS.Timeout | null;
  constructor(game: Game) {
    this.game = game;
    this.moves = Array(4).fill(MOVE.NONE);
    this.timeout = setTimeout(() => {
      this.timeout = null;
      if (this.moves.some((val) => val !== MOVE.NONE)) {
        this.next();
      }
    }, WaitingState.WAIT_MS);
  }
  private next() {
    console.log('done wait', this.moves);
    // TODO
  }
  private set(player: Index, move: MOVE) {
    this.moves[player] = move;
    if (this.timeout === null) {
      this.next();
    }
  }
  onWin(player: Index) {
    this.set(player, MOVE.WIN);
  }
  onPong(player: Index) {
    this.set(player, MOVE.PONG);
  }
  onKong(player: Index) {
    this.set(player, MOVE.KONG);
  }
  onDeal(player: Index) {
    if (this.game.getTurn() === player) {
      this.set(player, MOVE.DEAL);
    }
  }
  string() {
    return 'waiting';
  }
}
