import {Index} from "./types";
import {mod, rep} from "../utils";
import {Deque} from "../deque";

export enum TileType {
  DOTS = 0,
  BAMBOO = 9,
  CHARACTERS = 18,
  WINDS = 27,
  DRAGONS = 31,
  FLOWERS = 34,
  SEASONS = 38,
}

const typeSize = (type: TileType): number => {
  switch(type) {
    case TileType.DOTS:
    case TileType.BAMBOO:
    case TileType.CHARACTERS:
      return 9;
    case TileType.WINDS:
      return 4;
    case TileType.DRAGONS:
      return 3;
    case TileType.FLOWERS:
    case TileType.SEASONS:
      return 4;
  }
}

const NUM_TILES = 42;

export const getType = (tile: Index): TileType => {
  const value = getValue(tile);
  if (value >= TileType.SEASONS) {
    return TileType.SEASONS;
  } else if (value >= TileType.FLOWERS) {
    return TileType.FLOWERS;
  } else if (value >= TileType.DRAGONS) {
    return TileType.DRAGONS
  } else if (value >= TileType.WINDS) {
    return TileType.WINDS;
  } else if (value >= TileType.CHARACTERS) {
    return TileType.CHARACTERS;
  } else if (value >= TileType.BAMBOO) {
    return TileType.BAMBOO;
  } else {
    return TileType.DOTS;
  }
};

export const getValue = (tile: Index) => {
  return tile % NUM_TILES;
};

export const genTiles = (exclude: TileType[]): Index[] => {
  const tiles: Index[] = Array(NUM_TILES*4);
  rep(tiles.length, (i) => {
    tiles[i] = i;
  });
  return tiles.filter((tile) => {
    return !exclude.includes(getType(tile));
  });
};

export const distribute = (n: number, tiles: Deque<Index>, start: Index): Set<Index>[] => {
  const ret: Set<Index>[] = [];
  rep(n, () => {
    ret.push(new Set());
  });
  rep(3, () => {
    rep(n, (i) => {
      rep(4, () => {
        ret[i].add(tiles.popFront());
      })
    });
  });
  rep(n, (i) => {
    ret[mod(start+i, n)].add(tiles.popFront());
  });
  ret[start].add(tiles.popFront());
  return ret;
};

export const calculateWildcard = (tile: Index): Index => {
  const value = getValue(tile);
  let type = getType(tile);
  let size = typeSize(type);
  if (type === TileType.DRAGONS) {
    type = TileType.WINDS;
    size = 7;
  }
  const index = value - type;
  const nIndex = (index + 1) % size;
  return type + nIndex;
}
