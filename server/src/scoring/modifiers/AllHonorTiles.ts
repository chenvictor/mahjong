import ScoreModifier from './ScoreModifier';
import {TileGroup} from '../../shared/Tiles';

export default class AllHonorTiles extends ScoreModifier {
  protected doCheck(): boolean {
    return !this.groups.has(TileGroup.SIMPLES);
  }
}