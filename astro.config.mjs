// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

import icon from 'astro-icon';

import node from '@astrojs/node';


// https://astro.build/config
export default defineConfig({
  site: 'https://divnectar.com',
  integrations: [
    expressiveCode({
      themes: ['catppuccin-mocha', 'catppuccin-latte'],
      defaultProps: {
        wrap: true,
        preserveIndent: true,
      },
      styleOverrides: {
        borderRadius: '0.5rem',
        borderWidth: '2px',
      },
    }),
    react({
      experimentalReactChildren: true
    }),
    tailwind(),
    partytown(),
    sitemap(),
    icon()
  ],
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