---
title: Cómo gestionar `title` y `description` para SEO en SvelteKit
date: 2022-06-27
status: draft
---

Ya vimos [cómo usar `stuff` para pasar información](/sveltekit/como-pasar-props-__layout-pagina-usando-stuff-sveltekit/) entre plantillas y rutas, y lo útil que puede ser.

Buscando cómo gestionar el SEO de una web de la mejor forma posible (sin tener que modificar decenas de páginas manualmente, etc.) encontré [esta *issue* en GitHub](https://github.com/sveltejs/kit/issues/1540#issuecomment-1045206613) y los [(breves) docs sobre el tema](https://kit.svelte.dev/docs/seo#manual-setup-title-and-meta).

Usando `stuff` e intentando ~~trabajar lo menos posible~~ ser más eficientes, así es como he conseguido que cada ruta tenga sus propias etiquetas `meta` y existan unos valores *default* en las páginas que me importan menos.

Vamos a verlo usando `title` y `description` como ejemplo, pero puedes usarlo para todas las etiquetas que quieras modificar individualmente.

## Establecer los predeterminados

Primero, vamos a establecer dos cosas en el `__layout` de nuestra app. Para una app sencilla con un único `__layout`, lo hago en el principal. Si tu app es más compleja y tiene varios, actúa en consecuencia.

En `/src/routes/__layout.svelte`:

```svelte

```
