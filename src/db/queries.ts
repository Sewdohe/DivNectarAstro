import type {
  PlayerData,
  PlayerGlossaryData,
  ServerStatus,
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
      u.player_uuid,
      u.username,
      u.LastLoginTime,
      u.TotalPlayTime,
      u.flightCharge,
      vh.holdings AS virtual_holdings,
      ph.holdings AS physical_holdings
    FROM
      CMI_users as u
    LEFT JOIN
      economy_holdings AS vh ON u.player_uuid = vh.uid AND vh.holdings_type = 'tne:VIRTUAL_HOLDINGS'
    LEFT JOIN
      economy_holdings AS ph ON u.player_uuid = ph.uid AND ph.holdings_type = 'tne:INVENTORY_HOLDINGS';
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

// Get all players for glossary with comprehensive data
export async function getPlayerGlossary(): Promise<PlayerGlossaryData[]> {
  const [players]: [any[], any] = await connection.query(`
    SELECT
      c.player_uuid,
      c.username,
      c.nickname,
      c.Balance as balance,
      c.TotalPlayTime as total_playtime,
      c.LastLoginTime as last_login,
      c.LastLogoffTime as last_logoff,
      c.Rank as rank,
      c.Skin as skin,
      d.discord as discord_id,
      p.registered as first_joined,
      CASE
        WHEN s.session_end IS NULL AND s.session_start IS NOT NULL THEN 1
        ELSE 0
      END as is_online,
      COALESCE(SUM(s.mob_kills), 0) as total_kills,
      COALESCE(SUM(s.deaths), 0) as total_deaths,
      MAX(pk.score) as parkour_score,
      pk.time as parkour_time
    FROM CMI_users c
    LEFT JOIN discordsrv_accounts d ON c.player_uuid = d.uuid
    LEFT JOIN plan_users pu ON c.player_uuid = pu.uuid
    LEFT JOIN plan_sessions s ON pu.id = s.user_id
    LEFT JOIN (
      SELECT user_id, MAX(session_start) as latest_session
      FROM plan_sessions
      GROUP BY user_id
    ) latest ON pu.id = latest.user_id
    LEFT JOIN plan_users p ON c.player_uuid = p.uuid
    LEFT JOIN \`parkour_leaderboard-default\` pk ON c.player_uuid = pk.uuid
    WHERE c.FakeAccount IS NULL OR c.FakeAccount = 0
    GROUP BY c.player_uuid, c.username, c.nickname, c.Balance, c.TotalPlayTime,
             c.LastLoginTime, c.LastLogoffTime, c.Rank, c.Skin, d.discord, p.registered,
             pk.time
    ORDER BY c.LastLoginTime DESC;
  `);

  return players as PlayerGlossaryData[];
}

// Get server status data
export async function getServerStatus(): Promise<ServerStatus | null> {
  try {
    // Get latest TPS data
    const [tpsData]: [any[], any] = await connection.query(`
      SELECT
        tps,
        players_online,
        cpu_usage,
        ram_usage,
        entities,
        chunks_loaded,
        free_disk_space
      FROM plan_tps
      ORDER BY date DESC
      LIMIT 1;
    `);

    // Get server start date and total players
    const [serverData]: [any[], any] = await connection.query(`
      SELECT
        MIN(session_start) as server_start,
        COUNT(DISTINCT user_id) as total_players
      FROM plan_sessions;
    `);

    if (!tpsData[0] || !serverData[0]) {
      return null;
    }

    return {
      ...tpsData[0],
      server_start: serverData[0].server_start,
      total_players: serverData[0].total_players,
    } as ServerStatus;
  } catch (error) {
    console.error('Error fetching server status:', error);
    return null;
  }
}
