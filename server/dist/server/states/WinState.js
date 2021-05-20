"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinState = void 0;
class WinState {
    constructor(game) {
        this.game = game;
        this.ready = Array(game.nplayers).fill(false);
        this.numReady = 0;
        this.message();
        this.game.broadcastTiles(true);
    }
    message() {
        this.game.broadcast({
            message: `Click any button to start game; ${this.numReady}/${this.game.nplayers} players are ready.`
        });
    }
    onMove(player, _move, _tiles) {
        if (this.ready[player])
            return;
        this.ready[player] = true;
        this.numReady++;
        if (this.numReady === this.game.nplayers) {
            this.game.start();
        }
        else {
            this.message();
        }
    }
    string() {
        return 'waiting for players to ready';
    }
}
exports.WinState = WinState;
//# sourceMappingURL=WinState.js.map