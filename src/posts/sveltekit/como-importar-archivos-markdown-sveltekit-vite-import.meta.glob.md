---
title: Cómo importar archivos markdown en SvelteKit con `import.meta.glob()` de Vite
seoTitle: Cómo Importar Archivos markdown en SvelteKit con `import.meta.glob()` de Vite
description: "Crea un blog con SvelteKit: posts en markdown, conversión de metadata y html con mdsvex, importa los archivos con Vite usando `import.meta.glob()`"
date: 2022-06-29
updated: 2022-09-19
status: published
---

<script>
  import Box from "$lib/components/Box.svelte";
</script>

<Box type="updated">

Atención: este artículo ha sido actualizado para tener en cuenta los cambios importantes en la API de SvelteKit a partir de su versión `@sveltejs/kit@1.0.0-next.406` y `vite@3.0.0`.

</Box>

Una opción para crear un blog con SvelteKit y *markdown* es guardar todos tus posts en una carpeta a parte, fuera de `/src/routes`, importar los archivos con Vite, y mostrarlos usando una plantilla (por ejemplo `/src/routes/blog/[slug]/+page.svelte`).

Hay otras formas, como meter todos los posts directamente en la carpeta `/src/routes/blog/`, y otras ideas.

Si quieres ver cómo usar [la función `import.meta.glob()`](https://vitejs.dev/guide/features.html#glob-import) de Vite para importar archivos *markdown*, así es como está creado este blog y lo vemos aquí en un minuto:

## Instalar y configurar `mdsvex`

Para que Vite pueda procesar el *markdown* necesitarás [mdsvex](https://mdsvex.com/) (hay otras opciones pero esta es la más extendida para `svelte`). Además al tenerlo instalado en tu app podrás escribir páginas directamente en *markdown* y se convertirán solas a `svelte`.

```bash
npm i -D mdsvex
```

En el archivo de configuración `/svelte.config.js`:

```js
import { mdsvex } from 'mdsvex';

const config = {
  // ...
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [
    // ...
    mdsvex({ extensions: ['.svx', '.md'] }),
  ],
}

export default config;
```

Con esto Vite podrá procesar tus archivos *markdown*, los uses como los uses.

## Importar archivos `.md` con `import.meta.glob()`

Vite es la herramienta que, entre otras cosas, gestiona SvelteKit en *dev* y se encarga de *empaquetar* tu app para producción.

En este caso, te permitirá importar archivos desde tu *filesystem* y trabajar con ellos.

Para ello utiliza la función `import.meta.glob()`, a la que tienes que pasarle la ruta **estática** de tus archivos `.md`.

### Tienes que usar una ruta estática

Los patrones `glob` que pasas a esta función se utilizan como un `import`, así que pueden ser relativos (empezar por `./`) o absolutos (empezar por `/`), pero **no pueden llevar variables**. Sigue los patrones de [fast-glob](https://github.com/mrmlnc/fast-glob#pattern-syntax).

Por ejemplo, si quiero generar cada post individual, aunque tengo el `slug` del post no puedo importar ese archivo únicamente ya que usaría una variable en la ruta.

No he encontrado otra forma que importar todos los archivos `.md` y filtrar las rutas con la del post que quiero generar.

Haces trabajar más a Vite, pero como genero una web estática (SSG), solo lo hace una vez *at build time* y al usuario final esto no le supone ningún problema.

### Qué devuelve

Cuando importas archivos usando `import.meta.glob()`, Vite te devuelve un objeto:

- La propiedad es la **ruta** del archivo importado.
- El valor es una función con un `import` **dinámico**.

Míralo en un ejemplo:

```js
// importar todos los archivos
const postFiles = import.meta.glob('../posts/\*.md');

// postFiles tendrá este aspecto:
{
  '../posts/archivo1.md': () => import('../posts/archivo1.md'),
  '../posts/archivo2.md': () => import('../posts/archivo2.md'),
}
```

Podrías filtrar por ruta, por ejemplo. O lo que necesites hacer.

Y después, para cada valor que necesites, en un *loop* ejecutar (en `await`, o con `.then()`) la función y retornar el resultado.

Para seguir con el ejemplo, imaginemos que solo querems un post, el primero de la lista:

```js
// tomamos el primer import
const firstPostResolver = postFiles[Object.keys(postFiles)[0]];

// y lo resolvemos
// (ahora veremos qué especto tendrá `resolvedPost`)
const resolvedPost = await firstPostResolver();

```

Normalmente esto lo harías en un *loop* porque querrías hacer esto con todos los posts, o varios al menos.

#### También existe la opción `{ eager: true }`

Si vas a necesitar el resultado de todas las rutas importadas, puedes añadir la opción `eager: true` a la función:

```js
import.meta.glob('../posts/\*.md', { glob: eager });
```

Te devuelve la misma estructura que `glob()`, pero el valor de cada ruta es el resultado de ejecutar su función `import`.

## Trabajar con el resultado

De una u otra forma, tras tener las funciones resultas, y si todo ha ido bien, tendrás un objeto donde:

- Las propiedades son la ruta de cada archivo.
- Y los valores son un objeto con funciones y datos.

Más o menos este objeto tiene la siguiente forma, siguiendo con el ejemplo anterior:

```js
// `resolvedPost` del ejemplo anterior:
{
  default: { render: [Function], '$$render': [Function] },
  metadata: { /* la frontmatter de tu archivo md */ },
  // ... otras cosas
}
```

Vamos a ver entonces qué puedes hacer con esto:

### El objeto `default`

Dentro de esta propiedad tienes dos funciones. Actúan de forma muy similar.

Si ejecutas la función `render()`, te devolverá un objeto con la siguiente forma:

```js
// siguiendo con el ejemplo:
const contents = resolvedPost.default.render();

// `contents` tendrá este aspecto:
{
  html: '<p>el markdown de tu archivo convertido a html</p>',
  css: { code: '', map: null },
  head: '',
}
```

De aquí lo que te interesa seguramente es el valor de `html`, que puedes usar directamente en tu componente del post. Más abajo vemos cómo.

Si resuelves la función `$$render()`, te devuelve directamente una *string* con el html del post, es decir, lo mismo que la propiedad `html` de la función `render()` que acabamos de ver.

### El objeto `metadata`

La propiedad `metadata` es simplemente un objeto con todo el *frontmatter* de tu archivo.

```js
const meta = resolvedPost.metadata;

// `meta` tendría este aspecto, por ejemplo:
{
  title: 'Título del post',
  description: 'Descripción del post',
  date: '2022-03-06',
}
// esto dependerá del frontmatter que hayas usado en tu post
```

Si juntamos todo esto ya tenemos lo que necesitábamos: la *metadata* del post y el contenido en html.

Solo queda mostrarlo todo en la plantilla.

## Mostrar el resultado

Idealmente todo lo anterior lo has hecho en un `endpoint` de tu API, por ejemplo `/src/routes/blog/[slug]/+page.server.js`, y tu ruta recibirá la *data* vía `props`.

Las propiedades de la *metadata* puedes usarlas como variables normales.

El *html*, como ya viene con tus etiquetas, etc., queremos mostrarlo sin procesar.

- Svelte tiene una función perfecta para esto, `@html`.

Siguiendo el mismo ejemplo que teníamos, dentro de la ruta que será la plantilla de tu post (por ejemplo `/src/routes/blog/[slug]/+page.svelte`):

```svelte
<script>
  // aquí se recibirá y asignará la data
  export let data: PageData;

  $: contents = data.contents;
  $: meta = data.meta;
</script>

<!-- usamos los valores del frontmatter -->
<h1>{meta.title}</h1>
<p>Publicado: {meta.date}</p>

<!-- así es como insertamos el html en un componente svelte -->
{@html contents.html}
```

Y listo, con esto tendrías todo lo que necesitas para mostrar posts en un blog desde archivos *markdown*.

---

Tienes un ejemplo real de todo esto en [el código de este blog](https://github.com/rubenvar/rubenvara.io/blob/main/src/lib/utils/api.ts), ya que es así como gestiono los artículos que estás leyendo ahora mismo.
