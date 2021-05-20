"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distribute = exports.genTiles = exports.getValue = exports.getType = exports.TileType = void 0;
const utils_1 = require("./utils");
var TileType;
(function (TileType) {
    TileType[TileType["DOTS"] = 0] = "DOTS";
    TileType[TileType["BAMBOO"] = 9] = "BAMBOO";
    TileType[TileType["CHARACTERS"] = 18] = "CHARACTERS";
    TileType[TileType["WINDS"] = 27] = "WINDS";
    TileType[TileType["DRAGONS"] = 31] = "DRAGONS";
    TileType[TileType["FLOWERS"] = 34] = "FLOWERS";
    TileType[TileType["SEASONS"] = 38] = "SEASONS";
})(TileType = exports.TileType || (exports.TileType = {}));
const NUM_TILES = 42;
const getType = (tile) => {
    const value = exports.getValue(tile);
    if (value >= TileType.SEASONS) {
        return TileType.SEASONS;
    }
    else if (value >= TileType.FLOWERS) {
        return TileType.FLOWERS;
    }
    else if (value >= TileType.DRAGONS) {
        return TileType.DRAGONS;
    }
    else if (value >= TileType.WINDS) {
        return TileType.WINDS;
    }
    else if (value >= TileType.CHARACTERS) {
        return TileType.CHARACTERS;
    }
    else if (value >= TileType.BAMBOO) {
        return TileType.BAMBOO;
    }
    else {
        return TileType.DOTS;
    }
};
exports.getType = getType;
const getValue = (tile) => {
    return tile % NUM_TILES;
};
exports.getValue = getValue;
const genTiles = (exclude) => {
    const tiles = Array(NUM_TILES * 4);
    utils_1.rep(tiles.length, (i) => {
        tiles[i] = i;
    });
    return tiles.filter((tile) => {
        return !exclude.includes(exports.getType(tile));
    });
};
exports.genTiles = genTiles;
const distribute = (n, tiles, start) => {
    const ret = [];
    utils_1.rep(n, () => {
        ret.push([]);
    });
    utils_1.rep(3, () => {
        utils_1.rep(n, (i) => {
            utils_1.rep(4, () => {
                ret[i].push(tiles.popFront());
            });
        });
    });
    utils_1.rep(n, (i) => {
        ret[utils_1.mod(start + i, n)].push(tiles.popFront());
    });
    ret[start].push(tiles.popFront());
    return ret;
};
exports.distribute = distribute;
//# sourceMappingURL=Tiles.js.map