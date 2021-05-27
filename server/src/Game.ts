import * as WebSocket from 'ws';
import {broadcast, maskTilesSetData, meldTilesSetData, mod, rep, rotate, send, shuffle} from './utils';
import {ClientMessage, Move, ServerMessage} from './events';
import {Deque} from './deque';
import {Index} from './shared/types';
import {calculateWildcard, Tiles, TileType} from './shared/Tiles';
import {WinState} from './states/WinState';
import {Meld} from './Meld';
import {TurnState} from './states/TurnState';

export class Game {
  private readonly wss: WebSocket.Server;
  private readonly players: WebSocket[];
  public readonly nplayers: number;
  public tiles: Deque<Index>;
  private turn: Index;
  private lastTile: Index | null;
  protected handTiles: Set<Index>[];
  protected meldTiles: Meld[][];
  private wildcard: Index;
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

  protected genTiles(): Deque<Index> {
    const tiles = Tiles.generate([TileType.FLOWERS, TileType.SEASONS]);
    return new Deque(shuffle(tiles));
  }

  protected preGame() {
    /**
     * Wildcard
     */
    const discardWild = this.tiles.popBack();
    this.wildcard = calculateWildcard(discardWild);
    this.broadcast({
      discard: discardWild,
      set_wildcard: this.wildcard,
    });
  }

  protected distributeTiles(tiles: Deque<Index>): Set<Index>[] {
    const handTiles: Set<Index>[] = Array(this.nplayers).fill(0).map(() => new Set());
    for (let _ = 0; _ < 3; ++_) {
      handTiles.forEach((hand) => {
        hand.add(tiles.popFront());
        hand.add(tiles.popFront());
        hand.add(tiles.popFront());
        hand.add(tiles.popFront());
      });
    }
    handTiles[this.getTurn()].add(tiles.popFront());
    return handTiles;
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
    for (let player = 0; player < this.nplayers; player++) {
      this.send(player, {names: rotate(player, names)});
    }
    /**
     * Distribute tiles
     */
    this.tiles = this.genTiles();
    this.handTiles = this.distributeTiles(this.tiles);
    this.meldTiles = Array(this.nplayers).fill(0).map(() => []);
    this.broadcastTiles();
    this.broadcastMelds();
    this.broadcast({
      discard: null,
    });

    this.preGame();

    /**
     * Initialize state
     */
    this.setState(new TurnState(this, this.getTurn()));
  }

  public onMessage(ws: WebSocket, message: ClientMessage) {
    const player = this.players.findIndex((player) => player === ws);
    if (this.state.onMove) {
      this.state.onMove(player, message.move, message.tiles);
    }
  }

  public broadcastTiles(showAll: boolean = false, sorted: boolean = false) {
    const tiles = this.handTiles.map((set) => [...set]);
    if (sorted) {
      tiles.forEach((list) => list.sort((a,b) => Tiles.getValue(a) - Tiles.getValue(b)));
    }
    rep(this.nplayers, (i) => {
      const set_tiles = showAll ? rotate(i, tiles) : maskTilesSetData(i, tiles);
      this.send(i, {set_tiles});
    });
  }

  public broadcastMelds(showAll: boolean = false) {
    rep(this.nplayers, (i) => {
      const set_melds = meldTilesSetData(i, this.meldTiles, showAll);
      this.send(i, {set_melds});
    });
  }

  public noWildcards(player: Index, tiles: Index[]): boolean {
    for (const tile of tiles) {
      if (Tiles.getValue(tile) === this.wildcard) {
        this.send(player, {
          message: 'cannot discard wildcard',
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
        discard: -1,
      });
    }
  }

  addMeld(player: Index, meld: Meld) {
    this.meldTiles[player].push(meld);
    this.broadcastMelds();
  }

  exposedPongToKong(player: Index, tile: Index): boolean {
    for (let i = 0; i < this.meldTiles[player].length; i++) {
      const meld = Meld.makeKong([...this.meldTiles[player][i].getRawTiles(), tile], true);
      if (meld !== null) {
        this.meldTiles[player][i] = meld;
        this.broadcastMelds();
        return true;
      }
    }
    return false;
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
  onMove?: (player: Index, move: Move, tiles: Index[]) => void;
  string: () => string;
}
