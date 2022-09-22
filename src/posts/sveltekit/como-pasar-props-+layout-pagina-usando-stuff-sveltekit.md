---
title: Cómo pasar props desde +layout a una página con `stores` y `parent()` en SvelteKit
seoTitle: Cómo Pasar Props desde +layout.js a cualquier Página en SvelteKit
description: "Pasa toda la información que quieras en la función load de +layout al resto de la app y accede tanto server-side como client-side en cualquier ruta"
date: 2021-12-11
updated: 2022-09-15
status: published
---

<script>
  import Box from "$lib/components/Box.svelte";
</script>

<Box type="updated">

**Atención**: este artículo ha sido actualizado para tener en cuenta los cambios importantes en la API de SvelteKit a partir de su versión `@sveltejs/kit@1.0.0-next.406` y `vite@3.0.0`.

Anteriormente se usaba la función `load` dentro de una etiqueta `<script context="module">`, y la *prop* `stuff` de SvelteKit. Esto ha cambiado.

</Box>

Los [*Layouts*](https://kit.svelte.dev/docs/routing#layout) en SvelteKit son plantillas que añaden elementos a todas las páginas que estén en ese mismo nivel y los siguientes.

Así, por ejemplo, te evitas tener que añadir un `Header` o un `Footer` en cada ruta, con solo agregarlo una vez en el archivo `/src/routes/+layout.svelte`.

Como vimos al [añadir transiciones entre páginas](/sveltekit/como-anadir-transiciones-entre-paginas-sveltekit/), el `+layout` puede servir para mucho más.

Vamos a ver un ejemplo donde pasamos *data* desde el `+layout` a **todas las rutas** en SvelteKit, para intercambiar info entre una y otra.

En este caso vamos a ver un supuesto donde queremos:

- Detectar parámetros de URL lo antes posible (`+layout` es perfecto para esto) y tomar el código de cupón de la URL.
- Hacer cálculos, cambiar elementos a nivel web completa, etc. en base a este código.
- Pasar estos parámetros (el código de cupón) a la ruta visitada.

Para simplificar, vamos a usar el `+layout` *top-level* (`/src/routes/+layout.js` y `/src/routes/+layout.svelte`) porque queremos que afecte a todas las rutas de nuestra app.

## Función `load` en el archivo `+layout.js`

Añadimos una función `load` que se ejecutará tanto *server-side* como *client-side* al visitar cualquier ruta, en `/src/routes/+layout.js`.

En este ejemplo el parámetro de URL es `coupon_code` (`?coupon_code=DESC50`):

```js
export async function load({ url }) {
  // tomar el cupón de los parámetros de url
  const couponCode = url.searchParams.get('coupon_code');

  if (couponCode) {
    // si existe `couponCode`,
    // lo pasamos como una prop que usaremos en el componente svelte
    return {
      coupon: couponCode,
    };
  }
  
  return {}
}
```

Aquí hemos puesto simplemente el código sin modificarlo o añadir nada, pero podríamos por ejemplo contrastarlo con un listado de cupones aceptados, calcular precios, etc. Y después agregar todo eso en las props y **tenerlo disponible en toda la app**.

Ahora podremos usar esta información en cualquier ruta de nuestra app. Estará disponible en la *store* `page` que proporciona SvelteKit, dentro de `page.data`.

## Usar las *props* de `+layout.js` en un *Layout* condicional

Vamos a usar esta data dentro del mismo `+layout.svelte` para mostrar componentes en toda la web.

Así, como `+layout.svelte` controla componentes que aparecerán en todas las páginas, podemos mostrar una barra promocional en toda la web solo si el cupón está en la URL.

En este caso podemos importar la data desde la store `page` que te mencionaba, o directamente desde las props que recibe `+layout.svelte` desde `+layout.js`. Como esto es un ejemplo, vamos a ver ambas formas:

### 1. Desde la store `page`

En el archivo `/src/routes/+layout.svelte`:

```svelte
<script>
  // importamos la store `page` ya que contiene `data`
  import { page } from '$app/stores';
  import { PromoBar } from '$lib/components/PromoBar';
</script>

{#if $page.data.coupon}
  <PromoBar />
{/if}

<!-- recuerda que +layout siempre tiene que llevar `<slot />` -->
<slot />

<!-- ... -->
```

### 2. Desde las props que recibe `+layout.svelte`

```svelte
<script>
  import { PromoBar } from '$lib/components/PromoBar';

  // aquí +layout.svelte recibe las props desde su función load en +layout.js
  export let data;

  // asignamos el valor de la prop data.coupon a una variable reactiva
  $: coupon = data.coupon;
</script>

{#if coupon}
  <PromoBar />
{/if}

<!-- recuerda que +layout siempre tiene que llevar `<slot />` -->
<slot />

<!-- ... -->
```

Recuerda que esta segunda opción es posible porque hemos devuelto las props desde la función `load` del `+layout.js` al mismo nivel.

Para tener esta información disponible en cualquier otra ruta, tendrás que tomarla desde la store `page` como en el primer supuesto.

---

## Puedes usar esta *data* en cualquier ruta

Igual que hemos usado `$page.data.coupon` para un condicional en el `+layout.svelte` general, esta data estará disponible en cualquier ruta, así que dentro de cualquier archivo `svelte` puedes usarlo de esta manera.

### También *server-side*

Si necesitas usarlo *server-side* para generar tu página (también en *SSG*), la función `load` de cualquier ruta también tiene disponible esta información.

Por ejemplo, en una página que esté bajo el *layout* que hemos creado antes (ejemplo: `/src/routes/productos/+page.js`):

La obtendrás usando [la función `parent`](https://kit.svelte.dev/docs/load#input-methods-parent):

```js
  export async function load({ parent }) {
    // `coupon` está disponible aquí porque lo hemos metido desde `+layout.js` inicialmente
    const { coupon } = await parent();

    // aquí usaríamos este código de cupón
    // por ejemplo para solicitar o importar la data de esta ruta, etc.

    // ...    
  }
```

---

## Conclusión

Como la función `load` en el archivo `+layout.js` se ejecutará para cualquier ruta cubierta por este, podemos incluir lo que queramos dentro de las props que devuelve.

Esa información estará disponible en las funciones `load` de todas las páginas con `parent()`, y también *client-side* dentro de la *store* `$page.data`.
