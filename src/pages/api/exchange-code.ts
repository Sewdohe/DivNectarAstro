import axios from 'axios';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { code } = await request.json();
    const params = new URLSearchParams();
    params.append('client_id', import.meta.env.DISCORD_CLIENT_ID);
    params.append('client_secret', import.meta.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', import.meta.env.DISCORD_REDIRECT_URI);

    console.log('code', code);
    console.log('params', params.toString());

    const response = await axios.post('https://discord.com/api/oauth2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return new Response(JSON.stringify({ error: 'Error exchanging code for token' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};