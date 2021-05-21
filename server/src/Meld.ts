import {Index} from "./shared/types";
import * as Tiles from './shared/Tiles';
import {unique} from "./utils";

export enum MeldType {
  PONG = 'pong',
  KONG = 'kong',
  CHOW = 'chow',
  EYES = 'eyes',
}

const CHOW_TYPES = new Set([
  Tiles.TileType.DOTS,
  Tiles.TileType.BAMBOO,
  Tiles.TileType.CHARACTERS,
]);

export class Meld {
  protected tiles: Index[];
  private readonly type: MeldType;
  protected readonly exposed: boolean;
  protected constructor(tiles: Index[], type: MeldType, exposed: boolean) {
    this.tiles = tiles;
    this.type = type;
    this.exposed = exposed;
  }
  public getType(): MeldType {
    return this.type;
  }
  public getValues(): Index[] {
    return unique(this.tiles.map(Tiles.getValue));
  }
  public getRawTiles(): Index[] {
    return this.tiles;
  }
  public toTiles(visible: boolean) {
    const copy = this.tiles.slice(0);
    if (!this.exposed && !visible) {
      copy.fill(Tiles.BACK);
    }
    return copy;
  }
  static makePong(tiles: Index[], exposed: boolean): Meld | null {
    const uniqueTiles = unique(tiles.map(Tiles.getValue));
    if (tiles.length === 3 && uniqueTiles.length === 1) {
      return new Meld(tiles, MeldType.PONG, exposed);
    }
    return null;
  }
  static makeKong(tiles: Index[], exposed: boolean): Meld | null {
    const uniqueTiles = unique(tiles.map(Tiles.getValue));
    if (tiles.length === 4 && uniqueTiles.length === 1) {
      return new KongMeld(tiles, exposed);
    }
    return null;
  }
  static makeChow(tiles: Index[], exposed: boolean): Meld | null {
    if (tiles.length !== 3) return null;
    const types = unique(tiles.map(Tiles.getType));
    if (types.length !== 1) return null;
    const type = types[0];
    if (!CHOW_TYPES.has(type)) return null;
    tiles.sort((a, b) => {
      return Tiles.getValue(a) - Tiles.getValue(b);
    });
    const values = tiles.map(Tiles.getValue);
    if (values[0] + 1 === values[1] && values[1] + 1 === values[2]) {
      return new Meld(tiles, MeldType.CHOW, exposed);
    }
    return null;
  }
  static makeEyes(tiles: Index[], exposed: boolean): Meld | null {
    if (tiles.length !== 2) return null;
    const uniqueTiles = unique(tiles.map(Tiles.getValue));
    if (uniqueTiles.length !== 1) return null;
    return new Meld(tiles, MeldType.EYES, exposed);
  }
}

export class KongMeld extends Meld {
  public constructor(tiles: Index[], exposed: boolean) {
    super(tiles, MeldType.KONG, exposed);
  }
  public toTiles(visible: boolean): Index[] {
    const ret = super.toTiles(visible);
    if (!this.exposed) {
      ret[0] = ret[3] = Tiles.BACK;
    }
    return ret;
  }
}
