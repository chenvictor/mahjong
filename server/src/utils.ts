// See: https://stackoverflow.com/a/12646864
import * as WebSocket from "ws";
import {ServerMessage} from "./events";
import {Index} from "../../js/types";

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const mod4 = (index: Index): Index => {
  return ((index % 4)+4) % 4;
};

export const noop = () => {};

export const send = (ws: WebSocket, data: ServerMessage) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};

export const broadcast = (wss: WebSocket.Server, data: ServerMessage) => {
  wss.clients.forEach((ws) => send(ws, data));
};
