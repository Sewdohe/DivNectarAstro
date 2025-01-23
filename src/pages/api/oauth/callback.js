// src/pages/api/oauth/callback.js
import axios from "axios";

export async function GET({ query }) {
  const code = query.get("code");

  if (!code) {
    return {
      body: JSON.stringify({ error: "Authorization code missing" }),
      status: 400,
    };
  }

  try {
    // Send the code to your backend server to exchange for tokens
    const response = await axios.get(`http://backend.divnectar.com/api/oauth/callback?code=${code}`);
    const userData = response.data;

    // Optionally, store user data in a cookie or pass it to the frontend
    return {
      body: JSON.stringify(userData),
      status: 200,
    };
  } catch (error) {
    console.error("Error during OAuth callback", error);
    return {
      body: JSON.stringify({ error: "OAuth process failed" }),
      status: 500,
    };
  }
}
