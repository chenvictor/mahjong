import {Index} from "./shared/types";

export type TilesSetData = Array<Index[] | number | null>;

export type ServerMessage = {
  alert?: string;
  full?: true;
  message?: string;
  names?: string[];
  discard?: Index | null;
  set_tiles?: TilesSetData;
  set_melds?: TilesSetData;
  set_wildcard?: Index | null;
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

