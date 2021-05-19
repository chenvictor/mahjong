/**
 * Tile image files
 * Source: https://en.wikipedia.org/wiki/Mahjong_tiles#Contents
 */
import Konva from 'konva';
import {Tiles} from "./tiles";
import {Menu} from "./menu";
import {Discard} from "./discard";

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

const WIDTH = 2000, HEIGHT = 1200, PAD = 10;

const DISCARD_PAD = 280, DISCARD_PAD_BOT = 450;

export class UI {
  public readonly images: HTMLImageElement[];
  private readonly stage: Konva.Stage;
  private readonly menuLayer: Konva.Layer;
  private readonly handLayer: Konva.Layer;       // Tiles in hand, that can be dragged and selected
  private readonly tilesLayer: Konva.Layer;      // Other tiles
  private readonly backgroundLayer: Konva.Layer;
  public handTiles: Tiles[];
  public showTiles: Tiles[];
  public discard: Discard;
  public menu: Menu;
  private constructor(containerId: string, images: HTMLImageElement[], scale: number) {
    this.images = images;
    this.stage = new Konva.Stage({
      container: containerId,
      width: WIDTH*scale,
      height: HEIGHT*scale,
      scaleX: scale,
      scaleY: scale,
    });
    this.backgroundLayer = new Konva.Layer();
    this.tilesLayer = new Konva.Layer();
    this.handLayer = new Konva.Layer();
    this.menuLayer = new Konva.Layer();
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
      const {width: tileWidth, height: tileHeight} = this.images[0];
      const scaleOther = HEIGHT / WIDTH * 1;
      const configOther = {
        scaleX: scaleOther,
        scaleY: scaleOther,
      };
      const PAD_TB = 2*tileHeight*scaleOther + PAD;
      const PAD_LR = tileWidth*scaleOther + PAD;
      this.showTiles = [
        new Tiles(this.handLayer, {
          x: PAD_TB + PAD,
          y: HEIGHT - tileHeight - 2*PAD - tileHeight*scaleOther,
          scaleX: scaleOther,
          scaleY: scaleOther,
          selectable: true,
        }, this.images),
        new Tiles(this.tilesLayer, {
          x: WIDTH - 2*(tileHeight*scaleOther + PAD),
          y: HEIGHT - PAD_LR - PAD,
          rotation: 270,
          ...configOther,
        }, this.images),
        new Tiles(this.tilesLayer, {
          x: WIDTH - PAD_TB - PAD,
          y: 2*PAD + tileHeight + tileHeight*scaleOther,
          rotation: 180,
          ...configOther,
        }, this.images),
        new Tiles(this.tilesLayer, {
          x: 2*(tileHeight*scaleOther + PAD),
          y: PAD_LR + PAD,
          rotation: 90,
          ...configOther,
        }, this.images),
      ];
      this.handTiles = [
        new Tiles(this.handLayer, {
          x: PAD_TB + PAD,
          y: HEIGHT - tileHeight - PAD,
          draggable: true,
          selectable: true,
        }, this.images),
        new Tiles(this.tilesLayer, {
          x: WIDTH - tileHeight*scaleOther - PAD,
          y: HEIGHT - PAD_LR - PAD,
          rotation: 270,
          ...configOther,
        }, this.images),
        new Tiles(this.tilesLayer, {
          x: WIDTH - PAD_TB - PAD,
          y: tileHeight + PAD,
          rotation: 180,
        }, this.images),
        new Tiles(this.tilesLayer, {
          x: tileHeight*scaleOther + PAD,
          y: PAD_LR + PAD,
          rotation: 90,
          ...configOther,
        }, this.images),
      ];
      // Menu
      this.menu = new Menu(this.menuLayer, {
        x: PAD_TB + PAD,
        y: HEIGHT - tileHeight - 2*tileHeight*scaleOther - 3*PAD,
      });
    })();
    this.discard = new Discard(this.backgroundLayer, {
      x: DISCARD_PAD,
      y: DISCARD_PAD,
      width: WIDTH - 2*DISCARD_PAD,
      height: HEIGHT - DISCARD_PAD - DISCARD_PAD_BOT,
    }, this.images);
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
}
