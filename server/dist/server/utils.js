"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meldTilesSetData = exports.maskTilesSetData = exports.rep = exports.rotate = exports.broadcast = exports.send = exports.identity = exports.noop = exports.mod = exports.shuffle = void 0;
// See: https://stackoverflow.com/a/12646864
const WebSocket = require("ws");
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
exports.shuffle = shuffle;
/**
 * Returns mod in range [0, m)
 * @param v
 * @param m
 */
const mod = (v, m) => {
    return ((v % m) + m) % m;
};
exports.mod = mod;
const noop = () => { };
exports.noop = noop;
const identity = (val) => val;
exports.identity = identity;
const send = (ws, data) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
};
exports.send = send;
const broadcast = (wss, data) => {
    wss.clients.forEach((ws) => exports.send(ws, data));
};
exports.broadcast = broadcast;
const rotate = (player, array) => {
    return [...array.slice(player), ...array.slice(0, player)];
};
exports.rotate = rotate;
const rep = (n, f) => {
    for (let i = 0; i < n; ++i) {
        f(i);
    }
};
exports.rep = rep;
const maskTilesSetData = (player, tilesSetData) => {
    const rot = exports.rotate(player, tilesSetData);
    for (let i = 1; i < rot.length; ++i) {
        const e = rot[i];
        if (Array.isArray(e)) {
            rot[i] = e.length;
        }
    }
    return rot;
};
exports.maskTilesSetData = maskTilesSetData;
const flatten = (array) => {
    return array.reduce((acc, val) => acc.concat(val), []);
};
const meldToTiles = (meld, showAll) => {
    const tiles = meld.tiles.slice(0);
    if (meld.hidden && !showAll) {
        tiles.fill(-1);
    }
    return tiles;
};
const meldTilesSetData = (player, melds, showAll) => {
    const rot = exports.rotate(player, melds);
    return rot.map((melds, index) => {
        console.log(melds);
        const mapped = melds.map((meld) => meldToTiles(meld, showAll || index === 0));
        console.log(mapped);
        return flatten(mapped);
    });
};
exports.meldTilesSetData = meldTilesSetData;
//# sourceMappingURL=utils.js.map