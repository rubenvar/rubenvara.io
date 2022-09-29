---
title: Gestionar las etiquetas meta para SEO en cada página en SvelteKit
seoTitle: Cómo Gestionar las Etiquetas Meta para SEO por Página en SvelteKit
date: 2022-06-17
updated: 2022-09-17
description: Establece valores predeterminados y sustitúyelos en cada ruta para tener etiquetas meta (title, description) individuales por página, sin errores
status: published
---
<script>
  import Box from '$lib/components/Box.svelte';
</script>

<Box type="updated">

**Atención**: este artículo ha sido actualizado para tener en cuenta los cambios importantes en la API de SvelteKit a partir de su versión `@sveltejs/kit@1.0.0-next.406` y `vite@3.0.0`.

Anteriormente se usaba la función `load` dentro de una etiqueta `<script context="module">`, y la *prop* `stuff` de SvelteKit. Esto ha cambiado.

</Box>

Ya vimos [cómo usar `page` y `parent()` para pasar información](/sveltekit/pasar-props-+layout-pagina-usando-stuff-sveltekit/) entre plantillas y rutas, y lo útil que puede ser.

Buscando cómo gestionar el SEO de una web de la mejor forma posible (sin tener que modificar decenas de páginas manualmente, etc.) encontré [esta *issue* en GitHub](https://github.com/sveltejs/kit/issues/1540#issuecomment-1045206613) y los [(breves) docs sobre el tema](https://kit.svelte.dev/docs/seo#manual-setup-title-and-meta).

Usando `$page.data` e intentando ~~trabajar lo menos posible~~ ser más eficientes, así es como he conseguido que cada ruta tenga sus propias etiquetas `meta` y existan unos valores *default* en las páginas que me importan menos.

Vamos a verlo usando `title` y `description` como ejemplo, pero puedes usarlo para todas las etiquetas que quieras modificar individualmente.

## Establecer los predeterminados

Vamos a establecer dos cosas en el `+layout` de nuestra app para tener siempre unos valores predeterminados.

Para una app sencilla con un único `+layout`, lo hago en el principal. Si tu app es más compleja y tiene varios, actúa en consecuencia.

Primero añadiremos los valores predeterminados que queremos usar en todas las páginas que no definan los suyos. Lo añadimos a las *props* del `+layout` y así estará disponible en cuanto cargue la página.

En `/src/routes/+layout.js`.

```js
// valores predeterminados 
// para las páginas que no definan title o description
export const load = () => ({
  title: 'Texto default para la etiqueta title de mi página',
  description: 'Texto default para la etiqueta meta description',
});
// atención, la función usa "implicit return"
```

En el archivo `+layout.svelte`, tomamos los valores desde la *store* `$page.data` y los usamos para añadirlos a la `head` de nuestra página.

```svelte
<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <!--
    usa `data` desde la store `page`
    `title` y `description` siempre existen:
    se han definido en +layout.js, o en cada ruta individualmente
  -->
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.description} />
</svelte:head>
```

<Box type="recuerda">

Recuerda: la etiqueta especial `<svelte:head>` agrega lo que metas dentro al `head` de tu web, la pongas donde la pongas. Eso sí, no sustituye valores, así que si añades por ejemplo `<title>` en más de un sitio, la tendrás repetida.

</Box>

Como por ahora solo hemos definido los predeterminados en `+layout.js`, aparecerán esos.

## Establecer valores por página

Vamos a ver cómo añadir valores `title` y `description` individuales por página, aunque ya te estarás imaginando cómo vamos a hacerlo.

En cualquier ruta, por ejemplo `/src/routes/post/[slug]/+page.js`:

```js
export const load = async () => {
  // ...
  const variable = 'una variable de ejemplo';
  
  return {
    // ...
    title: `Título de esta página, podría usar ${variable}`,
    description: `Descripción de esta página`,
  };
};
```

Retornamos las props con los valores que queramos en la función `load` de la ruta, y así estos valores sustituirán a los predeterminados que habíamos establecido en `+layout.js` al inicio, ya que serán tomados desde `$page.data` en `+layout.svelte`.

---

Especialmente útil si tenemos rutas dinámicas, donde podremos usar los parámetros de ruta para conseguir la *data* en la función `load`, y luego usar parte de esa data en el `title` y `description` de nuestra página, haciéndolos también dinámicos (por ejemplo, en artículos de un blog).

Evitaremos tener que añadir la etiqueta `<svelte:head>` en todas las rutas, añadiéndola una vez en el `+layout.svelte` principal.
