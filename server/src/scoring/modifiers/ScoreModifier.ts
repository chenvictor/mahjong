import {Index} from '../../shared/types';
import {TileGroup, Tiles, TileType} from '../../shared/Tiles';

export default abstract class ScoreModifier {
  protected types: Set<TileType> = new Set();
  protected groups: Set<TileGroup> = new Set();
  protected abstract doCheck(): boolean;
  public check(tiles: Index[]): boolean {
    this.types.clear();
    this.groups.clear();
    tiles.forEach((tile) => {
      this.types.add(Tiles.getType(tile));
      this.groups.add(Tiles.getGroup(tile));
    });
    return this.doCheck();
  }
}

