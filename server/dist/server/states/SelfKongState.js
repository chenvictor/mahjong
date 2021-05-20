"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfKongState = void 0;
const events_1 = require("../events");
const TurnState_1 = require("./TurnState");
const Meld_1 = require("../Meld");
class SelfKongState {
    constructor(game, player, n = 3) {
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
            case events_1.Move.KONG:
                //cancel
                this.game.setState(new TurnState_1.TurnState(this.game, this.player));
                break;
            case events_1.Move.HIT:
                let kong = null;
                if (tiles.length === 1) {
                    // pong => kong meld
                    kong = this.game.extractMeldKong(this.player, tiles[0]);
                }
                else {
                    // hidden kong
                    kong = Meld_1.isSameValues(tiles, 4);
                    if (kong !== null) {
                        kong.hidden = true;
                    }
                }
                if (kong === null)
                    break;
                this.game.addMeld(this.player, kong);
                this.game.removeTiles(this.player, tiles);
                const tile = this.game.tiles.popBack();
                this.game.drawTile(this.player, tile);
                this.game.setState(new TurnState_1.TurnState(this.game, this.player));
                break;
        }
    }
    string() {
        return `${this.game.getPlayerName(this.player)} kong`;
    }
}
exports.SelfKongState = SelfKongState;
//# sourceMappingURL=SelfKongState.js.map