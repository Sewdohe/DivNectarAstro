import axios from 'axios';

export async function GET({ url }) {
  const code = url.searchParams.get('code'); // Extract the `code` from the query string

  if (!code) {
    return {
      status: 400,
      body: JSON.stringify({ error: 'Authorization code missing' }),
    };
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code, // Use the code from the query parameters
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch user information from Discord using the access token
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = userResponse.data;

    // Log the data to the server console
    console.log('OAuth Data:', { code, accessToken, userData });

    return {
      status: 200,
      body: JSON.stringify({ message: 'OAuth success!', user: userData }),
    };
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);

    return {
      status: 500,
      body: JSON.stringify({ error: 'OAuth callback failed' }),
    };
  }
}
