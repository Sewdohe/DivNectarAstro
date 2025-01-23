import { MongoClient } from 'mongodb';

const uri = import.meta.env.MONGO_URI; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

connectToMongoDB();

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
            return {
                body: JSON.stringify({ error: 'User not found' }),
                status: 404,
            };
        }

        return {
            body: JSON.stringify(user),
            status: 200,
        };
    } catch (error) {
        return {
            body: JSON.stringify({ error: error.message }),
            status: 500,
        };
    }
};
