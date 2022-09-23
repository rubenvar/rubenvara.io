---
title: Cómo usar On-demand ISR en Next.js para regenerar rutas estáticas en SSG
seoTitle: Cómo Usar On-demand ISR en Next.js para Regenerar Rutas Estáticas en SSG
date: 2022-02-19
updated: 2022-07-11
description: Si tienes un sitio estático con Next.js (SSG) y quieres regenerar solo una ruta, usa On-demand ISR para avisar al frontend de cambios en el backend
status: published
---

Si generas las páginas de tu app Next.js de forma estática (SSG), por ejemplo usando `getStaticProps` en tu ruta, conseguirás bastantes beneficios, pero tendrás también algunas desventajas. Un ejemplo rápido:

Digamos que tengo una web donde listo cientos de eventos (que la tengo: calendarioaguasabiertas.com). Al hacer el *build* de mi app:

- Genero cada página de evento a partir de la *data* solicitada de la API. Cada página es **estática**. Cientos de páginas.
- Esto es beneficioso: la página será solo `html`+`json` y se cargará **muy rápido**, sin hacer esperar al usuario en cada visita.
- Pero si **cambia** la información de un evento en la base de datos (algo que pasará constantemente) necesitaré **regenerar** todo el sitio.

### Ya existía una solución parcial

Next.js tenía desde *siempre* la opción de usar [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) (Incremental Static Regeneration), pudiendo asignar un tiempo fijo tras el cual regenerar cada ruta, **después de ser visitada** por primera vez tras ese tiempo.

Esto quiere decir que siempre habrá usuarios que verán la información desactualizada, lo que no es ideal.

Desde Next.js 12.1.0, tenemos una (maravillosa) solución a estos problemas:

## Regeneración bajo demanda: cómo funciona

Básicamente, le mandas una señal a Next.js para que regenere una ruta concreta, **cuando tú quieras**. Idealmente, cuando cambia la información sobre esa ruta en la base de datos.

Siguiendo el ejemplo anterior, cuando actualizo la información sobre un evento en la base de datos, solicito a Next.js que regenere la ruta que muestra ese evento, nada más:

- Menos trabajo para el servidor, menos tiempos de espera (ya que regenerar una ruta es *prácticamente* instantáneo).
- Info actualizada siempre para todos los usuarios.

Esto se llama [On-demand ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation), introducido en *beta* en Next.js 12.1.0, y pasado a **estable** en la versión 12.2.0.

Vamos a ver cómo usarlo, el funcionamiento es *extremadamente* sencillo:

## Cómo usar On-demand ISR de Next.js

Tenemos tres pasos:

- **Solicitar** la regeneración desde nuestro *backend*.
- **Comprobar** que la solicitud es válida, fiable.
- **Ejecutar** la regeneración.

Miramos la teoría, y seguido vemos un ejemplo completo para tenerlo más claro:

### Solicitar la regeneración

Este paso dependerá de tu *backend*: si usas un CMS, las rutas `api` de Next.js, un backend custom con `node.js` y `Express`, etc.

Pero la idea es la misma: tras guardar un cambio en tu base de datos, mandas una solicitud a una url en tu *frontend* Next.js, concretamente: `https://<tusitioweb>/api/revalidate?secret=<secret_token>`. Como llamar a un *webhook*.

Como ves, desde el backend tendrás que pasar en tu solicitud un *secreto* al frontend mediante parámetros de búsqueda. Lo usaremos para el siguiente paso:

### Comprobar la solicitud

Idealmente, el mismo secreto que vas a pasar desde el backend lo añadirás en Next.js como una *Environment Variable*. Así, lo primero que harás cuando recibas la solicitud será comprobar que el secreto que viene en los parámetros es idéntico al guardado en tu app.

Si todo encaja, podrás pasar al siguiente paso:

### Ejecutar la regeneración

Decirle a Next.js qué ruta (o rutas, lo que necesites) es la que tiene que regenerar dentro de su función `handler` en la api, mediante `res.revalidate()`.

## Vamos con un ejemplo práctico

Primero, desde tu backend, tras hacer un cambio en tu base de datos, mandas la solicitud a la ruta del frontend:

```js
// ejemplo genérico
// después de un cambio, se ejecutaría como side-effect

const secret = process.env.SECRET_IN_BACKEND;
const slug = 'evento1'; // info que quieras pasar al frontend

fetch(`https://tusitioweb.com/api/revalidate?secret=${secret}&slug=${slug}`);
```

En tu app Next.js creas una nueva ruta API, en el archivo `/pages/api/revalidate.js`:

```js
// los parámetros de la url vendrán en `req.query`

export default async function handler(req, res) {
  // comprobar token backend vs token frontend
  if (req.query.secret !== process.env.SECRET_IN_FRONTEND) {
    // si son diferentes, devuelve 401, avisa al backend, y no continúa
    return res.status(401).json({ message: 'Invalid token' });
  }

  // comprobar que la información necesaria viene del backend
  const slug = req.query.slug;
  if (!slug) {
    // si no existe, 401, avisa al backend, y no continúa
    return res.status(401).json({ message: 'No slug found' });
  }

  // intentamos revalidar la ruta correspondiente
  try {
    await res.revalidate(`/evento/${slug}`);
    // podríamos revalidar otra página más:
    await res.revalidate('/listado-eventos');
    // y devolver algo al backend
    return res.json({ revalidated: true });
  } catch (err) {
    // si algo no funciona se seguirá mostrando la ruta sin revalidar
    return res.status(500).json({ message: `Error revalidating: ${err}` });
  }
}
```

El sistema es ideal porque te puedes **olvidar** completamente de que existe:

Una vez que preparas todo esto y haces un par de pruebas (recuerda que esto no funcionará en `dev`, tendrás que hacer un build local para probarlo) puedes trabajar en añadir info a tu web y tener el frontend **siempre al día** tras nueva información, comentarios, cambios de precios, etc.
