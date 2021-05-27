import {Index} from '../server/src/shared/types';
import {Tiles} from '../server/src/shared/Tiles';

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
  require('url:../img/tile-back.svg'),
];


export class TileImages {
  private readonly images: HTMLImageElement[];

  private constructor(images: HTMLImageElement[]) {
    this.images = images;
  }

  public get(tile: Index) {
    if (tile === Tiles.BACK) {
      return this.images[42];
    }
    return this.images[Tiles.getValue(tile)];
  }

  static load(): Promise<TileImages> {
    return Promise.all<HTMLImageElement>(URLS.map((url) => new Promise((resolve) => {
      const imageObj = new Image();
      imageObj.onload = () => resolve(imageObj);
      imageObj.src = url;
    }))).then((images) => {
      return new TileImages(images);
    });
  }
}
