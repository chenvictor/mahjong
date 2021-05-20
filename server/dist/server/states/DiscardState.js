"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscardState = void 0;
const events_1 = require("../events");
const WaitingState_1 = require("./WaitingState");
class DiscardState {
    constructor(game, player) {
        this.game = game;
        this.player = player;
        game.broadcast({
            message: this.string()
        });
    }
    onMove(player, move, tiles) {
        if (player !== this.player)
            return;
        if (move === events_1.Move.HIT && tiles.length === 1) {
            if (this.game.discardTile(player, tiles[0])) {
                this.game.setTurn(this.player + 1);
                this.game.broadcast({
                    message: 'tile discarded'
                });
                this.game.setState(new WaitingState_1.WaitingState(this.game));
            }
        }
    }
    string() {
        return `${this.game.getPlayerName(this.player)} is discarding a tile`;
    }
}
exports.DiscardState = DiscardState;
//# sourceMappingURL=DiscardState.js.map