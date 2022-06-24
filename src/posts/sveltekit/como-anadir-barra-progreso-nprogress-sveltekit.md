---
title: Cómo añadir la barra de progreso NProgress.js en SvelteKit
seoTitle: Cómo Añadir la Barra de Progreso NProgress.js en SvelteKit para la Navegación Client-Side
date: 2021-11-26
description: Detecta la navegación client-side en SvelteKit y crea la ilusión de progreso con NProgress.js, una librería muy ligera y sencilla de usar
status: published
---

¿Conoces la popular librería `NProgress.js` de [Rico Sta. Cruz](https://twitter.com/rstacruz)?

> A nanoscopic progress bar. Featuring realistic trickle animations to convince your users that something is happening!

Puedes echar un vistazo a la documentación (muy sencilla) y probar la librería [en su página](https://ricostacruz.com/nprogress/).

Básicamente añade una barra de progreso a tu página, y tienes cuatro métodos disponibles para interactuar con la barra.

## Cómo usarás `NProgress.js`

Excepto que quieras complicarte mucho la vida (la librería tiene métodos más avanzados que los que voy a mencionarte), el uso habitual es crear una *ilusión* de progreso.

Yo suelo usar NProgress.js en `Next.js` para que el usuario **vea** que estamos navengando entre páginas, ya que no hay navegación *real* al ser todo *client-side*.

Así, cuando el usuario hace clic en un enlace local llamo a `NProgress.start()` y la barra aparece y empieza a llenarse, con progresos aleatorios. Cuando se carga la nueva pantalla, llamo a `NProgress.done()` y listo, la barra se llena y desaparece. Puedes verlo en acción en mi web [Calendario de Aguas Abiertas](https://calendarioaguasabiertas.com).

## Instalar NProgress.js en Sveltekit

Primero instalas el paquete:

```bash
npm i -D nprogress
```

Con esto tendrás disponibles los métodos mencionados.

Después, tienes que añadir el `css` para la barra y el *spinner* opcional.

Para mantener un único archivo `.css` en mi app SvelteKit, yo tomo [todo el `css` de la librería](https://github.com/rstacruz/nprogress/blob/master/nprogress.css) y lo pego al final de `/src/app.css` que es la única hoja de estilos que importo en `/src/routes/__layout.svelte`.

## Cómo detectamos la navegación *client-side* en SvelteKit

El sistema que uso yo es el siguiente:

Como quiero que `NProgress.js` se muestre en todas las páginas de mi web, yo lo añado directamente en `/src/routes/__layout.svelte`, pero puedes hacerlo en la ruta que quieras:

```html
<script>
  // ...otros imports
  import { navigating } from '$app/stores'; // readable store de SvelteKit
  import NProgress from 'nprogress'; // métodos de NProgress.js
  import '../app.css'; // el css de la app, el de NProgress.js incluido

  // aquí usamos la store de SvelteKit
  // para detectar inicio/fin de navegación:
  $: {
    if ($navigating) {
      // $nativating es un objeto
      Nprogress.start();
    } else {
      // $nativating es un null
      NProgress.done();
    }
  }
</script>
```

Y listo. Cada vez que haces clic en un enlace local la barra superior aparece y se llena (rápidamente), creando la mencionada *ilusión* de navegación.

---

Si has implementado esta librería de esta manera, o de otra más avanzada, cuéntame!
