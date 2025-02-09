export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
        return {
            body: JSON.stringify({ error: 'User ID is required' }),
            status: 400,
        };
    }

    try {
        const database = client.db('divnectar');
        const users = database.collection('users');
        const user = await users.findOne({ id: userId });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};