---
title: Cómo auto-generar un sitemap complejo en Next.js
seoTitle: Cómo Generar un Sitemap Estático en Next.js Automáticamente en cada Build
date: 2021-07-06
description: Genera automáticamente un archivo sitemap.xml estático en cada build de tu app Next.js, creado manualmente desde cero para un máximo control
status: published
---
<script>
import Box from '$lib/components/Box.svelte';
</script>

<Box type="recuerda">

Antes de empezar, recuerda: puedes usar [`next-sitemap`](https://github.com/iamvishnusankar/next-sitemap) y pasar de todo lo que voy a contarte.

Pero si necesitas más flexibilidad o quieres hacerlo tú en vez de aprenderte la API de un *package* más, adelante.

</Box>

En algún momento mientras trabajaba en mi web Next.js *calendarioaguasabiertas.com* pensé en crear un sitemap.

Tras probar varios *packages*, decidí crearlo yo porque quería el máximo control:

## Requisitos de mi sitemap.xml en Next.js

Necesitaba un sitemap completo, que incluyera todo lo que quería que Google indexara de mi sitio:

- Rutas creadas desde el propio ***filesystem***. Como en un blog donde tengas archivos `.md` que quieras listar en el sitemap.
- Rutas *hardcoded*, **estáticas**. Predefinidas por mí para que aparezcan en todas las iteraciones del sitemap.
- Rutas **dinámicas**, donde el *slug* de cada ruta es importado desde la API de la app.
- Y algo que llamo rutas ***mixtas***, donde los valores dinámicos vendrán de la API pero que filtraré según mis criterios estáticos. Más abajo está el ejemplo concreto.

Tras investigar un tiempo sobre el tema, tenía en principio dos opciones:

## Alternativas: sitemap dinámico o estático

Por una lado puedo crear una ruta como `/pages/sitemap.xml.js` que Next.js mostrará en `/sitemap.xml` de mi sitio, y ahí programar un *endpoint* que **dinámicamente** muestre (y cachee) mi sitemap en cada visita.

Por otro lado, puedo generar un archivo *real*, **estático**, en `/public/sitemap.xml` en cada *build* de mi app. Si añado nuevas rutas, tendría que regenerar el sitio (o regenerar solo ese archivo mediante [On-demand ISR](/nextjs/usar-on-demand-isr-next.js/), aunque eso es otra historia).

---

El resultado final sería el mismo (un archivo `.xml` en la ruta `/sitemap.xml` que Google puede leer cuando quiera), la decisión dependerá de tus necesidades, etc.

Yo elegí el segundo camino para mi web con Next.js, me gusta la idea de tener el archivo creado físicamente y viviendo en el servidor.

(Pero para esta web que estás visitando elegí el primer sistema, y escribí sobre [crear un sitemap dinámico con SvelteKit](/sveltekit/como-crear-sitemap-sveltekit/)).

## Generar un sitemap.xml estático en cada *build* con Next.js

Primero, vamos a ver cómo decirle a Next.js que genere un archivo en cada build del sitio:

### Crear un archivo con node

Empiezo definiendo una función que creará nuestro `sitemap.xml`, en un nuevo archivo. Yo lo puse en: `/lib/createSitemap.js`:

```js
// uso "require" porque lo ejecutaré con `node`
const path = require("path");
const fs = require("fs");

// dónde generaremos el archivo
const filePath = path.join(__dirname, "../public/sitemap.xml");

// aquí dentro toda la lógica para definir y filtrar rutas, etc.
function main() {
  // ...

  const xml = ""; // aquí todo el contenido xml (ahora lo vemos)

  // creamos el sitemap por fin
  fs.writeFileSync(filePath, xml);
}

// ejecutamos la función y listo
main()
  .then(() => console.log(`Sitemap created successfully 👍`))
  .catch((err) => console.error(`Some error 😱: ${err}`));
```

Como ves, la idea es sencilla y no es específica para Next.js:

- Usando `node.js`, crearemos un nuevo archivo con `fs.writeFileSync()` y lo incluiremos en la carpeta `/public/`.
- Después, durante el build, Next.js incluirá ese archivo estático en el resultado.

Para conseguir esto último, nos falta ejecutar esta función exactamente cuando queramos, esto es, antes del build de Next.js. Podemos hacerlo añadiendo un nuevo *script* en `package.json`:

```json
{ 
  "scripts": {
    "prebuild": "node ./lib/createSitemap.js",
    "build": "next build"
    // ...
  }
  // ...
}
```

Listo. Con esto, cada vez que ejecutes `npm run build` (o se ejecute en tu servidor), primero se creará el sitemap y luego Next.js hará su trabajo.

#### Si usas TypeScript

Tras migrar el sitio entero a TypeScript, me encontré con el problema de que no podía ejecutar `node ./lib/createSitemap.js` sin errores.

La solución es sencilla:

- Migré el archivo a TS (`createSitemap.ts`).
- Cambié el script a `ts-node ./lib/createSitemap.ts`.

Después TS se quejaba de que el archivo tenía que exportar algo, así que añadí `export {};` al final de `createSitemap.ts`.

Y listo.

---

Si ya tenemos claro cómo crear el archivo físico, vamos a ver cómo generamos el contenido:

### Crear el xml para el sitemap

Existen herramientas como [xmlbuilder2](https://oozcitak.github.io/xmlbuilder2/) que generarán `xml` a partir de las instrucciones que les pases.

Yo soy más *DIY* y lo he hecho todo **manualmente**, concatenando *strings* de etiquetas `xml`.

La idea es crear un *array* de objetos, uno para cada url que queramos incluir, y luego mediante un `map()` generar el `xml`.

Haremos todo el trabajo dentro de la función `main()` que acabamos de ver más arriba:

```js
async function main() {
  // rutas harcoded
  const hardcoded = [
    { loc: 'blog', lastmod: '2021-01-20' },
    { loc: 'about', lastmod: '2021-02-21' },
  ];

  // aquí solicitamos la data dinámica a la API
  // puede ser REST, GraphQL, o el sistema que uses
  const data = await getData();

  // aquí comprobaríamos que la data es correcta antes de seguir
  if (!data) throw new Error('no data 🤷‍♂️');

  // rutas dinámicas, a partir de la data recibida
  const races = data.races.map((race) => ({
    loc: race.slug,
    lastmod: race.updatedAt
  }));

  // rutas "mixtas":
  // - queremos las `categories` desde la API
  // - pero las filtramos para incluir solo las que nos interesan
  const categories = data.categories
    .filter((category) => {
      // aquí filtramos según nuestras necesidades
      if (category.hasRaces) return true;
      return false;
    })
    .map((category) => ({
      // con el resultado, creamos más objetos como antes
      loc: category.slug,
    }));

  // ahora `hardcoded`, `races` y `categories` tienen el mismo aspecto:
  // arrays con objetos { loc: '' } o { loc: '', lastmod: '' }

  // necsitamos la url base del sitio:
  const baseUrl = 'https://example.com';
  
  // juntamos todos los objetos
  const content = hardcoded
    .concat(races)
    .concat(categories)
    // generamos el xml, una etiqueta <url> por cada objeto
    .map((url) => `
      <url>
        <loc>${baseUrl}/${url.loc}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      </url>
    `)
    // y lo unimos todo en una gran cadena
    .join('');

  // solo falta agregar las etiquetas necesarias para procesar xml
  // y juntarlo todo:
  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${content}
    </urlset>
  `;

  // creamos el sitemap por fin
  fs.writeFileSync(filePath, xml);
}

```

Si todo ha ido bien, en cada *build* se creará un archivo con una gran cadena `xml` generada automáticamente, de manera muy limpia y ordenada.

Obviamente esto se complicará si tienes más rutas, categorias, filtros, requisitos, etc.

El sitemap creado así para calendarioaguasabiertas.com está en perfecto funcionamiento [aquí mismo](https://calendarioaguasabiertas.com/sitemap.xml). El archivo de generación es mucho más complejo, ejecuta una solicitud GraphQL al servidor, etc., pero el principio es el mismo.

---

## Otras ideas

Una vez creado el `xml`, y antes de generar el archivo con `fs.writeFileSync()`, podríamos validar programáticamente que sea `xml` válido, quizás mediante algún package, para evitar errores.
