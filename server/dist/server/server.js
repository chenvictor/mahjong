"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Game_1 = require("./Game");
const utils_1 = require("./utils");
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 9090;
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let game;
wss.on('connection', (ws) => {
    if (wss.clients.size > 4) {
        utils_1.send(ws, {
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
        game = new Game_1.Game(wss);
    }
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (game) {
                game.onMessage(ws, data);
            }
        }
        catch (e) {
            console.error(e);
            console.log('unable to parse:', message);
        }
    });
    ws.on('close', () => {
        console.log('Disconnected:', {
            name: ws.protocol,
        });
        utils_1.broadcast(wss, {
            alert: 'someone disconnected',
        });
        wss.clients.forEach((ws) => ws.terminate());
    });
});
//start our server
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT} :)`);
});
//# sourceMappingURL=server.js.map