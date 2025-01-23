import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return {
      body: JSON.stringify({ error: 'Token is required' }),
      status: 400,
    };
  }

  try {
    // Fetch Discord user data with the token
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json();

    // Insert user into Supabase
    const { error } = await supabase
      .from('users')
      .insert([{ id: userData.id, username: userData.username, avatar: userData.avatar }]);

    if (error) {
      throw error;
    }

    return {
      body: JSON.stringify({ message: 'User created successfully' }),
      status: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify({ error: error.message }),
      status: 500,
    };
  }
};
