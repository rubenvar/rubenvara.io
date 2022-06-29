---
title: Cómo gestionar las etiquetas meta para SEO en cada página en SvelteKit
seoTitle: Cómo Gestionar las Etiquetas Meta para SEO por Página en SvelteKit
date: 2022-06-17
description: Establece valores predeterminados y sustitúyelos en cada ruta para tener etiquetas meta (title, description) individuales por página, sin errores
status: published
---
<script>
  import Box from '$lib/components/Box.svelte';
</script>

Ya vimos [cómo usar `stuff` para pasar información](/sveltekit/como-pasar-props-__layout-pagina-usando-stuff-sveltekit/) entre plantillas y rutas, y lo útil que puede ser.

Buscando cómo gestionar el SEO de una web de la mejor forma posible (sin tener que modificar decenas de páginas manualmente, etc.) encontré [esta *issue* en GitHub](https://github.com/sveltejs/kit/issues/1540#issuecomment-1045206613) y los [(breves) docs sobre el tema](https://kit.svelte.dev/docs/seo#manual-setup-title-and-meta).

Usando `stuff` e intentando ~~trabajar lo menos posible~~ ser más eficientes, así es como he conseguido que cada ruta tenga sus propias etiquetas `meta` y existan unos valores *default* en las páginas que me importan menos.

Vamos a verlo usando `title` y `description` como ejemplo, pero puedes usarlo para todas las etiquetas que quieras modificar individualmente.

## Establecer los predeterminados

Vamos a establecer dos cosas en el `__layout` de nuestra app para tener siempre unos valores predeterminados.

Para una app sencilla con un único `__layout`, lo hago en el principal. Si tu app es más compleja y tiene varios, actúa en consecuencia.

Primero añadiremos los valores predeterminados que queremos usar en todas las páginas que no definan los suyos. Lo añadimos a `stuff` desde el `--layout` y así estará disponible en cuanto cargue la página.

En `/src/routes/__layout.svelte`.

```svelte
<script context="module" lang="ts">
  // valores predeterminados 
  // para las páginas que no definan title o description
  export const load = () => ({
    stuff: {
      title: 'Texto default para la etiqueta title de mi página',
      description: 'Texto default para la etiqueta meta description'
    },
  });
</script>
```

En el mismo archivo, tomamos los valores desde `stuff` y los usamos para añadirlos a la `head` de nuestra página.

```svelte
<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <!--
    usa `stuff` desde la store `page`
    `title` y `description` siempre existen:
    se han definido más arriba, o en cada ruta
  -->
  <title>{$page.stuff.title}</title>
  <meta name="description" content={$page.stuff.description} />
</svelte:head>
```

<Box type="recuerda">

Recuerda: la etiqueta especial `<svelte:head>` agrega lo que metas dentro al `head` de tu web, la pongas donde la pongas. Eso sí, no sustituye valores, así que si añades por ejemplo `<title>` en más de un sitio, la tendrás repetida.

</Box>

Como por ahora solo hemos definido los predeterminados en `__layout`, aparecerán esos.

## Establecer valores por página

Vamos a ver cómo añadir valores `title` y `description` individuales por página, aunque ya te estarás imaginando cómo vamos a hacerlo.

En cualquier ruta:

```svelte
<script context="module">
  export const load = async () => {
    // ...
    return {
      // ...
      stuff: {
        title: `Título de esta página, podría usar una ${variable}`,
        description: `Descripción de esta página`,
      },
    };
  };
</script>
```

Retornamos `stuff` con los valores que queramos en la función `load` de la ruta, así estos valores sustituirán a los predeterminados que habíamos establecido en `__layout`.

---

Especialmente útil si tenemos rutas dinámicas, donde podremos usar los parámetros de ruta para conseguir la *data* en la función `load`, y luego usar parte de esa data en el `title` y `description` de nuestra página, haciéndolos también dinámicos (por ejemplo, en artículos de un blog).

Evitaremos tener que añadir la etiqueta `<svelte:head>` en todas las rutas, añadiéndola una vez en el `__layout` principal.

## Con TypeScript

Debería mencionar que, si usas TypeScript, tendrás que declarar los tipos de todo lo que metas en `stuff` si quieres evitar problemas.

Es rápido. En el archivo `/src/app.d.ts` que generará SvelteKit en un proyecto TS, añade lo siguiente:

```ts
declare namespace App {
  // ...
  interface Stuff {
    title: string;
    description: string;
    // o las etiquetas que vayas a meter en `stuff`
  }
}
```
