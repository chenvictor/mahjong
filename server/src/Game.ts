import * as WebSocket from 'ws';
import {broadcast, maskTilesSetData, meldTilesSetData, mod, rep, rotate, send, shuffle} from './utils';
import {ClientMessage, Move, ServerMessage} from './events';
import {Deque} from './deque';
import {Index} from './shared/types';
import * as Tiles from './shared/Tiles';
import {TurnState} from "./states/TurnState";
import {WinState} from "./states/WinState";
import {isSameValues, Meld} from "./Meld";
import {WaitingState} from "./states/WaitingState";

export class Game {
  private readonly wss: WebSocket.Server;
  private readonly players: WebSocket[];
  public readonly nplayers: number;
  public tiles: Deque<Index>;
  private turn: Index;
  private lastTile: Index | null;
  private handTiles: Set<Index>[];
  private meldTiles: Meld[][];
  private wildcard: Index;
  // @ts-ignore
  private state: State;
  constructor(wss: WebSocket.Server) {
    this.wss = wss;
    this.players = shuffle([...wss.clients]);
    this.nplayers = this.players.length;
    this.tiles = new Deque([]);
    this.lastTile = null;
    this.turn = 0;
    this.handTiles = [];
    this.meldTiles = [];
    this.wildcard = -1;
    this.state = new WinState(this);
  }
  public start(turn?: Index) {
    if (turn !== undefined) {
      this.turn = turn;
    }
    /**
     * Announce player names
     */
    const names: string[] = [];
    rep(this.nplayers, (i) => {
      names.push(this.getPlayerName(i));
    });
    for (let player=0; player < this.nplayers; player++) {
      this.send(player, {names: rotate(player, names)});
    }
    /**
     * Distribute tiles
     */
    this.tiles = new Deque(shuffle(Tiles.genTiles([Tiles.TileType.FLOWERS, Tiles.TileType.SEASONS])));
    this.handTiles = Tiles.distribute(this.nplayers, this.tiles, this.getTurn());
    this.meldTiles = [];
    rep(this.nplayers, () => {
      this.meldTiles.push([]);
    })
    this.broadcastTiles();
    this.broadcast({
      discard: null
    });
    /**
     * Wildcard
     */
    const discardWild = this.tiles.popBack();
    this.wildcard = Tiles.calculateWildcard(discardWild);
    this.broadcast({
      message: 'Wildcard shown',
      discard: discardWild,
    });
    /**
     * Initialize state
     */
    this.setState(new WaitingState(this));
  }
  public onMessage(ws: WebSocket, message: ClientMessage) {
    const player = this.players.findIndex((player) => player === ws);
    if (this.state.onMove) {
      this.state.onMove(player, message.move, message.tiles);
    }
  }
  public broadcastTiles(showAll: boolean = false) {
    const tiles = this.handTiles.map((set) => [...set]);
    rep(this.nplayers, (i) => {
      const set_tiles = showAll ? rotate(i, tiles) : maskTilesSetData(i, tiles);
      this.send(i, {set_tiles});
    });
  }
  public broadcastMelds(showAll: boolean = false) {
    rep(this.nplayers, (i) => {
      const set_melds = meldTilesSetData(i, this.meldTiles, showAll);
      this.send(i, {set_melds});
    })
  }
  public noWildcards(player: Index, tiles: Index[]): boolean {
    for (const tile of tiles) {
      if (Tiles.getValue(tile) === this.wildcard) {
        this.send(player, {
          message: 'cannot discard wildcard'
        });
        return false;
      }
    }
    return true;
  }
  discardTile(player: Index, tile: Index): boolean {
    if (!this.handTiles[player].has(tile)) {
      return false;
    }
    this.handTiles[player].delete(tile);
    this.lastTile = tile;
    this.broadcastTiles();
    this.broadcast({
      discard: tile,
    });
    return true;
  }
  removeTiles(player: Index, tiles: Index[]) {
    tiles.forEach((tile) => {
      this.handTiles[player].delete(tile);
    });
    this.broadcastTiles();
  }
  undiscardTile() {
    if (this.lastTile !== null) {
      this.lastTile = null;
      this.broadcast({
        discard: -1
      });
    }
  }
  addMeld(player: Index, meld: Meld) {
    this.meldTiles[player].push(meld);
    this.broadcastMelds();
  }
  extractMeldKong(player: Index, tile: Index): Meld | null {
    for(let i = 0; i < this.meldTiles[player].length; i++) {
      const tiles = [tile, ...this.meldTiles[player][i].tiles];
      const meld = isSameValues(tiles, 4);
      if (meld !== null) {
        this.meldTiles[player].splice(i, 1);
        return meld;
      }
    }
    return null;
  }
  drawTile(player: Index, tile: Index) {
    this.handTiles[player].add(tile);
    this.broadcastTiles();
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
    this.turn = mod(turn, this.nplayers);
  }
  incrementTurn() {
    this.setTurn(this.getTurn() + 1);
  }
  hasDiscard() {
    return this.lastTile !== null;
  }
  getDiscard() {
    return this.lastTile;
  }
  getPlayerName(player: Index) {
    return `[${player}]: ${this.players[player].protocol}`;
  }
}

export interface State {
  onMove?:  (player: Index, move: Move, tiles: Index[]) => void;
  string:   () => string;
}

const DummyState: State = {
  string: () => 'dummy'
};

