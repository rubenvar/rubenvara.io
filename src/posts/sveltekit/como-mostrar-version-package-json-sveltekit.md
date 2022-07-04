---
title: Cómo mostrar la versión desde package.json en SvelteKit
seoTitle: Cómo Mostrar la Versión desde package.json en SvelteKit
date: 2022-04-21
description: Cómo mostrar la versíon de tu app, importada desde package.json, sin errores ni problemas de ningún tipo
status: published
---

Otro de esos artículos que voy a escribir porque siempre se me olvida cómo hacer esto y tengo que volver a buscarlo.

En parte como dicen los [docs de SvelteKit](https://kit.svelte.dev/faq#read-package-json) en su ejemplo. Pero con un par de añadidos para hacerlo funcionar y evitar *avisos*.

## Cómo *importar* la versión

En el archivo `svelte.config.js`, añadir lo siguiente:

```js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

const config = {
  kit: {
    // ...
    vite: {
      define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
      },
    },
  },
  // ...
};
```

Puedes llamarlo `__APP_VERSION__`, `__VERSION__`, o como tú prefieras.

Recuerda reiniciar tu app tras hacer cambios en `svelte.config.js`.

## Cómo *mostrar* la versión

Y para usarlo donde quieras en tu app:

```html
<h2>Versión: {__APP_VERSION__}</h2>
```

Así Vite, al montar tu app, reemplazará esa cadena por la versión importada desde `package.json`. Es exactamente así como lo hago en este blog, para mostrar la versión en el `footer`.

## Nada es tan sencillo: *quejas* y problemas

Ahora bien, si usas el plugin de svelte para `eslint`, o si usas `TS`, es posible que empieces a ver *quejas*:

![problemas](/posts/version-problemas.png)

Meh... 😕

La mejor forma que encontré para quitar el primer aviso (del plugin de `eslint`) es añadir lo siguiente en la línea anterior:

```html
<!-- svelte-ignore missing-declaration -->
<h2>Versión: {__APP_VERSION__}</h2>
```

Listo. Lo sé, no es el mejor sistema, pero cumple. Si tienes una idea mejor, soy todo oídos.

Para solucionar el error de `TS`, en lugar de añadir `// @ts-ignore`, mejor declarar el tipo y listo.

En el archivo `/src/app.d.ts` que SvelteKit suele generar cuando empiezas un nuevo proyecto con TypeScript activado, añade la siguiente línea:

```ts
// ...

declare const __APP_VERSION__: string;
```

Listo, ahora `TS` reconoce la cadena `__APP_VERSION__` y no vuelve a quejarse.

---

Todo esto más o menos lo he sacado de [la pregunta que respondí en SO](https://stackoverflow.com/questions/70034450/how-do-i-add-a-version-number-to-a-sveltekit-vite-app/71423592#71423592) sobre el tema, y los comentarios derivados.

Como te decía, si tienes una idea mejor o ha cambiado la cosa desde que lo escribí, puedes responder en la misma pregunta o escribirme!
