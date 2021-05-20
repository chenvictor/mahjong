"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnState = void 0;
const events_1 = require("../events");
const DiscardState_1 = require("./DiscardState");
const WinState_1 = require("./WinState");
const SelfKongState_1 = require("./SelfKongState");
class TurnState {
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
        switch (move) {
            case events_1.Move.HIT:
                this.game.setState(new DiscardState_1.DiscardState(this.game, this.player));
                break;
            case events_1.Move.WIN:
                this.game.setState(new WinState_1.WinState(this.game));
                break;
            case events_1.Move.KONG:
                this.game.setState(new SelfKongState_1.SelfKongState(this.game, player));
                break;
        }
    }
    string() {
        return `${this.game.getPlayerName(this.player)}'s turn`;
    }
}
exports.TurnState = TurnState;
//# sourceMappingURL=TurnState.js.map