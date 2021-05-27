import {Index} from "./types";
import {mod, rep, rotate} from '../utils';
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

export enum TileGroup {
  SIMPLES = TileType.DOTS,
  HONORS = TileType.WINDS,
  BONUS = TileType.FLOWERS,
}

export class Tiles {
  public static readonly NUM_TILES = 42;
  public static readonly BACK = -1;
  public static typeSize(type: TileType): number {
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
  public static getType(tile: Index): TileType {
    const value = Tiles.getValue(tile);
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
  public static getGroup(tile: Index): TileGroup {
    const value = Tiles.getValue(tile);
    if (value >= TileGroup.BONUS) {
      return TileGroup.BONUS;
    } else if (value >= TileGroup.HONORS) {
      return TileGroup.HONORS;
    } else {
      return TileGroup.SIMPLES;
    }
  }
  public static getValue(tile: Index) {
    return tile % Tiles.NUM_TILES;
  }
  public static sanitize(tiles: Index[]): Index[] {
    const have = new Set<Index>();
    for (let i = 0; i < tiles.length; ++i) {
      while (have.has(tiles[i])) {
        tiles[i] += Tiles.NUM_TILES;
      }
      have.add(tiles[i]);
    }
    return tiles;
  }
  public static generate(exclude: TileType[] = [], include: TileType[] = []): Index[] {
    const tiles: Index[] = Array(Tiles.NUM_TILES*4);
    rep(tiles.length, (i) => {
      tiles[i] = i;
    });
    if (exclude.length > 0) {
      return tiles.filter((tile) => {
        return !exclude.includes(Tiles.getType(tile));
      });
    } else if (include.length > 0) {
      return tiles.filter((tile) => {
        return include.includes(Tiles.getType(tile));
      });
    }
    return tiles;
  }
}

export const calculateWildcard = (tile: Index): Index => {
  const value = Tiles.getValue(tile);
  let type = Tiles.getType(tile);
  let size = Tiles.typeSize(type);
  if (type === TileType.DRAGONS) {
    type = TileType.WINDS;
    size = 7;
  }
  const index = value - type;
  const nIndex = (index + 1) % size;
  return type + nIndex;
}
