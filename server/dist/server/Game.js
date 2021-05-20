"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const utils_1 = require("./utils");
const deque_1 = require("./deque");
const Tiles = require("./shared/Tiles");
const TurnState_1 = require("./states/TurnState");
const WinState_1 = require("./states/WinState");
const Meld_1 = require("./Meld");
class Game {
    constructor(wss) {
        this.wss = wss;
        this.players = utils_1.shuffle([...wss.clients]);
        this.nplayers = this.players.length;
        this.tiles = new deque_1.Deque([]);
        this.lastTile = null;
        this.turn = 0;
        this.handTiles = [];
        this.meldTiles = [];
        this.state = new WinState_1.WinState(this);
    }
    start(turn) {
        if (turn !== undefined) {
            this.turn = turn;
        }
        /**
         * Announce player names
         */
        const names = [];
        utils_1.rep(this.nplayers, (i) => {
            names.push(this.getPlayerName(i));
        });
        for (let player = 0; player < this.nplayers; player++) {
            this.send(player, { names: utils_1.rotate(player, names) });
        }
        /**
         * Distribute tiles
         */
        this.tiles = new deque_1.Deque(utils_1.shuffle(Tiles.genTiles([Tiles.TileType.FLOWERS, Tiles.TileType.SEASONS])));
        this.handTiles = Tiles.distribute(this.nplayers, this.tiles, this.getTurn());
        this.meldTiles = [];
        utils_1.rep(this.nplayers, () => {
            this.meldTiles.push([]);
        });
        this.broadcastTiles();
        /**
         * Initialize state
         */
        this.setState(new TurnState_1.TurnState(this, this.getTurn()));
    }
    onMessage(ws, message) {
        const player = this.players.findIndex((player) => player === ws);
        if (this.state.onMove) {
            this.state.onMove(player, message.move, message.tiles);
        }
    }
    broadcastTiles(showAll = false) {
        const tiles = this.handTiles.map((set) => [...set]);
        utils_1.rep(this.nplayers, (i) => {
            const set_tiles = showAll ? utils_1.rotate(i, tiles) : utils_1.maskTilesSetData(i, tiles);
            this.send(i, { set_tiles });
        });
    }
    broadcastMelds(showAll = false) {
        utils_1.rep(this.nplayers, (i) => {
            const set_melds = utils_1.meldTilesSetData(i, this.meldTiles, showAll);
            this.send(i, { set_melds });
        });
    }
    discardTile(player, tile) {
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
    removeTiles(player, tiles) {
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
    addMeld(player, meld) {
        this.meldTiles[player].push(meld);
        this.broadcastMelds();
    }
    extractMeldKong(player, tile) {
        for (let i = 0; i < this.meldTiles[player].length; i++) {
            const tiles = [tile, ...this.meldTiles[player][i].tiles];
            const meld = Meld_1.isSameValues(tiles, 4);
            if (meld !== null) {
                this.meldTiles[player].splice(i, 1);
                return meld;
            }
        }
        return null;
    }
    drawTile(player, tile) {
        this.handTiles[player].add(tile);
        this.broadcastTiles();
    }
    send(player, message) {
        utils_1.send(this.players[player], message);
    }
    broadcast(message) {
        utils_1.broadcast(this.wss, message);
    }
    setState(state) {
        this.state = state;
        console.log(`state: ${state.string()}`);
    }
    getTurn() {
        return this.turn;
    }
    setTurn(turn) {
        this.turn = utils_1.mod(turn, this.nplayers);
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
    getPlayerName(player) {
        return `[${player}]: ${this.players[player].protocol}`;
    }
}
exports.Game = Game;
const DummyState = {
    string: () => 'dummy'
};
//# sourceMappingURL=Game.js.map