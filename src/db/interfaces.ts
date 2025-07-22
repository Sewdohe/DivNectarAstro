import type { RowDataPacket } from 'mysql2';

export interface PlayerData extends RowDataPacket {
  player_uuid: string;
  username: string;
  lastPlayed: number;
  lastLoginTime: number;
  balance: number;
  flightCharge: number;
}