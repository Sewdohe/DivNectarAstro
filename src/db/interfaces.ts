import type { RowDataPacket } from 'mysql2';

export interface PlayerData extends RowDataPacket {
  player_uuid: string;
  username: string;
  lastPlayed: number;
  lastLoginTime: number;
  TotalPlayTime: number;
  balance: number;
  flightCharge: number;
  virtual_holdings: number;
  inventory_holdings: number;
}