import * as WebSocket from "ws";
import {ServerMessage, TilesSetData} from "./events";
import {Index} from "./shared/types";
import {Meld} from "./Meld";

// See: https://stackoverflow.com/a/12646864
export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Returns mod in range [0, m)
 * @param v
 * @param m
 */
export const mod = (v: Index, m: number): Index => {
  return ((v % m)+m) % m;
};

export const noop = () => {};

export const identity = <T>(val: T): T => val;

export const send = (ws: WebSocket, data: ServerMessage) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};

export const broadcast = (wss: WebSocket.Server, data: ServerMessage) => {
  wss.clients.forEach((ws) => send(ws, data));
};

export const rotate = <T>(player: Index, array: T[]): T[] => {
  return [...array.slice(player), ...array.slice(0, player)];
};

export const rep = (n: Index, f: (i: Index) => any) => {
  for (let i=0; i < n; ++i) {
    f(i);
  }
}

export const maskTilesSetData = (player: Index, tilesSetData: TilesSetData): TilesSetData => {
  const rot = rotate(player, tilesSetData);
  for (let i=1; i < rot.length; ++i) {
    const e = rot[i];
    if (Array.isArray(e)) {
      rot[i] = e.length;
    }
  }
  return rot;
};

const flatten = <T>(array: T[][]): T[] => {
  return array.reduce((acc, val) => acc.concat(val), []);
};

export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const meldTilesSetData = (player: Index, melds: Meld[][], showAll: boolean): TilesSetData => {
  const rot = rotate(player, melds);
  return rot.map((melds: Meld[], index) => {
    const mapped = melds.map((meld) => meld.toTiles(showAll || index === 0));
    return flatten(mapped);
  });
};
