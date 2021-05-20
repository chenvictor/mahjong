"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongState = void 0;
const events_1 = require("../events");
const DiscardState_1 = require("./DiscardState");
const Meld_1 = require("../Meld");
const WaitingState_1 = require("./WaitingState");
class PongState {
    constructor(game, player, n = 3, cancelMove = events_1.Move.PONG) {
        this.game = game;
        this.player = player;
        this.n = n;
        this.cancelMove = cancelMove;
        game.broadcast({
            message: this.string()
        });
        this.discarded = this.game.getDiscard();
    }
    afterMeld() {
        this.game.setState(new DiscardState_1.DiscardState(this.game, this.player));
    }
    onMove(player, move, tiles) {
        if (player !== this.player)
            return;
        if (move === this.cancelMove) {
            this.game.setState(new WaitingState_1.WaitingState(this.game));
            this.game.broadcast({
                message: this.string() + ' canceled'
            });
            return;
        }
        switch (move) {
            case events_1.Move.HIT:
                const meld = Meld_1.isSameValues([this.discarded, ...tiles], this.n);
                if (meld !== null) {
                    this.game.addMeld(this.player, meld);
                    this.game.removeTiles(this.player, tiles);
                    this.game.undiscardTile();
                    this.afterMeld();
                }
                break;
        }
    }
    string() {
        return `${this.game.getPlayerName(this.player)} pong`;
    }
}
exports.PongState = PongState;
//# sourceMappingURL=PongState.js.map