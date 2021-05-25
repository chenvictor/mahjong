import {UI} from './UI';
import {openSocket} from './socket';
import {ClientMessage, Move, ServerMessage, TilesSetData} from '../server/src/events';
import {Index} from '../server/src/shared/types';
import {cleanInput} from './utils';

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
    for (let i = 0; i < data.length; ++i) {
      const e = data[i];
      if (e !== null) {
        this.ui.handTiles[i].setTiles(e);
      }
    }
  }

  private setMelds(data?: TilesSetData) {
    if (data === undefined) return;
    for (let i = 0; i < data.length; ++i) {
      const e = data[i];
      if (e !== null) {
        this.ui.meldTiles[i].setTiles(e, true);
      }
    }
  }

  private discardTile(tile?: Index | null) {
    if (tile === undefined) return;
    if (tile === null) {
      this.ui.discard.clear();
    } else if (tile === -1) {
      this.ui.discard.pop();
    } else {
      this.ui.discard.push(tile);
    }
  }

  private sendMove(move: Move) {
    this.send({
      move,
      tiles: this.ui.handTiles[0].getSelected(),
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
      },
    ]);
    return new Promise((_resolve, reject) => {
      this.server.onclose = () => reject('Connection closed');
      this.server.onerror = () => this.server.close();
      this.server.onmessage = (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);
          if (message.full) {
            this.onAlert('Server Full');
          }
          this.setTiles(message.set_tiles);
          this.discardTile(message.discard);
          if (message.message) {
            this.ui.menu.showMessage(message.message);
          }
          this.ui.setNames(message.names);
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
  const ui = await UI.create('container');
  // @ts-ignore
  const modal = new bootstrap.Modal(document.getElementById('joinModal'), {
    keyboard: false,
    backdrop: 'static',
  });
  modal.show();
  const form = <HTMLFormElement>document.querySelector('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = cleanInput(<string>data.get('name'));
    const url = <string>data.get('url');
    if (!name || !url) {
      return;
    }
    openSocket(url, name).then((ws) => {
      modal.hide();
      return (new GameLogic(ui, ws)).run();
    }).catch((reason) => {
      if (reason) {
        alert(reason);
      }
    }).finally(() => {
      modal.show();
    });
  };
  // Exposed for debugging
  (<any>window).ui = ui;
})();

