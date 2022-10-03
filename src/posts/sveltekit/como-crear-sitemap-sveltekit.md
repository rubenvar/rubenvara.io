---
title: Cómo crear un sitemap dinámico en SvelteKit
seoTitle: Cómo Crear un Sitemap Dinámico en SvelteKit con Rutas API
description: Agrega una ruta API usando +server.js para generar un sitemap dinámico con todas las páginas que quieras indexar en Google
date: 2022-06-26
status: published
---
<script>
import Box from '$lib/components/Box.svelte';
</script>

<Box type="recuerda">

Antes de empezar, recuerda: quizás puedas usar [`svelte-sitemap`](https://github.com/bartholomej/svelte-sitemap) y pasar de todo lo que voy a contarte.

Pero si necesitas más flexibilidad o quieres hacerlo tú en vez de aprenderte la API de un *package* más, adelante.

</Box>

Si quieres crear tú mismo un sitemap.xml en una web SvelteKit tienes básicamente dos opciones.

Al menos si vas a hacerlo sin usar *packages* y sin escribir el archivo XML a mano cada vez que crees una nueva página en tu web.

1. Puedes tener generar un archivo `sitemap.xml` dentro de la carpeta `/static/`, mediante una función a la que llamarías al compilar tu sitio, por ejemplo. El archivo **existirá** en la ruta /sitemap.xml de tu sitio. Así es como lo hago en mi web calendarioaguasabiertas.com, y te lo conté en el post sobre [crear un sitemap en Next.js](/nextjs/como-crear-sitemap-next.js/).
2. Puedes crear una carpeta `/sitemap.xml/` dentro de `/routes/` y tener así una *ruta API* desde donde sirvas un sitemap ***dinámico***. Este es el sistema que sigo en esta web que estás viendo, y es lo que voy a explicarte:

## Servir tu `sitemap.xml` desde una *ruta API* de SvelteKit

Creamos el archivo `/routes/sitemap.xml/+server.js`.

<Box>

Esto es una *ruta API* y puedes controlar directamente la respuesta HTTP que obtendrá el usuario (o el bot, en este caso) tras visitar la ruta. [Mira los docs para más info](https://kit.svelte.dev/docs/routing#server).

</Box>

En este archivo creamos una función `GET` que exportamos, controlará (como te imaginas) las solicitudes `GET` que reciba esta ruta. Justo lo que queremos:

```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  // aquí haremos magia
  // y devolveremos algo que parecerá xml
}
```

Dentro de esta función haremos dos tareas:

1. Recopilar la data necesaria para todas las páginas que queremos mostrar en el sitemap.
2. Convertirlo todo en una cadena XML válida.

Vamos viendo las funciones que usaremos en cada parte, al final del todo te dejo el código completo que irá dentro de `GET`.

### 1. Recopilar info de cada ruta

En el caso de este sitio web, incluiremos rutas en nuestro sitemap de tres maneras distintas:

- Las rutas que se generan desde archivos **Markdown** con Vite al compilar el sitio ([te lo expliqué aquí](/sveltekit/como-importar-archivos-markdown-sveltekit-vite-import.meta.glob/)).
- Rutas que crearemos **dinámicamente**.
- Y rutas que voy a introducir **manualmente**, *hardcoded*.

Crearemos un *array* con todas las páginas. Para cada página generaremos un objeto. La cosa tendría este aspecto:

```js
const routes = [
  {
    slug: 'sveltekit/como-crear-sitemap-sveltekit',
    lastmod: '2022-06-26',
  },
  // ...
];
```

Después podremos recorrer el array y crear una cadena XML a partir de cada objeto.

### 2. Generar las cadenas XML

Una vez que tengamos un *array* de objetos para cada tipo de página, los juntaremos y crearemos toda una cadena XML, manualmente.

<Box>

Existen herramientas como [xmlbuilder2](https://oozcitak.github.io/xmlbuilder2/) que generarán xml a partir de las instrucciones que les pases, pero en mi caso prefiero hacerlo un poco más *casero*.

</Box>

En el XML final cada página irá rodeada de la etiqueta `<url>`, dentro de la cual tendremos las etiquetas `<loc>` y `<lastmod>`, con la dirección de la página y la última fecha de modificación. Más info sobre [formato XML de Sitemaps](https://www.sitemaps.org/es/protocol.html).

Si en la primera parte hemos generado un *array* de objetos como el que te he mostrado, ahora podemos mapearlo y obtener la cadena XML:

```js
// dominio base
const domain = 'https://example.com';
// array de objetos
const routes = [ /* ... */ ];

// cadena XML
const xmlString = routes
  .map(
    (route) => `<url>
      <loc>${domain}/${route.slug}/</loc>${
      route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''
    }
    </url>`
  )
  .join('');
```

Solo se añadirá la etiqueta `<lastmod>` si tenemos esa *prop* en el objeto. Esta etiqueta es recomendada pero no requerida, es mejor dejarla fuera que inventarnos una fecha.

Con el objeto que te mostraba en el ejemplo anterior obtendríamos una cadena como esta:

```xml
<url>
  <loc>https://rubenvara.io/nextjs/como-crear-sitemap-sveltekit/</loc>
  <lastmod>2022-06-26</lastmod>
</url>
```

Al final de la función `GET` devolveremos toda esta cadena **dentro** del resto de etiquetas XML necesarias para que el sitemap sea correcto.

## La solución completa

Mira el código **completo** donde juntamos todo lo que acabo de explicarte.

Sé que es un poco largo, pero ve siguiendo los comentarios donde está explicada cada parte:

```js
import { getAllCategories, getAllPosts } from '$lib/api';

// tipos JSDoc (https://jsdoc.app/)
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  // dominio actual para crear las urls al final
  const domain = url.origin;

  //* PARTE 1

  // generamos objetos desde los archivos markdown
  // usando una función auxiliar (lo vimos en un post anterior)
  const posts = (await getAllPosts()).map((post) => ({
    slug: post.slug,
    lastmod: post.date,
  }));

  // rutas generadas dinámicamente
  // en este caso uso una función auxiliar que solicita información
  // aqui podrías hacer "fetch" desde tu base de datos, etc
  const categories = (await getAllCategories()).map((category) => ({
    slug: category.slug,
    lastmod: category.updated,
  }));

  // páginas estáticas que añado directamente
  // no cambiarán o no habitualmente, al menos
  const hardcoded = [
    { slug: '' }, // la página index (homepage)
    { slug: 'now' },
    {
      slug: 'blog', // la página de blog
      // utilizo la fecha del post más reciente
      lastmod: posts.reduce((acc, curr) => {
        if (curr.lastmod > acc) return curr.lastmod;
        return acc;
      }, ''),
    },
  ];

  //* PARTE 2

  // junto todas las rutas en un solo array
  const routes = posts.concat(categories).concat(hardcoded);

  const content = routes
  // mapeamos el array y creamos una cadena con cada objeto
    .map(
      (route) => `<url>
        <loc>${domain}/${route.slug}/</loc>${
        route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''
      }
      </url>`
    )
    .join(''); // juntamos todas las cadenas

  // headers XML para la respuesta
  const headers = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'max-age=0, s-maxage=3600',
  };

  // devolvemos la respuesta
  // adjuntando las etiquetas necesarias para un sitemap XML válido
  // y concatenando en medio todas las <url>
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        ${content}
      </urlset>`.trim(),
    { headers: headers }
  );
};
```

Si accedes a la ruta /sitemap.xml en tu sitio deberías ver la respuesta que hemos devuelto desde a función `GET`.

Si tienes problemas, puedes ir siguiendo el proceso poco a poco, `console.log`eando cada *array* para ver dónde está el problema, etc.

Tienes muchas herramientas online donde puedes comprobar que el XML emitido es válido. Quizás también podrías integrar un *check* en la misma función.

---

Un sitemap creado exactamente así está disponible [aquí](/sitemap.xml) para este sitio.

Eso es todo, si algo no queda claro escríbeme y lo miramos!
