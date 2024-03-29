import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-vercel';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      runtime: 'edge',
    }),
  },
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [
    vitePreprocess({
      scss: {
        prependData: '@use "src/variables.scss";',
      },
    }),
    mdsvex(mdsvexConfig),
  ],
};

export default config;
