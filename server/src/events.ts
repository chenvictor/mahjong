import {Index} from "./shared/types";

export type TilesSetData = Array<Index[] | number | null>;

export type ServerMessage = {
  alert?: string;
  message?: string;
  names?: string[];
  discard?: Index;
  set_tiles?: TilesSetData;
  set_melds?: TilesSetData;
}

export enum Move {
  WIN,
  KONG,
  PONG,
  DEAL,
  HIT,
  NONE,
}

export type ClientMessage = {
  move: Move;
  tiles: Index[];
}

