type Index = any;

export type StartData = {
  position: Index;
  names: string[];
};

export type TilesSetData = Array<Index[] | number | null>;

export type TilesAddData = Array<Index[] | null>;

export type TilesRemData = boolean;

export type ServerMessage = {
  alert?: string;
  start?: StartData;
  set_tiles?: TilesSetData;
  add_tiles?: TilesAddData;
  rem_tiles?: TilesRemData;
}

export enum MOVE {
  WIN,
  KONG,
  PONG,
  DEAL,
  HIT,
  NONE,
}

export type ClientMessage = {
  move: MOVE;
  tiles: Index[];
}

