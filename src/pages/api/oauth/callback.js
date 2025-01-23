export async function GET({ request }) {
  // Add CORS headers to allow your frontend domain
  const headers = {
    'Access-Control-Allow-Origin': 'https://divnectar.com',  // Allow your frontend domain
    'Access-Control-Allow-Methods': 'GET, POST',  // Allowed methods
    'Access-Control-Allow-Headers': 'Content-Type',  // Allowed headers
  };

  // Add your logic to handle the OAuth callback
  const code = new URL(request.url).searchParams.get('code');
  if (!code) {
    return {
      status: 400,
      headers,
      body: JSON.stringify({ error: 'Authorization code missing' }),
    };
  }

  try {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log('OAuth Data:', {
      code,
      accessToken,
      userData: userResponse.data,
    });

    return {
      status: 200,
      headers,
      body: JSON.stringify({ message: 'OAuth success!', user: userResponse.data }),
    };
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);

    return {
      status: 500,
      headers,
      body: JSON.stringify({
        error: 'OAuth callback failed',
        details: error.response?.data || error.message,
      }),
    };
  }
}

export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': 'https://divnectar.com',  // Allow your frontend domain
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Allow methods (including OPTIONS for preflight)
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',  // Allowed headers
  };

  return {
    status: 200,
    headers,
    body: JSON.stringify({ message: 'CORS preflight successful!' }),
  };
}
