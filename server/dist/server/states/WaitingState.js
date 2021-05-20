"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingState = void 0;
const events_1 = require("../events");
const utils_1 = require("../utils");
const TurnState_1 = require("./TurnState");
const PongState_1 = require("./PongState");
const WinState_1 = require("./WinState");
const KongState_1 = require("./KongState");
const MOVE_NONE = (move) => move === events_1.Move.NONE;
/**
 * Waiting for players to decide their move.
 * After a tile is discarded, either
 * - the next player draws a tile
 * - any player does a meld/wins
 */
class WaitingState {
    constructor(game) {
        this.game = game;
        this.moves = Array(game.nplayers).fill(events_1.Move.NONE);
        this.moves[game.getTurn()] = events_1.Move.DEAL;
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.next();
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
        if (this.shouldEnd(nextMove)) {
            // TODO maybe better way to end game?
            this.game.setState(new WinState_1.WinState(this.game));
            return;
        }
        switch (nextMove) {
            case events_1.Move.DEAL:
                const tile = this.game.tiles.popFront();
                this.game.drawTile(nextPlayer, tile);
                this.game.setState(new TurnState_1.TurnState(this.game, nextPlayer));
                break;
            case events_1.Move.PONG:
                this.game.setState(new PongState_1.PongState(this.game, nextPlayer));
                break;
            case events_1.Move.KONG:
                this.game.setState(new KongState_1.KongState(this.game, nextPlayer));
                break;
            case events_1.Move.WIN:
                this.game.drawTile(nextPlayer, this.game.getDiscard());
                this.game.undiscardTile();
                this.game.setState(new WinState_1.WinState(this.game));
                break;
        }
    }
    set(player, move) {
        this.moves[player] = move;
        if (this.timeout === null || !this.moves.some(MOVE_NONE)) {
            this.next();
        }
    }
    shouldEnd(move) {
        return this.game.tiles.getSize() === 0 && move !== events_1.Move.WIN;
    }
    onMove(player, move, tiles) {
        if (this.shouldEnd(move))
            return;
        switch (move) {
            case events_1.Move.WIN:
            case events_1.Move.PONG:
            case events_1.Move.KONG:
                if (this.game.hasDiscard()) {
                    this.set(player, move);
                }
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
        return 'waiting for players to choose next action';
    }
}
exports.WaitingState = WaitingState;
WaitingState.WAIT_MS = 3000;
//# sourceMappingURL=WaitingState.js.map