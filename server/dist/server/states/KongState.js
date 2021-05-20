"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KongState = void 0;
const PongState_1 = require("./PongState");
const TurnState_1 = require("./TurnState");
class KongState extends PongState_1.PongState {
    constructor(game, player) {
        super(game, player, 4);
    }
    afterMeld() {
        const tile = this.game.tiles.popBack();
        this.game.drawTile(this.player, tile);
        this.game.setState(new TurnState_1.TurnState(this.game, this.player));
    }
    string() {
        return `${this.game.getPlayerName(this.player)} kong`;
    }
}
exports.KongState = KongState;
//# sourceMappingURL=KongState.js.map