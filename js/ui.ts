/**
 * Tile image files
 * Source: https://en.wikipedia.org/wiki/Mahjong_tiles#Contents
 */
import Konva from 'konva';

const URLS = [
  // Dots
  'https://upload.wikimedia.org/wikipedia/commons/b/b3/MJt1-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a4/MJt2-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/44/MJt3-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/66/MJt4-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/72/MJt5-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/8/86/MJt6-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6c/MJt7-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/66/MJt8-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/MJt9-.svg',
  // Bamboo
  'https://upload.wikimedia.org/wikipedia/commons/e/e8/MJs1-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/97/MJs2-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/1/1f/MJs3-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b1/MJs4-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/61/MJs5-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/63/MJs6-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8a/MJs7-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/be/MJs8-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f3/MJs9-.svg',
  // Characters
  'https://upload.wikimedia.org/wikipedia/commons/3/32/MJw1-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/70/MJw2-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d0/MJw3-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6b/MJw4-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4b/MJw5-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4c/MJw6-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/c/c0/MJw7-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d3/MJw8-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/MJw9-.svg',
  // Winds+Dragons
  'https://upload.wikimedia.org/wikipedia/commons/9/90/MJf1-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/bb/MJf2-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/54/MJf3-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/d/df/MJf4-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/20/MJd1-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8c/MJd2-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/52/MJd3-.svg',
  // Seasons+Flowers
  'https://upload.wikimedia.org/wikipedia/commons/1/14/MJh1-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/MJh2-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/25/MJh3-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b7/MJh4-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8b/MJh5-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b3/MJh6-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b6/MJh7-.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9c/MJh8-.svg',
  require('url:../img/tile-back.svg')
];

const WIDTH = 2000, HEIGHT = 1200;
export const HAND_TILE_SPACING = 110;
const HOVER_OFFSET = 5;
const SELECTED_OFFSET = 20;

const ATTR_INDEX = 'MY_ATTR_INDEX';
const ATTR_TILE = 'MY_ATTR_TILE';
const ATTR_SELECTED = 'MY_ATTR_SELECTED';

type Index = any;

type UIEvent = 'click';
type UIEventClickHandler = (tile: Index, idx: Index) => void;

export class UI {
  public readonly scale: number;
  public readonly images: HTMLImageElement[];
  private readonly stage: Konva.Stage;
  private readonly handLayer: Konva.Layer;
  private readonly handY: number;
  private selection: {
    n: number,
    resolve?: any,
    reject?: any
  }
  private constructor(containerId: string, images: HTMLImageElement[], scale: number) {
    this.scale = scale;
    this.images = images;
    this.stage = new Konva.Stage({
      container: containerId,
      width: WIDTH*scale,
      height: HEIGHT*scale,
    });
    this.handLayer = new Konva.Layer();
    this.stage.add(this.handLayer);
    this.handY = (HEIGHT - this.images[0].height - 10)*scale;
    this.selection = {
      n: 0,
      resolve: null,
      reject: null,
    };
    this.handLayer.on('mouseover', (evt) => {
      const shape = evt.target;
      document.body.style.cursor = 'pointer';
      shape.offsetY(shape.offsetY() + HOVER_OFFSET*scale);
      this.handLayer.draw();
    });
    this.handLayer.on('mouseout', (evt) => {
      const shape = evt.target;
      document.body.style.cursor = 'default';
      shape.offsetY(shape.offsetY() - HOVER_OFFSET*scale);
      this.handLayer.draw();
    });
    this.handLayer.on('dragstart', (evt) => {
      const shape = evt.target;
      shape.moveToTop();
    });
    this.handLayer.on('dragmove', (evt) => {
      const shape = evt.target;
      const dIndex = shape.getAttr(ATTR_INDEX);
      const nIndex = this.posToIndex(shape.x());
      if (nIndex !== dIndex) {
        shape.setAttr(ATTR_INDEX, nIndex);
        this.handLayer.children.each((child) => {
          if (child == shape) return;
          const cIndex = child.getAttr(ATTR_INDEX);
          if (cIndex === nIndex) {
            this.moveHandTile(child, dIndex);
          }
        });
      }
    });
    this.handLayer.on('dragend', (evt) => {
      const shape = evt.target;
      const nIndex = this.posToIndex(shape.x());
      // Snap back to position
      this.moveHandTile(shape, nIndex, true);
    });
    this.handLayer.on('click', (evt) => {
      const shape = evt.target;
      if (this.selection.resolve !== null) {
        if (shape.getAttr(ATTR_SELECTED)) {
          this.selection.n++;
          shape.setAttr(ATTR_SELECTED, false);
          shape.offsetY(shape.offsetY() - SELECTED_OFFSET*scale);
        } else if (this.selection.n > 0) {
          this.selection.n--;
          shape.setAttr(ATTR_SELECTED, true);
          shape.offsetY(shape.offsetY() + SELECTED_OFFSET);
        }
        this.handLayer.draw();
      }
    });
  }
  static async create(containerId: string): Promise<UI> {
    // Get window size
    const { innerWidth, innerHeight } = window;
    const scale = Math.min(innerWidth / WIDTH, innerHeight / HEIGHT);
    const images: Array<HTMLImageElement> = await Promise.all<HTMLImageElement>(URLS.map(
      (url) => new Promise((resolve) => {
        const imageObj = new Image();
        imageObj.onload = () => resolve(imageObj);
        imageObj.src = url;
      })));
    return new UI(containerId, images, scale);
  }
  private posToIndex(xPos: number): Index {
    return Math.round(xPos / HAND_TILE_SPACING / this.scale);
}
  private moveHandTile(tile: any, nIndex: any, setZ: boolean = false) {
    tile.setAttr(ATTR_INDEX, nIndex);
    tile.x(nIndex*HAND_TILE_SPACING*this.scale);
    if (setZ) {
      tile.setZIndex(nIndex);
    }
  }
  private dragBoundFunc(pos: Konva.Vector2d): Konva.Vector2d {
    const minX = 0;
    const maxX = Math.max(minX, HAND_TILE_SPACING * (this.handLayer.children.length-1) * this.scale);
    return {
      x: Math.max(Math.min(maxX, pos.x), minX),
      y: this.handY,
    };
  }
  setHand(tiles: any[]): void {
    this.handLayer.destroyChildren();
    for (let i=0; i < tiles.length; ++i) {
      const tile = tiles[i];
      const shape = new Konva.Image({
        x: i*HAND_TILE_SPACING*this.scale,
        y: this.handY,
        draggable: true,
        dragBoundFunc: this.dragBoundFunc.bind(this),
        dragDistance: 5*this.scale,
        image: this.images[tile],
        scale: {
          x: this.scale,
          y: this.scale,
        }
      });
      this.handLayer.add(shape);
      shape.setAttrs({
        [ATTR_INDEX]: i,
        [ATTR_TILE]: tile,
        [ATTR_SELECTED]: false,
      });
    }
    this.handLayer.batchDraw();
  }
  discard(indices: Index[]) {
    indices.sort((a,b) => b-a);
    indices.forEach((index) => {
      this.handLayer.children.each((child) => {
        if (child.index == index) {
          child.destroy();
        } else if (child.index > index) {
          this.moveHandTile(child, child.index - 1);
        }
      });
    });
    this.handLayer.draw();
  }
  select(n: number): Promise<[[Index, Index]]> {
    return new Promise((resolve, reject) => {
      this.selection.n = n;
      this.selection.resolve = resolve;
      this.selection.reject = reject;
    });
  }
  setTilesCount(player: Index, count: number) {

  }
  on(evt: UIEvent, handler: UIEventClickHandler) {
    switch (evt) {
      case 'click':
        this.handLayer.on('click', (evt) => {
          const shape = evt.target;
          handler(shape.getAttr(ATTR_TILE), shape.getAttr(ATTR_INDEX));
        });
    }
  }
}
