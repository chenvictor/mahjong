import ScoreModifier from './ScoreModifier';
import {TileType} from '../../shared/Tiles';

export default class MixedOneSuit extends ScoreModifier {
  protected doCheck(): boolean {
    const simples = [TileType.DOTS, TileType.BAMBOO, TileType.CHARACTERS];
    return simples.filter((type) => this.types.has(type)).length === 1;
  }
}