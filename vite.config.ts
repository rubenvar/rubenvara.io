import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

export default defineConfig({
  // // https://github.com/vitejs/vite/issues/6333
  // postcss: {
  //   plugins: [
  //     {
  //       postcssPlugin: 'internal:charset-removal',
  //       AtRule: {
  //         charset: (atRule) => {
  //           if (atRule.name === 'charset') {
  //             atRule.remove();
  //           }
  //         },
  //       },
  //     },
  //   ],
  // },
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
  plugins: [sveltekit()],
});
