import Konva from "konva";
import {clamp} from "./utils";
import {Index} from "../server/src/shared/types";
import {TileImages} from "./TileImages";

const ROTATION = 15;

type DiscardConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Discard {
  private readonly layer: Konva.Layer;
  private readonly group: Konva.Group;
  private readonly config: DiscardConfig;
  private readonly images: TileImages;
  private prevImage: Konva.Image | null;
  private prevIndex: Index | null;
  constructor(layer: Konva.Layer, config: DiscardConfig, images: TileImages) {
    this.layer = layer;
    this.group = new Konva.Group(config);
    this.config = config;
    this.images = images;
    this.prevImage = null;
    this.prevIndex = null;
    this.layer.add(this.group);
    this.layer.draw();
  }
  public clear() {
    this.group.destroyChildren();
    this.prevImage = null;
    this.prevIndex = null;
    this.layer.draw();
  }
  public push(tile: Index) {
    const image = new Konva.Image({
      image: this.images.get(tile),
      scaleX: .5,
      scaleY: .5,
      x: Math.random()*this.config.width,
      rotation: Math.random()*ROTATION*2 - ROTATION,
      y: Math.random()*this.config.height,
      draggable: true,
    });
    image.on('dragstart', () => {
      image.rotation(0);
      image.moveToTop();
    });
    image.on('dragmove', () => {
      const {x, y} = image.position();
      image.position({
        x: clamp(x, 0, this.config.width),
        y: clamp(y, 0, this.config.height),
      });
    });
    this.group.add(image);
    this.layer.draw();
    this.prevIndex = tile;
    this.prevImage = image;
  }
  // Removes the last discarded tile
  public pop() {
    if (this.prevImage !== null) {
      this.prevImage.destroy();
      this.prevImage = null;
      this.prevIndex = null;
      this.layer.draw();
    }
  }
  public peek() {
    return this.prevIndex;
  }
}
