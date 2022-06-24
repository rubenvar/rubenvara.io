---
title: Cómo añadir transiciones entre páginas en SvelteKit
seoTitle: Cómo Añadir Transiciones entre Páginas en SvelteKit
date: 2021-10-22
description: "Añadir transiciones entre páginas en SvelteKit es muy fácil respecto a otros entornos: controla los cambios de ruta y usa las opciones incluidas"
status: published
---

Añadir transiciones entre páginas en SvelteKit es otra de esas cosas que es **extremadamente fácil**, al menos comparado con el trabajo que supondría en otros entornos.

Aun así requiere tres pasos que nunca termino de recordar concretamente y por eso prefiero dejarlos aquí recogidos, seguro que te aportan algo también.

Vamos a ello:

## Registrar la ruta actual

Para que nuestro componente de transiciones sepa **cuándo** estamos *transicionando* entre páginas, tenemos que crear una forma de registrar este cambio.

Como quiero que las transiciones se muestren en **todas** las páginas de mi sitio, añado este código en `/src/router/__layout.svelte`:

```html
<!-- atencion a añadir este script con el context="module" -->
<script context="module">
  export async function load({ url }) {
    // ...
    
    return {
      props: {
        // asignar ruta actual a la prop `key`
        key: url.pathname,
      },
    };
  };
</script>

<script>
  // ...
  
  // variable para guardar la ruta actual
  export let key;
</script>
```

(También podrías añadirlo en el `__layout` dentro de una subcarpeta en `routes`, por ejemplo, y así la transición solo será entre páginas que utilicen ese *layout*).

La primera parte se ejecuta tanto en el servidor como en el cliente, y asigna la ruta actual visitada cuando la visitas (`url.pathname`) a la *prop* `key` que hemos creado en la segunda parte (el segundo `<script>`).

De hecho si añades lo siguiente:

```html
<script>
  export let key;
  $: console.log(key);
</script>
```

Y navegas por tu web, en la consola del navegador podrás ver, tras cada clic, la ruta actual que visitas.

## Crear el componente para la transición

Creamos un componente que *envolverá* las páginas al completo y que se encargará de crear la transición.

Yo lo llamo `PageTransition.svelte`, dentro de `/src/lib`. Esto es todo el código, ahora lo explicamos:

```svelte
<script>
  import { fly } from "svelte/transition";
  export let refresh = "";
</script>

{#key refresh}
  <div
    in:fly={{ x: -5, duration: 500, delay: 500 }}
    out:fly={{ x: 5, duration: 500 }}
  >
    <slot />
  </div>
{/key}
```

1. Importamos la transición que queramos. Yo uso *fly* en este caso. Tienes [otras opciones](https://svelte.dev/tutorial/transition).
2. Exportamos una variable (`refresh`) que pasaremos al componente cuando lo usemos.
3. Creamos [un bloque `{#key}`](https://svelte.dev/tutorial/key-blocks): *Los bloques key destruyen y recrean su contenido cuando el valor de una expresión cambia*.
4. Dentro, un `div` que rodeará todas nuestras páginas, que será el que **muestre la transición**.
5. Y la etiqueta `<slot />`, que es donde se cargará el contenido que envolvamos con `PageTransition.svelte`.

De esta manera, el `div` recrea el contenido (mostrando la transición) cuando cambia la variable `refresh`.

Lo has adivinado: pasaremos la nueva ruta del paso anterior a la variable `refresh`.

## Hacerlo funcionar: todo junto

En el mismo archivo donde hemos añadido el primer bloqeu de código (idealmente `/src/routes/__layout.svelte`), tenemos que añadir algo más:

```svelte
<script>
  // ...
</script>

<script>
  // ...
  import PageTransition from 'lib/PageTransition.svelte';
  
  // variable para guardar la ruta actual
  export let key;
</script>

<!-- la ruta actual actúa como prop de actualización del bloque #key -->
<PageTransition refresh={key}>
  <!-- ... -->
</PageTransition>
```

---

Listo, con esto deberías ver la transición cada vez que cambies de página. Puedes experimentar con los diferentes tipos que te ofrece Svelte, o podrías incluir diferentes efectos según la sección de la web.
