/**
 * Tile image files
 * Source: https://en.wikipedia.org/wiki/Mahjong_tiles#Contents
 */
import Konva from 'konva';
import {Tiles} from "./tiles";
import {Index} from "./types";

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

export class UI {
  public readonly images: HTMLImageElement[];
  private readonly stage: Konva.Stage;
  private readonly backgroundLayer: Konva.Layer;
  private handTiles: Tiles[];
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
    this.stage.add(this.backgroundLayer);
    this.handTiles = [
      new Tiles(this.stage, {
        x: 10,
        y: (HEIGHT - this.images[0].height - 10),
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        draggable: true,
      }, this.images),
    ];
    this.handTiles[0].setTiles([0,1,2,5,3,20,30,41,22]);
    // testing

    (() => {
      const tiles = new Tiles(this.stage, {
        x: 800,
        y: 500,
        scaleX: .5,
        scaleY: .5,
        rotation: 180,
        draggable: false,
      }, this.images);
      tiles.setTiles([42,42,42,42]);
    })();
    this.backgroundLayer.add(new Konva.Rect({
      width: WIDTH,
      height: HEIGHT,
      fill: '#cccccc',
    }));
    this.backgroundLayer.draw();
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
  public setHandTiles(player: Index, tiles: any[]) {
    this.handTiles[player].setTiles(tiles);
  }
  public select(n: number) {
    return this.handTiles[0].select(n);
  }
}
