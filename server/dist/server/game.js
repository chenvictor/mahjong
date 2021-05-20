"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const utils_1 = require("./utils");
const events_1 = require("./events");
const deque_1 = require("./deque");
const genTiles = () => {
    const ret = [];
    for (let i = 0; i < 34; ++i) {
        ret.push(i, i, i, i);
    }
    return ret;
};
class Game {
    constructor(wss) {
        this.wss = wss;
        this.players = utils_1.shuffle([...wss.clients]);
        this.nplayers = this.players.length;
        this.tiles = new deque_1.Deque([]);
        this.discardTile = null;
        this.turn = 0;
        this.state = DummyState;
        this.handTiles = [];
    }
    start(turn) {
        if (turn !== undefined) {
            this.turn = turn;
        }
        /**
         * Announce player names
         */
        const names = this.players.map((ws) => ws.protocol);
        for (let player = 0; player < this.nplayers; player++) {
            this.send(player, { names: utils_1.rotate(player, names) });
        }
        /**
         * Distribute tiles
         */
        this.tiles = new deque_1.Deque(utils_1.shuffle(genTiles()));
        this.handTiles = [];
        utils_1.rep(this.nplayers, () => {
            this.handTiles.push([]);
        });
        utils_1.rep(3, () => {
            utils_1.rep(this.nplayers, (i) => {
                utils_1.rep(4, () => {
                    this.handTiles[i].push(this.tiles.popFront());
                });
            });
        });
        utils_1.rep(this.nplayers, (i) => {
            this.handTiles[utils_1.mod(this.getTurn() + i, this.nplayers)].push(this.tiles.popFront());
        });
        this.handTiles[this.getTurn()].push(this.tiles.popFront());
        utils_1.rep(this.nplayers, (i) => {
            this.send(i, { set_tiles: utils_1.maskTilesSetData(i, this.handTiles) });
        });
        /**
         * Initialize state
         */
        this.setState(new WaitingState(this));
    }
    onMessage(ws, message) {
        const player = this.players.findIndex((player) => player === ws);
        console.log({
            player,
            message,
        });
        if (this.state.onMove) {
            this.state.onMove(player, message.move, message.tiles);
        }
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
        this.turn = turn;
    }
    incrementTurn() {
        this.setTurn(utils_1.mod(this.turn + 1, this.nplayers));
    }
}
exports.Game = Game;
const DummyState = {
    string: () => 'dummy'
};
const MOVE_NONE = (move) => move === events_1.Move.NONE;
/**
 * After a tile is discarded, either
 * - the next player draws a tile
 * - any player does a meld/wins
 */
class WaitingState {
    constructor(game) {
        this.game = game;
        this.moves = Array(game.nplayers).fill(events_1.Move.NONE);
        this.timeout = setTimeout(() => {
            this.timeout = null;
            if (!this.moves.every(MOVE_NONE)) {
                this.next();
            }
        }, WaitingState.WAIT_MS);
    }
    next() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        let nextPlayer = -1;
        let nextMove = events_1.Move.NONE;
        for (let i = 0; i < this.game.nplayers; ++i) {
            const player = utils_1.mod(i + this.game.getTurn(), this.game.nplayers);
            console.log({
                player,
                move: this.moves[player],
            });
            if (this.moves[player] < nextMove) {
                nextMove = this.moves[player];
                nextPlayer = player;
            }
        }
        console.log({
            nextMove,
            nextPlayer,
        });
    }
    set(player, move) {
        this.moves[player] = move;
        if (this.timeout === null || !this.moves.some(MOVE_NONE)) {
            this.next();
        }
    }
    onMove(player, move, tiles) {
        switch (move) {
            case events_1.Move.WIN:
            case events_1.Move.PONG:
            case events_1.Move.KONG:
                this.set(player, move);
                break;
            case events_1.Move.DEAL:
                if (this.game.getTurn() === player) {
                    this.set(player, move);
                }
                break;
            case events_1.Move.HIT:
            case events_1.Move.NONE:
                // nothing
                break;
        }
    }
    string() {
        return 'waiting';
    }
}
WaitingState.WAIT_MS = 3000;
//# sourceMappingURL=game.js.map