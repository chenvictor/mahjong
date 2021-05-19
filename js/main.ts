import {UI} from './ui';
import {Index} from "./types";
import {openSocket} from "./socket";
import {getInput, sleep} from "./utils";
import {ClientMessage, MOVE, ServerMessage} from "../server/src/events";

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


(async () => {
  const name = getInput('Enter a name');
  const ui = await UI.create('container');

  const run = (): Promise<WebSocket> => {
    return new Promise(async (resolve) => {
      const server = await connect('ws://localhost:9090', name);
      const send = (message: ClientMessage) => {
        server.send(JSON.stringify(message));
      };
      ui.menu.setButtons([
        {
          text: '和',
          color: '#FFD700\n',
          handler: () => {
            send({
              move: MOVE.WIN,
              tiles: [],
            });
          }
        },
        {
          text: '碰',
          color: 'blue',
          handler: () => {
            send({
              move: MOVE.PONG,
              tiles: [],
            });
          }
        },
        {
          text: '杠',
          color: 'green',
          handler: () => {
            send({
              move: MOVE.KONG,
              tiles: [],
            });
          }
        },
        {
          text: '摸',
          color: 'black',
          handler: () => {
            send({
              move: MOVE.DEAL,
              tiles: [],
            });
          }
        },
        {
          text: '打',
          color: 'black',
          handler: () => {
            send({
              move: MOVE.HIT,
              tiles: [],
            });
          }
        }
      ]);
      server.onclose = () => resolve(server);
      server.onerror = () => resolve(server);
      server.onmessage = (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);
          if ('alert' in message) {
            alert(`SERVER: ${message.alert}`);
          }
        } catch {
          console.log('could not parse:', event.data);
        }
        console.log('Received:', event.data);
      };
    });
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
    const server = await run();
    server.close();
    await sleep(2000);
  }
})();

