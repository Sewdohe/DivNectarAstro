interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  readonly DB_HOST: string;
  readonly DB_USER: string;
  readonly DB_PASSWORD: string;
  readonly DB_DATABASE: string;
  readonly WP_SITE: string;
  readonly WP_USER: string;
  readonly WP_APP_PASSWORD: string;
  readonly BACKEND_OAUTH_URI: string;
  readonly DISCORD_CLIENT_ID: string;
  readonly DISCORD_CLIENT_SECRET: string;
  readonly DISCORD_REDIRECT_URI: string;
  readonly STRAPI_URL: string;
  readonly STRAPI_API_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}