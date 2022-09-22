---
title: Cómo crear una cuenta atrás precisa en SvelteKit
seoTitle: Cómo Crear una Cuenta Atrás Precisa en SvelteKit
date: 2021-11-07
description: Creamos una cuenta atrás precisa, disponible en toda la app, y la usamos para mostrar una barra promocional, condicionalmente
status: published
---

En este caso quiero añadir una barra superior a una *landing page* de ventas: una barra promocional que ofrezca un descuento y muestre una cuenta atrás.

Cuando la cuenta atrás termine (termina el descuento) quiero que la barra desaparezca, y las futuras visitas no deberían llegar a verla nunca ya que la cuenta atrás ha terminado y el descuento ya no está vigente.

Aunque existen paquetes para mostrar una cuenta atrás en svelte, me parece un buen ejercicio así que vamos a hacerlo todo nosotros: en gran parte se trata de gestionar una cuenta regresiva con <span class="emphasis emphasis-js">vanilla JavaScript</span>.

Primero vamos a crear una forma de calcular el tiempo restante. Después, cómo mostrarla en días, horas, minutos, etc.

## Gestionar el paso del tiempo

Crearemos una [readable store](https://svelte.dev/tutorial/readable-stores) que gestionará el paso del tiempo con un `setInterval()`: devolverá, cada segundo, los segundos que quedan hasta la fecha límite.

Así podremos importar esa *store* donde queramos en nuestra app, pudiendo mostrar la misma cuenta atrás en varios lugares, o incluso cambiar el texto en las *pricing cards* según si el descuento está vigente o ha pasado la fecha.

En `/src/lib/stores/`, creamos `countdown.js`:

```js
import { readable } from 'svelte/store';

// fecha límite (en milisegundos)
const endDate = new Date('2021-12-31T23:59:59Z').getTime();
// la diferencia inicial, entre el límite y ahora mismo, en segundos
const initialDif = Math.round((endDate - Date.now()) / 1000);

// exportamos la diferencia en segundos
export const time = readable(initialDif, (set) => {
  // recalcular la diferencia cada 1000ms
  const interval = setInterval(() => {
    const secondsLeft = Math.round((endDate - Date.now()) / 1000);
    set(secondsLeft);
  }, 1000);

  // se ejecuta cuando se desuscribe el último suscriptor de la store
  return function stop() {
    clearInterval(interval);
  };
});
```

En este caso he programado la fecha límite directamente en la store porque no la necesito en otro sitio. Quizás sería más versátil importarla desde un archivo de configuración general para evitar duplicados, poder reutilizarla, etc.

Con esto tenemos una *store* a la que podemos suscribirnos en cualquier lugar de nuestra app, y devolverá cada segundo los segundos restantes hasta la fecha límite.

### Por qué lo hacemos así

La ventaja de usar este sistema es que no estamos **manualmente** restando un segundo cada segundo, lo que podrá dar lugar a micro-errores que irían acumulándose y nuestra cuenta atrás resultaría un poco *laggy*.

En su lugar, **recalculamos** el tiempo restante cada segundo, eliminando posibles desajustes si la ventana permanece abierta mucho tiempo.

## Mostrar el paso del tiempo

Vamos a crear un componente `PromoBar.svelte` en `/src/lib/components/`, que mostrará la oferta y la cuenta atrás.

En la parte de `<script>`:

```js
// store con los segundos restantes
import { time } from "$lib/stores/countdown.js";

// variables para el componente
let days;
let hours;
let minutes;
let seconds;

// se recalculará cada vez que time cambie (cada segundo)
$: if ($time > 0) {
  // días completos restantes
  days = Math.floor($time / 86400);
  // segundos sobrantes tras calcular días
  let remainderSeconds = $time % 86400;
  // horas completas restantes
  hours = Math.floor(remainderSeconds / 3600);
  // segundos sobrantes tras calcular horas
  remainderSeconds = remainderSeconds % 3600;
  // minutos completos restantes
  minutes = Math.floor(remainderSeconds / 60);
  // segundos sobrantes tras calcular minutos
  seconds = remainderSeconds % 60;
}
```

El componente en sí depende del aspecto que quieras darle. En lo más básico, podrás mostrar cada uno de los valores recalculados con un texto identificativo. En el mismo componente `PromoBar.svelte`, tras el `<script>`:

```html
<div class="promo-bar">
  <p>Aprovecha la oferta!</p>
  {#if $time && $time > 0}
    <div class="countdown">
      <p>
        <span class="value">{days}</span>
        <span class="title">días</span>
      </p>
      <p>
        <span class="value">{hours}</span>
        <span class="title">horas</span>
      </p>
      <p>
        <!-- añadimos un 0 manualmente si el valor es menor que 10 -->
        <span class="value">{minutes < 10 ? "0" : ""}{minutes}</span>
        <span class="title">minutos</span>
      </p>
      <p>
        <span class="value">{seconds < 10 ? "0" : ""}{seconds}</span>
        <span class="title">segundos</span>
      </p>
    </div>
  {/if}
</div>
```

## No mostrar el componente si acabó el tiempo

Para incluir la barra en nuestra app, pero evitar renderizarla cuando la fecha limite haya llegado, la agregamos con un condicional.

Como queremos mostrar la barra en todas las páginas de la web, agregamos lo siguiente directamente en `/src/routes/+layout.svelte`:

```svelte
<script>
  import { time } from "$lib/stores/countdown.js";
  import PromoBar from "$lib/components/PromoBar.svelte";
</script>

{#if $time > 0}
  <PromoBar />
{/if}
```

Y listo. Cada vez que la página se cargue, la *store* devolverá el tiempo restante hasta la fecha límite. Si esta ha pasado (el resultado es negativo) no mostraremos el componente `<PromoBar>`.
