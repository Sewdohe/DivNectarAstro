import type { APIRoute } from 'astro';
import { getServerStatus } from '../../db/queries';

export const GET: APIRoute = async () => {
  try {
    const status = await getServerStatus();

    if (!status) {
      return new Response(JSON.stringify({ error: 'Failed to fetch server status' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Server status API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
