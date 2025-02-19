// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

import node from '@astrojs/node';


// https://astro.build/config
export default defineConfig({
  site: 'https://divnectar.com',
  integrations: [react({
    experimentalReactChildren: true
  }), tailwind(), partytown(), sitemap(), icon(), sitemap()],
  vite: {
    ssr: {
      noExternal: ['@builder.io']
    }
  },
  adapter: node({
    mode: 'standalone'
  }),
  output: 'server'
});