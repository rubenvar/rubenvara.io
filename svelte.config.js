import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      edge: true,
    }),
    trailingSlash: 'always',
  },
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [
    preprocess({
      scss: {
        prependData: '@use "src/variables.scss";',
      },
    }),
    mdsvex(mdsvexConfig),
  ],
};

export default config;
