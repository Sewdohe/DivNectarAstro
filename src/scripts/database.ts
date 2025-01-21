// Import libraries and environment variables
import mysql2 from 'mysql2/promise';
import * as dotenv from "dotenv";
import type { SqlPlayerData, WordpressPlayer, ShorthandPlayerInfo } from "./interfaces";

dotenv.config();

// Variable declarations
var connection: mysql2.Connection;

// Connect to the SQL database
export async function initDatabse() {
  connection = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

// Fetch player data from the database
export async function fetchPlayers() {
  initDatabse();
  // @ts-ignore
  const [results] = await connection.query<SqlPlayerData[]>(`
    SELECT 
      playerdata.uuid,
      playerdata.level,
      playerdata.experience,
      playerdata.class,
      playerdata.guild,
      playerdata.last_login,
      playerdata.professions,
      bank.money,
      bank.interest,
      bank.debt,
      lp.username,
      lp.primary_group,
      isl.center,
      asUser.user_id,
      GROUP_CONCAT(CONCAT(asSkills.skill_name, ':', asSkills.skill_level) SEPARATOR ',') AS skills
    FROM mmocore_playerdata AS playerdata
    JOIN auraskills_users as asUser ON playerdata.uuid = asUser.player_uuid
    JOIN auraskills_skill_levels as asSkills ON asUser.user_id = asSkills.user_id
    JOIN luckperms_players as lp ON playerdata.uuid = lp.uuid
    LEFT JOIN bank ON playerdata.uuid = bank.uuid
    LEFT JOIN islands as isl ON playerdata.uuid = isl.owner
    GROUP BY playerdata.uuid;
  `);

  // Transform and map data
  const bluemapTransResults: SqlPlayerData[] = results.map((element: SqlPlayerData) => {
    // Parse the skills string into an object
    //@ts-ignore
    const skillsArray = element.skills.split(',').map(skill => {
      const [name, level] = skill.split(':');
      return { name, level: parseInt(level) };
    });
    element.skills = skillsArray;

    if (element.center) {
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
  });

  const professionTransResults: SqlPlayerData[] = bluemapTransResults.map((element: SqlPlayerData) => {
    const professionData = JSON.parse(element.professions);
    return { ...element, ...professionData };
  });

  const placeHolderRes = await Promise.all(professionTransResults.map(async (player) => {
    const onlineResponse = await isPlayerOnline(player.uuid);
    if (onlineResponse) {
      const vaultResponse = await getPlaceholderData('%vault_eco_balance_formatted%', player.uuid);
      player.vault_balance = vaultResponse!;
      return { ...player, vault_balance: vaultResponse! };
    } else {
      return { ...player };
    }
  }));

  console.log(placeHolderRes);
  return placeHolderRes;
}

// Get tables for debugging purposes
async function getTables() {
  const tables = await connection.query('SHOW tables');
  console.log(tables);

  const [results] = await connection.query('SELECT * FROM auraskills_skill_levels');
  console.log(results);
}

// Get user information from WordPress
async function getUserSlugsAndIDs() {
  try {
    const response = await axios.get<WordpressPlayer[]>(`${process.env.WP_SITE}/wp-json/wp/v2/player`);
    let userSlugs: ShorthandPlayerInfo[] = response.data.map((userData: WordpressPlayer) => {
      return {
        id: userData.id,
        slug: userData.slug,
        uuid: userData.acf.uuid,
        account_name: userData.acf.account_name
      };
    });
    return userSlugs;
  } catch {
    console.log("error getting post slugs and IDs");
  }
}

// Update or create WordPress user data
async function updateOrCreateWordpressUserData(wordpressUserData: ShorthandPlayerInfo[], players: SqlPlayerData[]) {
  players.forEach((sqlPlayerData: SqlPlayerData) => {
    console.log(`Checking if player ${sqlPlayerData.username} exists...`);
    let alreadyExists = false;
    wordpressUserData.forEach(slugData => {
      if (slugData.account_name === sqlPlayerData.username) {
        alreadyExists = true;
        console.log(`${sqlPlayerData.username} already exists!!! Update....`);
        updateWordpressPost(sqlPlayerData, slugData.id);
      }
    });
    if (!alreadyExists) {
      console.log(`${sqlPlayerData.username} is a new player!!!`);
      createWordPressPost(sqlPlayerData);
    }
  });
}

// Update a WordPress player post
async function updateWordpressPost(player: SqlPlayerData, wordpressID: string) {
  try {
    // Prepare the ACF fields
    const acfFields: any = {
      uuid: player.uuid,
      level: player.level,
      experience: player.experience,
      class: player.class,
      guild: player.guild,
      last_login: player.last_login,
      // from bank
      bank_account: player.money,
      interest: player.interest,
      debt: player.debt,
      account_name: player.username,
      lp_group: player.primary_group,
      bluemap_x: player.bluemap_x,
      bluemap_y: player.bluemap_y,
      bluemap_z: player.bluemap_z,
      avatar_url: `https://mc-heads.net/body/${player.uuid}`,
      vault_balance: player.vault_balance,
      p_smithing_level: player.smithing.level,
      p_woodcutting_level: player.woodcutting.level,
      p_farming_level: player.farming.level,
      p_fishing_level: player.fishing.level,
      p_alchemy_level: player.alchemy.level,
      p_mining_level: player.mining.level,
      p_smelting_level: player.smelting.level,
      p_enchanting_level: player.smelting.level,
    };

    // Add skill data to ACF fields
    for (const skillData of Object.values(player.skills)) {
      const skillName = skillData.name.split('/').pop(); // Extract the skill name
      acfFields[`skill_${skillName}`] = skillData.level;
    }

    console.log(acfFields);

    // Update the WordPress post
    const response = await axios.put(
      `${process.env.WP_SITE}/wp-json/wp/v2/player/${parseInt(wordpressID)}`,
      {
        title: player.username,
        status: 'publish',
        slug: player.username,
        featured_image: `https://mc-heads.net/body/${player.uuid}`,
        acf: acfFields,
      },
      {
        auth: {
          username: process.env.WP_USER!,
          password: process.env.WP_APP_PASSWORD!,
        },
      }
    );

    // Get list of WordPress users from website
    const user_res = await axios.get(
      `${process.env.WP_SITE}/wp-json/wp/v2/users/`,
      {
        auth: {
          username: process.env.WP_USER!,
          password: process.env.WP_APP_PASSWORD!,
        },
      }
    );

    const players_posts = response.data;
    const wordpress_users = user_res.data;

    // console.log(`Post updated for player: ${player.account_name}`);
    return players_posts;
  } catch (error: any) {
    console.error(`Failed to update post for ${player.username}:`, error.response?.data || error.message);
  }
}

// Create a WordPress post for each player
async function createWordPressPost(player: SqlPlayerData) {
  try {
    // Prepare the ACF fields
    const acfFields: any = {
      uuid: player.uuid,
      level: player.level,
      experience: player.experience,
      class: player.class,
      guild: player.guild,
      last_login: player.last_login,
      // from bank
      bank_account: player.money,
      interest: player.interest,
      debt: player.debt,
      account_name: player.username,
      lp_group: player.primary_group,
      bluemap_x: player.bluemap_x,
      bluemap_y: player.bluemap_y,
      bluemap_z: player.bluemap_z,
      avatar_url: `https://mc-heads.net/body/${player.uuid}`,
      vault_balance: player.vault_balance,
      p_smithing_level: player.smithing.level,
      p_woodcutting_level: player.woodcutting.level,
      p_farming_level: player.farming.level,
      p_fishing_level: player.fishing.level,
      p_alchemy_level: player.alchemy.level,
      p_mining_level: player.mining.level,
      p_smelting_level: player.smelting.level,
      p_enchanting_level: player.smelting.level,
    };

    // Add skill data to ACF fields
    for (const skillData of Object.values(player.skills)) {
      const skillName = skillData.name.split('/').pop(); // Extract the skill name
      acfFields[`skill_${skillName}`] = skillData.level;
    }

    // Create the WordPress post
    const response = await axios.post(
      `${process.env.WP_SITE}/wp-json/wp/v2/player`,
      {
        title: player.username,
        status: 'publish',
        slug: player.username,
        featured_image: `https://mc-heads.net/body/${player.uuid}`,
        acf: acfFields,
      },
      {
        auth: {
          username: process.env.WP_USER!,
          password: process.env.WP_APP_PASSWORD!,
        },
      }
    );

    const newPost = response.data;

    // console.log(`Post created for player: ${player.account_name}`);
    return newPost;
  } catch (error: any) {
    console.error(`Failed to create post for ${player.username}:`, error.response?.data || error.message);
  }
}

// Extract numbers from a string
function extractNumbers(input: string) {
  const regex = /(\d+\.\d+)/g;
  const matches = input.match(regex);
  return matches;
}

// Start the update loop
function startUpdateLoop(updateTimeInMilis: number) {
  setInterval(async () => {
    const userSlugAndIDs = await getUserSlugsAndIDs();
    const players = await fetchPlayers();
    updateOrCreateWordpressUserData(userSlugAndIDs!, players);
  }, updateTimeInMilis);
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
    const response = await fetch("https://api.divnectar.com/v1/placeholders/replace/", requestOptions);
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

// Main function
(async () => {
  await initDatabse();
  startUpdateLoop(30000);
})();