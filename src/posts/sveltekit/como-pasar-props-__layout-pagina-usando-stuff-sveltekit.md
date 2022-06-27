---
title: Cómo pasar props desde __layout a una página con `stuff` en SvelteKit
seoTitle: Cómo Pasar Props desde __layout a una Página con `stuff` en SvelteKit
description: "Pasa toda la información que quieras en la función load de __layout al resto de la app y accede tanto server-side como client-side en cualquier ruta"
date: 2021-12-11
status: published
---

Los [*Layouts*](https://kit.svelte.dev/docs/layouts) en SvelteKit son plantillas que añaden elementos a todas las páginas que estén en ese mismo nivel y los siguientes.

Así, por ejemplo, te evitas tener que añadir un `Header` o un `Footer` en cada ruta, con solo agregarlo una vez en el archivo `/src/routes/__layout.svelte`.

Como vimos al [añadir transiciones entre páginas](/sveltekit/como-anadir-transiciones-entre-paginas-sveltekit/), el `__layout` puede servir para mucho más.

Vamos a ver un ejemplo donde usamos `stuff`, la propiedad que está presente en **todas las rutas** en SvelteKit para que puedas pasar info entre una y otra.

En este caso vamos a ver un supuesto donde queremos:

- Detectar parámetros de URL lo antes posible (`__layout` es perfecto para esto) y tomar el código de cupón de la URL.
- Hacer cálculos, cambiar elementos a nivel web completa, etc. en base a este código.
- Pasar estos parámetros (el código de cupón) a la ruta visitada.

Para simplificar, vamos a usar el `__layout` *top-level* (`/src/routes/__layout.svelte`) porque queremos que afecte a todas las rutas de nuestra app.

## Función `load` en el archivo `__layout`

Añadimos una función `load` que se ejecutará tanto *server-side* como *client-side* al visitar cualquier ruta, en `/src/routes/__layout.svelte`.

En este ejemplo el parámetro de URL es `coupon_code` (`?coupon_code=DESC50`):

```svelte
<script context="module">
  export async function load({ url }) {
    // tomar el cupón de los parámetros de url
    const couponCode = url.searchParams.get('coupon_code');

    // si existe `couponCode`, lo pasamos en `stuff`
    if (couponCode) {
      return {
        stuff: {
          // pasar el cupón en stuff para usarlo en otras rutas
          coupon: couponCode,
        },
      };
    }
    
    return {}
  }
</script>
```

Aquí hemos puesto simplemente el código sin modificarlo o añadir nada, pero podríamos por ejemplo contrastarlo con un listado de cupones aceptados, calcular precios, etc. Y después agregar todo eso en `stuff` y **tenerlo disponible en toda la app**.

Ahora podremos usar en cualquier ruta de nuestra app esta información que hemos puesto dentro de `stuff`, empezando por el mismo archivo `__layout`.

## Usar las *props* de `stuff` en un *Layout* condicional

Como `__layout` controla componentes que aparecerán en todas las páginas, podemos mostrar una barra promocional en toda la web solo si el cupón está en la URL.

En el mismo `/src/routes/__layout.svelte`:

```svelte
<!-- ... -->

<script>
  // importamos la store `page` ya que contiene `stuff`
  import { page } from '$app/stores';
  import { PromoBar } from '$lib/components/PromoBar';
</script>

{#if $page.stuff.coupon}
  <PromoBar />
{/if}

<!-- recuerda que __layout siempre tiene que llevar `<slot />` -->
<slot />

<!-- ... -->
```

Sí, es cierto que podríamos tomar el parámetro de URL "coupon_code" directamente en el componente desde la store `$page` (`$page.url.searchParams`) en vez de tomarlo de `stuff`, y eso es lo que haría si fuera a usarlo una única vez, pero esto es solo un ejemplo 🤷‍♂️.

## Puedes usar `stuff` en cualquier ruta

Igual que hemos usado `$page.stuff.coupon` para un condicional en el `__layout` general, estará disponible en cualquier ruta, así que dentro de cualquier archivo puedes usarlo de esta manera.

### También *server-side*

Si necesitas usarlo *server-side* para generar tu página (también en *SSG*), la función `load` de cualquier ruta también tiene disponible `stuff`:

```svelte
<script context="module">
  export async function load({ stuff }) {
    // `coupon` está disponible aquí porque lo hemos metido desde `__layout`
    const { coupon } = stuff;

    // aquí usaríamos este código de cupón
    // por ejemplo para solicitar o importar la data de esta ruta, etc.

    // ...    
  }
</script>
```

---

## Conclusión

Como la función `load` en el archivo `__layout` se ejecutará para cualquier ruta cubierta por este, podemos incluir lo que queramos dentro de `stuff` ahí mismo.

Esa información estará disponible en las funciones `load` de todas las páginas, y también *client-side* dentro de la `store` `$page`.
