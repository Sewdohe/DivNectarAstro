import type { RowDataPacket } from 'mysql2';

export interface PlayerData extends RowDataPacket {
  uuid: string;
  name: string;
  lastPlayed: number;
}

export interface CoinLeaderboardData {
  uuid: string;
  coins: number;
  position: number;
}

export interface LeaderboardData extends RowDataPacket{
  id: string,
  value: number,
  playername: string
}

export interface CoinRow extends RowDataPacket {
  id: number,
  uuid: string,
  name: string,
  coin: number,
  ruby: number,
}

export interface ShorthandPlayerInfo {
  id: string;
  slug: string;
  uuid: string;
  account_name: string;
}