import {Game, State} from "../Game";
import {Index} from "../shared/types";
import {Move} from "../events";

export class EndState implements State {
  private readonly game: Game;
  private readonly ready: boolean[];
  private numReady: number;
  constructor(game: Game) {
    this.game = game;
    this.ready = Array(game.nplayers).fill(false);
    this.numReady = 0;
    this.message();
    this.game.broadcastTiles(true, true);
  }
  private message() {
    this.game.broadcast({
      message: `Click any button to start game; ${this.numReady}/${this.game.nplayers} players are ready.`
    });
  }
  onMove(player: Index, _move: Move, _tiles: Index[]) {
    if (this.ready[player]) return;
    this.ready[player] = true;
    this.numReady++;
    if (this.numReady === this.game.nplayers) {
      this.game.start();
    } else {
      this.message();
    }
  }
  string() {
    return 'waiting for players to ready';
  }
}
