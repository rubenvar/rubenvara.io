import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-auto';
import mdsvexConfig from './mdsvex.config.js';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    trailingSlash: 'always',
    prerender: {
      default: true,
    },
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
      define: {
        __PKG_VERSION__: JSON.stringify(pkg.version),
      },
    },
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
