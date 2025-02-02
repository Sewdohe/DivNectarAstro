import type { CoinLeaderboardData, CoinRow, SqlPlayerData } from "./interfaces";
import connection from "./connection";

export async function getPlayerData() {
  const [rows]: [SqlPlayerData[], any] = await connection.query(`
    SELECT
      playerdata.uuid,
      playerdata.level,
      playerdata.experience as mmo_experience,
      exp.total_exp as vanilla_experience,
      exp.exp_lvl as vanilla_experience_level,
      playerdata.class,
      playerdata.guild,
      playerdata.last_login,
      playerdata.professions,
      bank.money,
      bank.interest,
      bank.debt,
      coins.coin,
      lp.username,
      lp.primary_group,
      isl.center,
      isl_homes.location as island_home,
      asUser.user_id,
      GROUP_CONCAT(CONCAT(asSkills.skill_name, ':', asSkills.skill_level) SEPARATOR ',') AS skills
      FROM mmocore_playerdata AS playerdata
      JOIN auraskills_users as asUser ON playerdata.uuid = asUser.player_uuid
      JOIN auraskills_skill_levels as asSkills ON asUser.user_id = asSkills.user_id
      JOIN luckperms_players as lp ON playerdata.uuid = lp.uuid
      LEFT JOIN bank ON playerdata.uuid = bank.uuid
      LEFT JOIN mpdb_experience as exp ON playerdata.uuid = exp.player_uuid
      LEFT JOIN coinsengine_users as coins ON playerdata.uuid = coins.uuid
      LEFT JOIN islands as isl ON playerdata.uuid = isl.owner
      LEFT JOIN islands_homes as isl_homes ON isl_homes.island = isl.uuid
      GROUP BY playerdata.uuid;
  `);

  // Transform and map data
  const bluemapTransResults: SqlPlayerData[] = rows.map(
    (element: SqlPlayerData) => {
      // Parse the skills string into an object
      //@ts-ignore
      const skillsArray = element.skills.split(",").map((skill) => {
        const [_name, level] = skill.split(":");
        const [_garbage, name] = _name.split("/");
        return { name, level: parseInt(level) };
      });
      element.skills = skillsArray;

      if (element.island_home) {
        var numbers = extractNumbers(element.center);
        element.bluemap_x = numbers![0];
        element.bluemap_y = numbers![1];
        element.bluemap_z = numbers![2];
        const professionData = JSON.parse(element.professions);
        return { ...element, ...professionData };
      } else {
        element.bluemap_x = null;
        element.bluemap_y = null;
        element.bluemap_z = null;
        return { ...element };
      }
    }
  );

  const professionTransResults: SqlPlayerData[] = bluemapTransResults.map(
    (element: SqlPlayerData) => {
      const professionData = JSON.parse(element.professions);
      return { ...element, ...professionData };
    }
  );

  const placeHolderRes = await Promise.all(
    professionTransResults.map(async (player) => {
      const island_worth = await getPlaceholderData(
        "%superior_island_worth%",
        player.uuid
      );
      const rank_island_worth = await getPlaceholderData(
        "%superior_island_top_worth_position%",
        player.uuid
      );
      const parsedIslandWorth = parseInt(
        island_worth!.replace(/['",]+/g, ""),
        10
      );
      // Remove double quotes and commas, then parse as integer
      const parsedIslandWorthRank = parseInt(
        rank_island_worth!.replace(/['",]+/g, ""),
        10
      );
      player.island_worth = parsedIslandWorth;
      player.rank_island_worth = parsedIslandWorthRank;
      return {
        ...player,
        island_worth: parsedIslandWorth,
        island_worth_rank: parsedIslandWorthRank,
      };
    })
  );

  // console.log("got players data from queries.ts");
  // console.log(placeHolderRes)
  return placeHolderRes;
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
