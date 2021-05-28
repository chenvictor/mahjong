import ScoreModifier from './ScoreModifier';
import {TileGroup, TileType} from '../../shared/Tiles';

export default class AllOneSuit extends ScoreModifier {
  protected doCheck(): boolean {
    if (this.groups.has(TileGroup.HONORS)) return false;
    const simples = [TileType.DOTS, TileType.BAMBOO, TileType.CHARACTERS];
    return simples.filter((type) => this.types.has(type)).length === 1;
  }
}