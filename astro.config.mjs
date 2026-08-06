// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // SSR completo con el adaptador de Cloudflare Pages
  output: 'server',
  adapter: cloudflare({
    // Proxy del runtime de Cloudflare en desarrollo local
    platformProxy: { enabled: true },
    // Desactivar funciones opcionales no usadas en este proyecto
    imageService: 'passthrough',
    sessionKVBindingName: undefined,
  }),
  vite: {
    plugins: [tailwindcss()],
    // Módulos de Node marcados como externos para el runtime de Cloudflare
    ssr: {
      external: ['node:fs', 'node:fs/promises', 'node:path', 'node:buffer'],
    },
  },
});
