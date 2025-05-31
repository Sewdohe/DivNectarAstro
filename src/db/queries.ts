import type {
  CoinLeaderboardData,
  CoinRow,
  PlayerData,
  LeaderboardData,
} from "./interfaces";
import connection from "./connection";

interface ServerTAPPlayerResponse {
  uuid: string;
  displayName: string;
  lastPlayed: number;
}

export async function getPlayerData(): Promise<PlayerData[]> {
  const [sqlPlayerData]: [PlayerData[], any] = await connection.query(`
    SELECT lands_players.uuid,
           lands_players.name,
           power_level.level         as powerLevel,
           alchemy_level.level       as alchemyLevel,
           archery_level.level       as archeryLevel,
           digging_level.level       as diggingLevel,
           enchanting_level.level    as enchantingLevel,
           farming_level.level       as farmingLevel,
           fishing_level.level       as fishingLevel,
           heavy_armor_level.level   as heavyArmorLevel,
           heavy_weapons_level.level as heavyWeaponsLevel,
           light_armor_level.level   as lightArmorLevel,
           light_weapons_level.level as lightWeaponsLevel,
           mining_level.level        as miningLevel,
           smithing_level.level      as smithingLevel,
           woodcutting_level.level   as woodcuttingLevel
           FROM lands_players
           JOIN profiles_power as power_level ON lands_players.uuid = power_level.owner
           JOIN profiles_alchemy as alchemy_level ON lands_players.uuid = alchemy_level.owner
           JOIN profiles_archery as archery_level ON lands_players.uuid = archery_level.owner
           JOIN profiles_digging as digging_level ON lands_players.uuid = digging_level.owner
           JOIN profiles_enchanting as enchanting_level ON lands_players.uuid = enchanting_level.owner
           JOIN profiles_farming as farming_level ON lands_players.uuid = farming_level.owner
           JOIN profiles_fishing as fishing_level ON lands_players.uuid = fishing_level.owner
           JOIN profiles_heavy_armor as heavy_armor_level ON lands_players.uuid = heavy_armor_level.owner
           JOIN profiles_heavy_weapons as heavy_weapons_level ON lands_players.uuid = heavy_weapons_level.owner
           JOIN profiles_light_armor as light_armor_level ON lands_players.uuid = light_armor_level.owner
           JOIN profiles_light_weapons as light_weapons_level ON lands_players.uuid = light_weapons_level.owner
           JOIN profiles_mining as mining_level ON lands_players.uuid = mining_level.owner
           JOIN profiles_smithing as smithing_level ON lands_players.uuid = smithing_level.owner
           JOIN profiles_woodcutting as woodcutting_level ON lands_players.uuid = woodcutting_level.owner;
  `);

  const apiMutatedPlayerData = await Promise.all(
    sqlPlayerData.map(async (player) => {
      let serverTapPlayerData = await fetch(
        `${import.meta.env.BACKEND_URL}/skyblock/players/all`
      );
      let playerAPIData =
        (await serverTapPlayerData.json()) as ServerTAPPlayerResponse[];
      let lastPlayedValue: number = 0;

      playerAPIData.forEach((p) => {
        if (p.uuid == player.uuid) {
          lastPlayedValue = p.lastPlayed;
        }
      });

      return {
        ...player,
        lastPlayed: lastPlayedValue,
      };
    })
  );

  // console.log(apiMutatedPlayers)
  return apiMutatedPlayerData;
}

// Get placeholder data
async function getPlaceholderData(placeholder: string, uuid: string) {
  const myHeaders = new Headers();
  myHeaders.append("key", "lesson.848.motion");

  const formdata = new FormData();
  formdata.append("uuid", uuid);
  formdata.append("message", placeholder);
  formdata.append("", "");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
  };

  try {
    const response = await fetch(
      "https://api.divnectar.com/v1/placeholders/replace/",
      requestOptions
    );
    const responseData = await response.text();
    return responseData;
  } catch (e: any) {
    console.log(`Error getting placeholder data: ${e}`);
  }
}
