import Konva from 'konva';
import {Index} from '../server/src/shared/types';
import {TilesUI} from './TilesUI';

type WinCardConfig = {
  centerX: number,
  centerY: number,
}

const WIDTH = 1000, HEIGHT = 300;
const PAD = 10;

const SCALE_TILES = .6, SCALE_MELDS = .4;

export default class WinCard {
  private readonly layer: Konva.Layer;
  private readonly group: Konva.Group;
  private readonly melds: TilesUI;
  private readonly tiles: TilesUI;
  constructor(layer: Konva.Layer, {centerX, centerY}: WinCardConfig) {
    this.layer = layer;
    this.group = new Konva.Group({
      x: centerX - WIDTH/2,
      y: centerY - HEIGHT/2,
    });
    this.layer.add(this.group);
    this.melds = new TilesUI(layer, {
      x: centerX - WIDTH/2 + PAD,
      y: 580,
      scaleX: SCALE_MELDS,
      scaleY: SCALE_MELDS,
    });
    this.tiles = new TilesUI(layer, {
      x: centerX - WIDTH/2 + PAD,
      y: 650,
      scaleX: SCALE_TILES,
      scaleY: SCALE_TILES,
    });
  }
  clear() {
    this.group.destroyChildren();
    this.tiles.setTiles([]);
    this.melds.setTiles([]);
    this.layer.draw();
  }
  show(tiles: Index[], melds: Index[], playerName: string, value: number, handName: string) {
    this.group.destroyChildren();
    this.group.add(new Konva.Rect({
      width: WIDTH,
      height: HEIGHT,
      cornerRadius: 5,
      fill: 'white',
      stroke: 'black',
    }));
    this.group.add(new Konva.Text({
      text: `Winner: ${playerName}`,
      fontSize: 40,
      x: PAD,
      y: PAD,
    }));
    this.group.add(new Konva.Text({
      text: `Hand: ${handName} - Faan: ${value}`,
      fontSize: 28,
      x: PAD,
      y: 2*PAD + 40,
    }));
    this.tiles.setTiles(tiles, true);
    this.melds.setTiles(melds, true);
    this.layer.draw();
  }
}