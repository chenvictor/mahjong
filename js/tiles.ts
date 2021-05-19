import Konva from "konva";
import {clamp} from "./utils";
import {HandTile} from "./types";

const HAND_TILE_SPACING = 110;
const HOVER_OFFSET = 5;
const SELECTED_OFFSET = 20;

const ATTR_INDEX = 'MY_ATTR_INDEX';
const ATTR_TILE = 'MY_ATTR_TILE';
const ATTR_SELECTED = 'MY_ATTR_SELECTED';

type Index = any;

export type TilesConfigParameter = {
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  draggable?: boolean;
  selectable?: boolean;
};

export type TilesConfig = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  draggable: boolean;
  selectable: boolean;
};

/**
 * Assign default values if needed
 * @param params
 */
const paramToConfig = (params: TilesConfigParameter): TilesConfig => {
  return {
    x: params.x ?? 0,
    y: params.y ?? 0,
    scaleX: params.scaleX ?? 1,
    scaleY: params.scaleY ?? 1,
    rotation: params.rotation ?? 0,
    draggable: params.draggable ?? false,
    selectable: params.selectable ?? false,
  };
};

/**
 * Renders a number of hidden tiles
 */
export class Tiles {
  private readonly config: TilesConfig;
  private readonly layer: Konva.Layer;
  private readonly group: Konva.Group;
  private readonly tileImages: HTMLImageElement[];
  public constructor(layer: Konva.Layer, config: TilesConfigParameter, tileImages: HTMLImageElement[]) {
    this.config = paramToConfig(config);
    this.layer = layer;
    const {draggable, selectable, ...rest} = this.config;
    this.group = new Konva.Group(rest);
    this.tileImages = tileImages;
    this.layer.add(this.group);
    if (draggable) {
      this.initDragEvents();
    }
    if (selectable) {
      this.initSelectEvents();
    }
    if (selectable || draggable) {
      this.initHoverEvents();
    }
  }
  public setTiles(tiles: number | Index[]) {
    if (typeof tiles === 'number') {
      tiles = Array(tiles).fill(42);
    }
    this.group.destroyChildren();
    for (let i=0; i < tiles.length; ++i) {
      this.addTile(tiles[i], false);
    }
    this.layer.draw();
  }
  public addTile(tile: Index, redraw: boolean = true) {
    const i = this.getCount();
    const shape = new Konva.Image({
      x: i*HAND_TILE_SPACING,
      y: 0,
      draggable: this.config.draggable,
      dragDistance: 5,
      image: this.tileImages[tile],
    });
    this.group.add(shape);
    shape.setAttrs({
      [ATTR_INDEX]: i,
      [ATTR_TILE]: tile,
      [ATTR_SELECTED]: false,
    });
    if (redraw) {
      this.layer.draw();
    }
  }
  public removeTiles(indices: Index[]) {
    indices.sort((a,b) => b-a);
    for (const i of indices) {
      console.log(i);
      const rem: Array<Konva.Group | Konva.Shape> = [];
      this.group.children.each((child) => {
        const tIdx = child.getAttr(ATTR_INDEX);
        if (tIdx == i) {
          rem.push(child);
        } else if (tIdx > i) {
          this.moveHandTile(child, tIdx-1);
        }
      });
      rem.forEach((child) => child.destroy());
    }
    this.layer.draw();
  }
  public getSelected(): HandTile[] {
    const ret: HandTile[] = [];
    this.group.children.each((child) => {
      if (child.getAttr(ATTR_SELECTED) === true) {
        ret.push({
          value: child.getAttr(ATTR_TILE),
          index: child.getAttr(ATTR_INDEX),
        });
      }
    });
    return ret;
  }
  private initHoverEvents() {
    this.group.on('mouseover', ({target}) => {
      document.body.style.cursor = 'pointer';
      target.offsetY(target.offsetY() + HOVER_OFFSET);
      this.layer.draw();
    });
    this.group.on('mouseout', ({target}) => {
      document.body.style.cursor = 'default';
      target.offsetY(target.offsetY() - HOVER_OFFSET);
      this.layer.draw();
    });
  }
  private initDragEvents() {
    this.group.on('dragstart', ({target}) => {
      target.moveToTop();
    });
    this.group.on('dragmove', ({target}) => {
      const dIndex = target.getAttr(ATTR_INDEX);
      const pos = this.dragBoundFunc(target.position());
      target.position(pos);
      const nIndex = this.posToIndex(pos.x);
      if (nIndex !== dIndex) {
        target.setAttr(ATTR_INDEX, nIndex);
        this.group.children.each((child) => {
          if (child == target) return;
          const cIndex = child.getAttr(ATTR_INDEX);
          if (cIndex === nIndex) {
            this.moveHandTile(child, dIndex);
          }
        });
      }
    });
    this.group.on('dragend', ({target}) => {
      const nIndex = this.posToIndex(target.x());
      // Snap back to position
      this.moveHandTile(target, nIndex, true);
    });
  }
  private initSelectEvents() {
    this.group.on('click', ({target}) => {
      if (target.getAttr(ATTR_SELECTED)) {
        target.setAttr(ATTR_SELECTED, false);
        target.offsetY(target.offsetY() - SELECTED_OFFSET);
      } else {
        target.setAttr(ATTR_SELECTED, true);
        target.offsetY(target.offsetY() + SELECTED_OFFSET);
      }
      this.layer.draw();
    });
  }
  private getCount() {
    return this.group.children.length;
  }
  // Drag helpers
  private dragBoundFunc(pos: Konva.Vector2d): Konva.Vector2d {
    const minX = 0;
    const maxX = Math.max(minX, HAND_TILE_SPACING * (this.getCount()-1));
    return {
      x: clamp(pos.x, minX, maxX),
      y: 0,
    };
  }
  private posToIndex(xPos: number): Index {
    return Math.round(xPos / HAND_TILE_SPACING / this.config.scaleX);
  }
  private moveHandTile(tile: any, nIndex: any, setZ: boolean = false) {
    tile.setAttr(ATTR_INDEX, nIndex);
    tile.x(nIndex*HAND_TILE_SPACING);
    if (setZ) {
      tile.setZIndex(nIndex);
    }
  }
}
