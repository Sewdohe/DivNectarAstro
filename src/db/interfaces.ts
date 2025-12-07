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

export interface PlayerGlossaryData extends RowDataPacket {
  player_uuid: string;
  username: string;
  nickname: string | null;
  balance: number;
  total_playtime: number;
  last_login: number;
  last_logoff: number;
  discord_id: string | null;
  first_joined: number;
  is_online: boolean;
  total_kills: number;
  total_deaths: number;
  rank: string | null;
  skin: string | null;
  parkour_score: number | null;
  parkour_time: string | null;
}

export interface ServerStatus extends RowDataPacket {
  tps: number;
  players_online: number;
  cpu_usage: number;
  ram_usage: number;
  entities: number;
  chunks_loaded: number;
  free_disk_space: number;
  server_start: number;
  total_players: number;
}