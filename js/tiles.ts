import Konva from "konva";

const HAND_TILE_SPACING = 110;
const HOVER_OFFSET = 5;
const SELECTED_OFFSET = 20;

const ATTR_INDEX = 'MY_ATTR_INDEX';
const ATTR_TILE = 'MY_ATTR_TILE';
const ATTR_SELECTED = 'MY_ATTR_SELECTED';

type Index = any;

export type TilesConfig = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  draggable: boolean;
};

/**
 * Renders a number of hidden tiles
 */
export class Tiles {
  private readonly config: TilesConfig;
  private layer: Konva.Layer;
  private group: Konva.Group;
  private readonly tileImages: HTMLImageElement[];
  private selection: {
    n: number;
    resolve: any;
    reject: any;
  };
  public constructor(stage: Konva.Stage, config: TilesConfig, tileImages: HTMLImageElement[]) {
    this.config = config;
    this.layer = new Konva.Layer();
    const {draggable, ...rest} = config;
    this.group = new Konva.Group(rest);
    this.tileImages = tileImages;
    this.selection = {
      n: 0,
      resolve: null,
      reject: null,
    };
    this.layer.add(this.group);
    stage.add(this.layer);
    this.initHoverEvents()
    if (draggable) {
      this.initDragEvents();
    }
    this.initSelectEvents();
    this.group.on('click', ({target}) => {
      const index = target.getAttr(ATTR_INDEX);
      const selected = target.getAttr(ATTR_SELECTED);
      const tile = target.getAttr(ATTR_TILE);
      console.log({
        index, tile, selected
      });
      console.log(target.position());
    });
  }
  public setTiles(tiles: any[]): void {
    this.group.destroyChildren();
    for (let i=0; i < tiles.length; ++i) {
      const tile = tiles[i];
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
    }
    this.layer.draw();
  }
  public select(n: number): Promise<[[Index, Index]]> {
    return new Promise((resolve, reject) => {
      this.selection.n = n;
      this.selection.resolve = resolve;
      this.selection.reject = reject;
    });
  }
  private initHoverEvents() {
    this.group.on('mouseover', ({target}) => {
      if (this.config.draggable || this.isSelecting()) {
        document.body.style.cursor = 'pointer';
        target.offsetY(target.offsetY() + HOVER_OFFSET);
        this.layer.draw();
      }
    });
    this.group.on('mouseout', ({target}) => {
      if (this.config.draggable || this.isSelecting()) {
        document.body.style.cursor = 'default';
        target.offsetY(target.offsetY() - HOVER_OFFSET);
        this.layer.draw();
      }
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
      if (this.isSelecting()) {
        if (target.getAttr(ATTR_SELECTED)) {
          this.selection.n++;
          target.setAttr(ATTR_SELECTED, false);
          target.offsetY(target.offsetY() - SELECTED_OFFSET);
        } else if (this.selection.n > 0) {
          this.selection.n--;
          target.setAttr(ATTR_SELECTED, true);
          target.offsetY(target.offsetY() + SELECTED_OFFSET);
        }
        this.group.draw();
      }
    });
  }
  // Drag helpers
  private dragBoundFunc(pos: Konva.Vector2d): Konva.Vector2d {
    const minX = 0;
    const maxX = Math.max(minX, HAND_TILE_SPACING * (this.group.children.length-1));
    return {
      x: Math.max(Math.min(maxX, pos.x), minX),
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
  private isSelecting() {
    return this.selection.resolve !== null;
  }
}
