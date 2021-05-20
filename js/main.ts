import {UI} from './UI';
import {openSocket} from "./socket";
import {getInput, sleep} from "./utils";
import {ClientMessage, Move, ServerMessage, TilesSetData} from "../server/src/events";
import {Index} from "../server/src/shared/types";

const connect = async (url: string | null, name: string) => {
  let server = null;
  while (server === null) {
    try {
      server = await openSocket(url ?? getInput('Enter ws(s) url'), name);
    } catch {
      alert('Could not connect.');
    }
  }
  return server;
};

class GameLogic {
  private readonly ui: UI;
  private readonly server: WebSocket;
  constructor(ui: UI, server: WebSocket) {
    this.ui = ui;
    this.server = server;
  }
  private send(message: ClientMessage) {
    this.server.send(JSON.stringify(message));
  }
  private onAlert(message?: string) {
    if (message === undefined) return;
    alert(`SERVER: ${message}`);
  }
  private setTiles(data?: TilesSetData) {
    if (data === undefined) return;
    for (let i=0; i < data.length; ++i) {
      const e = data[i];
      if (e !== null) {
        this.ui.handTiles[i].setTiles(e);
      }
    }
  }
  private setMelds(data?: TilesSetData) {
    if (data === undefined) return;
    for (let i=0; i < data.length; ++i) {
      const e = data[i];
      if (e !== null) {
        this.ui.meldTiles[i].setTiles(e);
      }
    }
  }
  private discardTile(tile?: Index) {
    if (tile === undefined) return;
    if (tile === -1) {
      this.ui.discard.pop();
    } else {
      this.ui.discard.push(tile);
    }
  }
  private sendMove(move: Move) {
    this.send({
      move,
      tiles: this.ui.handTiles[0].getSelected()
    });
  }
  run(): Promise<void> {
    this.ui.clearTiles();
    this.ui.menu.setButtons([
      {
        text: '和',
        color: '#FFD700\n',
        handler: () => this.sendMove(Move.WIN),
      },
      {
        text: '碰',
        color: 'blue',
        handler: () => this.sendMove(Move.PONG),
      },
      {
        text: '杠',
        color: 'green',
        handler: () => this.sendMove(Move.KONG),
      },
      {
        text: '摸',
        color: 'black',
        handler: () => this.sendMove(Move.DEAL),
      },
      {
        text: '打',
        color: 'black',
        handler: () => this.sendMove(Move.HIT),
      }
    ]);
    return new Promise((resolve) => {
      this.server.onclose = () => resolve();
      this.server.onerror = () => this.server.close();
      this.server.onmessage = (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);
          this.onAlert(message.alert);
          this.setTiles(message.set_tiles);
          this.discardTile(message.discard);
          if (message.message) {
            this.ui.menu.showMessage(message.message);
          }
          this.setMelds(message.set_melds);
        } catch {
          console.log('could not parse:', event.data);
        }
        console.log('Received:', event.data);
      };
    });
  }
}

(async () => {
  const name = getInput('Enter a name');
  const url = null; //'ws://localhost:9090';
  const ui = await UI.create('container');

  const run = async () => {
    const server = await connect(url || getInput('Enter ws(s) url'), name);
    await (new GameLogic(ui, server)).run();
  }

  /**
   * Debug functions
   */
  (<any>window).discardRandom = () => {
    const tile = Math.floor(Math.random()*42);
    ui.discard.push(tile);
  }
  (<any>window).discardPop = () => {
    ui.discard.pop();
  }
  (<any>window).addTile = (player: Index, tile: Index) => {
    ui.handTiles[player].addTile(tile);
  }
  (<any>window).ui = ui;

  while(1) {
    await run();
    await sleep(2000);
  }
})();

