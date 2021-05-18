import Konva from "konva";
import {UI, HAND_TILE_SPACING} from "./ui";

/**
 * Renders a number of hidden tiles (for opponent tiles)
 */
export default class Tiles {
  private ui: UI;
  private group: Konva.Group;
  private tiles: any[];
  public constructor(ui: UI, layer: Konva.Layer, config: any) {
    this.ui = ui;
    this.group = new Konva.Group(config);
    this.tiles = [];
    layer.add(this.group);
  }
  private draw() {
    this.group.destroyChildren();
    for (let i=0; i < this.tiles.length; ++i) {
      f
    }
  }
  setTiles(tiles: any[]) {
    this.tiles = tiles;
    this.draw();
  }
}
