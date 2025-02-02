import type { RowDataPacket } from 'mysql2';

export interface SqlPlayerData extends RowDataPacket {
  uuid: string;
  level: number;
  vanilla_experience: number;
  mmo_experience: number;
  class: string;
  guild: string;
  last_login: string;
  money: number;
  interest: number;
  debt: number;
  coin: number;
  username: string;
  professions: string;
  primary_group: string;
  center: string;
  island_worth: number;
  rank_island_worth: number;
  p_smithing_lvl: number;
  p_woodcutting_lvl: number;
  p_farming_lvl: number;
  p_fishing_lvl: number;
  p_alchemy_lvl: number;
  p_mining_lvl: number;
  p_smelting_lvl: number;
  p_enchanting_lvl: number;
  onlineStatus?: "yes" | "no";
  bluemap_x: string | null;
  bluemap_y: string | null;
  bluemap_z: string | null;
  skills: { [key: string]: { level: number } };
}

export interface CoinLeaderboardData {
  uuid: string;
  coins: number;
  position: number;
}

export interface CoinRow extends RowDataPacket {
  id: number,
  uuid: string,
  name: string,
  coin: number,
  ruby: number,
}

export interface WordpressPlayer {
  id: string;
  date: Date;
  slug: string;
  status: string;
  type: string;
  link: string;
  acf: {
    uuid: string;
    level: number;
    experience: number;
    class: string;
    guild: string;
    last_login: number;
    money: number;
    interest: number;
    debt: number;
    account_name: string;
    primary_group: string;
    avatar_url: string;
    bluemap_x: string;
    bluemap_y: string;
    blyemap_z: string;
    p_smithing_lvl: number;
    p_woodcutting_lvl: number;
    p_farming_lvl: number;
    p_fishing_lvl: number;
    p_alchemy_lvl: number;
    p_mining_lvl: number;
    p_smelting_lvl: number;
    p_enchanting_lvl: number;
  };
}

export interface ShorthandPlayerInfo {
  id: string;
  slug: string;
  uuid: string;
  account_name: string;
}