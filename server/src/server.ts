import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {Game} from './Game';
import {send} from './utils';

const PORT = process.env.PORT ?? 9090;
const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({server});

let game: Game | null;

const pingInterval = setInterval(() => {
  wss.clients.forEach((ws: WebSocket) => {
    ws.ping();
  });
}, 2000);

wss.on('connection', (ws: WebSocket) => {

  if (wss.clients.size > 4) {
    send(ws, {
      full: true,
    });
    ws.terminate();
    return;
  }

  console.log('Connected:', {
    name: ws.protocol,
    n_clients: wss.clients.size,
  });

  // TODO game start condition
  game = new Game(wss);

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      if (game) {
        game.onMessage(ws, data);
      }
    } catch (e) {
      console.error(e);
      console.log('unable to parse:', message);
    }
  });

  ws.on('close', () => {
    game = new Game(wss);
  });
});

wss.on('close', () => {
  clearInterval(pingInterval);
});

//start our server
server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT} :)`);
});
