import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {Game} from "./game";
import {broadcast, send} from "./utils";

const PORT = process.env.PORT ?? 9090;
const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let game: Game | null;

wss.on('connection', (ws: WebSocket) => {

  if (wss.clients.size > 4) {
    send(ws, {
      alert: 'server full',
    });
    ws.terminate();
    return;
  }

  console.log('Connected:', {
    name: ws.protocol,
    n_clients: wss.clients.size,
  });

  // TODO game start condition
  if (true || wss.clients.size === 4) {
    game = new Game(wss);
  }

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      console.log({
        name: ws.protocol,
        data,
      });
      if (game) {
        game.onMessage(ws, data);
      }
    } catch (e) {
      console.error(e);
      console.log('unable to parse:', message);
    }
  });

  ws.on('close', () => {
    console.log('Disconnected:', {
      name: ws.protocol,
    });
    broadcast(wss, {
      alert: 'someone disconnected',
    });
    wss.clients.forEach((ws) => ws.terminate());
  });
});

//start our server
server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT} :)`);
});
