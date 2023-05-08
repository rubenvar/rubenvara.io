import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      edge: true,
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
