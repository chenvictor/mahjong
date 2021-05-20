import {Index} from "./shared/types";
import {Move} from "./events";
import * as Tiles from './shared/Tiles';

export type Meld = {
  tiles: Index[];
  hidden: boolean;
}

export const isSameValues = (tiles: Index[], n: number): Meld | null => {
  const values: Index[] = tiles.map(Tiles.getValue);
  const unique = new Set(values);
  if (unique.size === 1 && tiles.length === n) {
    return {
      tiles,
      hidden: false,
    };
  }
  return null;
};
