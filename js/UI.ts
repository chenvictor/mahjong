/**
 * Tile image files
 * Source: https://en.wikipedia.org/wiki/Mahjong_tiles#Contents
 */
import Konva from 'konva';
import {TilesUI} from './TilesUI';
import {Menu, MESSAGE_SIZE} from './menu';
import {Discard} from './Discard';
import {TileImages} from './TileImages';
import Wildcard from './Wildcard';
import {centerShapeHorizontal} from './utils';

const WIDTH = 2000, HEIGHT = 1200, PAD = 10;

export class UI {
  public readonly images: TileImages;
  private readonly stage: Konva.Stage;
  private readonly menuLayer: Konva.Layer;
  private readonly handLayer: Konva.Layer;       // Tiles in hand, that can be dragged and selected
  private readonly tilesLayer: Konva.Layer;      // Other tiles
  private readonly backgroundLayer: Konva.Layer;
  public handTiles: TilesUI[];
  public meldTiles: TilesUI[];
  public discard: Discard;
  public wildcard: Wildcard;
  public menu: Menu;
  private readonly names: Konva.Group;

  private constructor(containerId: string, images: TileImages, scale: number) {
    this.images = images;
    this.stage = new Konva.Stage({
      container: containerId,
      width: WIDTH * scale,
      height: HEIGHT * scale,
      scaleX: scale,
      scaleY: scale,
    });
    this.backgroundLayer = new Konva.Layer();
    this.tilesLayer = new Konva.Layer();
    this.handLayer = new Konva.Layer();
    this.menuLayer = new Konva.Layer();
    this.names = new Konva.Group();
    this.menuLayer.add(this.names);
    this.stage.add(this.backgroundLayer);
    this.stage.add(this.tilesLayer);
    this.stage.add(this.handLayer);
    this.stage.add(this.menuLayer);
    this.backgroundLayer.add(new Konva.Rect({
      width: WIDTH,
      height: HEIGHT,
      fill: '#cccccc',
    }));
    (() => {
      // Tiles
      const {width: tileWidth, height: tileHeight} = this.images.get(-1);
      const scaleOther = HEIGHT / WIDTH;
      const configOther = {
        scaleX: scaleOther,
        scaleY: scaleOther,
      };
      const PAD_TB = 2 * (tileHeight * scaleOther + PAD);
      const PAD_LR = tileWidth * scaleOther + PAD;
      this.meldTiles = [
        new TilesUI(this.handLayer, {
          x: PAD_TB + PAD,
          y: HEIGHT - tileHeight - 2 * PAD - tileHeight * scaleOther,
          scaleX: scaleOther,
          scaleY: scaleOther,
        }, this.images),
        new TilesUI(this.tilesLayer, {
          x: WIDTH - 2 * (tileHeight * scaleOther + PAD),
          y: HEIGHT - PAD_LR - PAD,
          rotation: 270,
          ...configOther,
        }, this.images),
        new TilesUI(this.tilesLayer, {
          x: WIDTH - PAD_TB - PAD,
          y: 2 * PAD + tileHeight + tileHeight * scaleOther,
          rotation: 180,
          ...configOther,
        }, this.images),
        new TilesUI(this.tilesLayer, {
          x: 2 * (tileHeight * scaleOther + PAD),
          y: PAD_LR + PAD,
          rotation: 90,
          ...configOther,
        }, this.images),
      ];
      this.handTiles = [
        new TilesUI(this.handLayer, {
          x: PAD_TB + PAD,
          y: HEIGHT - tileHeight - PAD,
          draggable: true,
          selectable: true,
        }, this.images),
        new TilesUI(this.tilesLayer, {
          x: WIDTH - tileHeight * scaleOther - PAD,
          y: HEIGHT - PAD_LR - PAD,
          rotation: 270,
          ...configOther,
        }, this.images),
        new TilesUI(this.tilesLayer, {
          x: WIDTH - PAD_TB - PAD,
          y: tileHeight + PAD,
          rotation: 180,
        }, this.images),
        new TilesUI(this.tilesLayer, {
          x: tileHeight * scaleOther + PAD,
          y: PAD_LR + PAD,
          rotation: 90,
          ...configOther,
        }, this.images),
      ];
      // Menu
      const menuY = HEIGHT - tileHeight - 2 * tileHeight * scaleOther - 3 * PAD - MESSAGE_SIZE;
      this.menu = new Menu(this.menuLayer, {
        x: PAD_TB + 3*PAD,
        y: menuY,
      });
      this.wildcard = new Wildcard(this.menuLayer, {
        x: 1600,
        y: menuY + 50,
        imageScale: .8,
      }, this.images);
    })();
    this.discard = new Discard(this.backgroundLayer, {
      x: 260,
      y: 320,
      width: WIDTH - 590,
      height: HEIGHT - 790,
    }, this.images);
  }

  static async create(containerId: string): Promise<UI> {
    // Get window size
    const {innerWidth, innerHeight} = window;
    const scale = Math.min(innerWidth / WIDTH, innerHeight / HEIGHT);
    const images = await TileImages.load();
    return new UI(containerId, images, scale);
  }

  clearTiles() {
    this.discard.clear();
    this.handTiles.forEach((tiles) => tiles.setTiles(0));
    this.meldTiles.forEach((tiles) => tiles.setTiles(0));
    this.wildcard.set(null);
  }

  setNames(names?: string[]) {
    if (names === undefined) return;
    this.names.destroyChildren();
    const props = [
      {
        x: WIDTH / 2,
        y: HEIGHT - 300,
      },
      {
        x: WIDTH - 250,
        y: HEIGHT / 2,
        rotation: 270,
      },
      {
        x: WIDTH / 2,
        y: 280,
      },
      {
        x: 250,
        y: HEIGHT / 2,
        rotation: 90,
      },
    ];
    names.forEach((name, index) => {
      const text = new Konva.Text({
        text: name,
        fontSize: 32,
        ...props[index],
      });
      this.names.add(centerShapeHorizontal(text));
    });
    this.menuLayer.draw();
  }
}
