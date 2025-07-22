import type {
  PlayerData,
} from "./interfaces";
import connection from "./connection";

interface ServerTAPPlayerResponse {
  player_uuid: string;
  username: string;
  lastPlayed: number;
}

export async function getPlayerData(): Promise<PlayerData[]> {
  const [sqlPlayerData]: [PlayerData[], any] = await connection.query(`
    SELECT
      player_uuid,
      username,
      LastLoginTime,
      TotalPlayTime,
      balance,
      flightCharge
    FROM
      CMI_users;
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
        if (p.player_uuid == player.player_uuid) {
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
