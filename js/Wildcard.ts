import Konva from 'konva';
import {TileImages} from './TileImages';
import {Index} from '../server/src/shared/types';
import {centerShapeHorizontal} from './utils';

const FONT_SIZE = 20;

type WildcardConfig = {
  x: number,
  y: number,
  imageScale: number,
}

export default class Wildcard {
  private readonly layer: Konva.Layer;
  private readonly group: Konva.Group;
  private readonly imageScale: number;
  constructor(layer: Konva.Layer, {x, y, imageScale}: WildcardConfig) {
    this.layer = layer;
    this.group = new Konva.Group({
      x,
      y,
    });
    this.imageScale = imageScale;
    this.layer.add(this.group);
  }
  public set(tile: Index | null) {
    this.group.destroyChildren();
    if (tile !== null) {
      this.group.add(centerShapeHorizontal(new Konva.Text({
        fontSize: FONT_SIZE,
        text: 'Wildcard',
      })));
      this.group.add(centerShapeHorizontal(new Konva.Image({
        y: FONT_SIZE,
        scaleX: this.imageScale,
        scaleY: this.imageScale,
        image: TileImages.get(tile),
      })));
    }
    this.layer.draw();
  }
}