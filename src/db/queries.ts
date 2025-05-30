import type { CoinLeaderboardData, CoinRow, PlayerData, LeaderboardData } from "./interfaces";
import connection from "./connection";

interface ServerTAPPlayerResponse {
  uuid: string;
  displayName: string;
  lastPlayed: number;
}

export async function getPlayerData(): Promise<PlayerData[]> {
  // const [rows]: [SqlPlayerData[], any] = await connection.query(`
  //   SELECT
  //     playerdata.uuid,
  //     playerdata.level,
  //     playerdata.experience as mmo_experience,
  //     exp.total_exp as vanilla_experience,
  //     exp.exp_lvl as vanilla_experience_level,
  //     playerdata.class,
  //     playerdata.guild,
  //     playerdata.last_login,
  //     playerdata.professions,
  //     bank.money,
  //     bank.interest,
  //     bank.debt,
  //     coins.coin,
  //     lp.username,
  //     lp.primary_group,
  //     isl.center,
  //     isl_homes.location as island_home,
  //     asUser.user_id,
  //     GROUP_CONCAT(CONCAT(asSkills.skill_name, ':', asSkills.skill_level) SEPARATOR ',') AS skills
  //     FROM mmocore_playerdata AS playerdata
  //     JOIN auraskills_users as asUser ON playerdata.uuid = asUser.player_uuid
  //     JOIN auraskills_skill_levels as asSkills ON asUser.user_id = asSkills.user_id
  //     JOIN luckperms_players as lp ON playerdata.uuid = lp.uuid
  //     LEFT JOIN bank ON playerdata.uuid = bank.uuid
  //     LEFT JOIN mpdb_experience as exp ON playerdata.uuid = exp.player_uuid
  //     LEFT JOIN coinsengine_users as coins ON playerdata.uuid = coins.uuid
  //     LEFT JOIN islands as isl ON playerdata.uuid = isl.owner
  //     LEFT JOIN islands_homes as isl_homes ON isl_homes.island = isl.uuid
  //     GROUP BY playerdata.uuid;
  // `);

  const [sqlPlayerData]: [PlayerData[], any] = await connection.query(`
    SELECT
      lands_players.uuid,
      lands_players.name
      FROM lands_players AS lands_players;
  `);

  const apiMutatedPlayerData = await Promise.all(
    sqlPlayerData.map(async (player) => {
      let serverTapPlayerData = await fetch(`${import.meta.env.BACKEND_URL}/skyblock/players/all`);
      let playerAPIData = await serverTapPlayerData.json() as ServerTAPPlayerResponse[];
      let lastPlayedValue: number = 0;

      playerAPIData.forEach(p => {
        if (p.uuid == player.uuid) {
          lastPlayedValue = p.lastPlayed
        }
      })

      return {
          ...player,
          lastPlayed: lastPlayedValue,
        };
    })
  )

  // console.log(apiMutatedPlayers)
  return apiMutatedPlayerData;
}

export async function getLeaderboard(leaderboardName: string) {
  const [rows]: [LeaderboardData[], any] = await connection.query(`
    SELECT
      namecache as playername,
      value,
      id
      FROM ajlb_${leaderboardName} AS playerdata
      ORDER BY value DESC LIMIT 10;
  `);

  return rows;
}

export async function getCoinsLeaderBoard() {
  const [rows]: [CoinRow[], any] = await connection.query(`
    SELECT * FROM coinsengine_users ORDER BY coin DESC LIMIT 10;
  `);

  const leaderboardData: CoinLeaderboardData[] = rows.map(
    (row: CoinRow, index) => {
      return { coins: row.coin, position: index + 1, uuid: row.uuid };
    }
  );
  return leaderboardData;
}

export async function getBankLeaderboard() {
  const [rows]: [CoinRow[], any] = await connection.query(`
    SELECT * FROM coinsengine_users ORDER BY coin DESC LIMIT 10;
  `);

  const leaderboardData: CoinLeaderboardData[] = rows.map(
    (row: CoinRow, index) => {
      return { coins: row.coin, position: index + 1, uuid: row.uuid };
    }
  );
  return leaderboardData;
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

// Check if a player is online
async function isPlayerOnline(uuid: string) {
  const onlineResponse = await getPlaceholderData("%player_online%", uuid);
  return onlineResponse === `"yes"`;
}

// Extract numbers from a string
function extractNumbers(input: string) {
  const regex = /(\d+\.\d+)/g;
  const matches = input.match(regex);
  return matches;
}
