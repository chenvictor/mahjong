"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameValues = void 0;
const Tiles = require("./shared/Tiles");
const isSameValues = (tiles, n) => {
    const values = tiles.map(Tiles.getValue);
    const unique = new Set(values);
    if (unique.size === 1 && tiles.length === n) {
        return {
            tiles,
            hidden: false,
        };
    }
    return null;
};
exports.isSameValues = isSameValues;
//# sourceMappingURL=Meld.js.map