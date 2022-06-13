import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-auto';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [
    preprocess({
      scss: {
        prependData: '@use "src/variables.scss";',
      },
    }),
    mdsvex(mdsvexConfig),
  ],
  kit: {
    adapter: adapter(),
    vite: {
      // https://github.com/vitejs/vite/issues/6333
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@use "src/variables.scss";',
          },
        },
      },
    },
  },
};

export default config;
