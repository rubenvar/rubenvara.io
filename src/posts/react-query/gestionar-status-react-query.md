---
title: Comprobar el estado de la solicitud en React Query
seoTitle: "Comprobar el Estado de la Solicitud en React Query: Atención al Orden"
description: ¿Cómo gestionas el estado de una solicitud en React Query? Según tu patrón de comprobaciones podrías darle un buen susto al usuario
date: 2022-09-30
status: published
original:
  title: Status Checks in React Query
  url: https://tkdodo.eu/blog/status-checks-in-react-query
series:
  name: react-query-tkdodo
  index: 4
---

<script>

import Box from '$lib/components/Box.svelte';

</script>

Una ventaja de React Query es que es súper fácil acceder al estado de la solicitud. Al momento sabes si tu solicitud está cargando o tiene errores. Para logarlo, esta librería expone varios *indicadores* booleanos (boolean flags), derivados mayormente de su máquina interna de estados.

Basándonos en [los tipos](https://github.com/TanStack/query/blob/f2137dc4e4553256c4ebc1891b548fe35efe9231/src/core/types.ts#L250), tu solicitud puede estar en uno de los siguientes estados:

- `success`: Tu solicitud se resolvió con éxito, existe `data` en ella.
- `error`: Tu solicitud no ha funcionado, se ha creado un `error`.
- `loading`: Tu solicitud no tiene `data` todavía y está *cargando* por primera vez.
- `idle`: Tu solicitud no ha sido ejecutada nunca porque no está *activada*. Desde la v4 este estado ha sido **eliminado**.

Recuerda que el indicador `isFetching` [del que hablamos en la parte 3](/react-query/optimizacion-renderizado-react-query/) **no** es parte de la máquina interna de estados: es un indicador adicional que será `true` siempre que una solicitud se esté ejecutando. Por eso, puedes tener `isFetching: true` y éxito a la vez, o `isFetching: true` y error, pero nunca `loading` y `success` activadas al mismo tiempo. Para eso existe la máquina de estados que mencionábamos.

<Box type="updated">

**Actulización**: En la versión 4 de React Query, el indicador `isFetching` se deriva de un estado `fetchStatus` secundario, igual que el nuevo indicador `isPaused`. Podrás leer más sobre esto en la parte 13 de la serie cuando la traduzca.

</Box>

## El ejemplo estándar

Para ver todo esto en un ejemplo, este sería el *típico* uso de los indicadores booleanos de los que estamos hablando, dentro de un componente:

```jsx
// ejecutar la solicitud
const todos = useTodosQuery();

// si está cargando
if (todos.isLoading) {
  return 'Loading...';
}
// si existe un error
if (todos.error) {
  return 'An error has occurred: ' + todos.error.message;
}

// si todo ha ido bien y existe "data"
return <div>{todos.data.map(renderTodo)}</div>;
```

Primero comprobamos si la solicitud está cargando o en error, y luego mostramos la data.

Seguramente esto será suficiente en muchos casos, pero no en otros:

### ¿Y si se re-solicita data?

Aunque muchas librerías de solicitud de data, especialmente las creadas manualmente para un caso concreto, no tienen mecanismos de re-solicitud de data (o solo ante una interacción específica del usuario), React Query **sí las tiene**.

React Query re-solicita bastante *agresivamente* por defecto, sin necesidad de que el usuario lo solicite. Los conceptos de *refetchOnMount*, *refetchOnWindowFocus* y *refetchOnReconnect* (re-solicitar tras montar un componente, al enfocar la ventana, o al reconectar) son geniales para mantener tu data actualizada, pero pueden causar una experiencia del usuario un poco confusa si una de estas re-solicitudes de fondo falla.

## Errores de fondo

En muchos casos, si una re-solicitud de fondo falla, sería perfectamente correcto ignorarlo en silencio. Pero el código del ejemplo anterior, el patrón **habitual** de comprobación de estado, no lo hace.

Veamos dos casos:

- Un usuario abre una página, la solicitud inicial se carga con éxito. Interactúa con la página un rato, y luego cambia de pestaña. Vuelve tras unos minutos, y React Query ejecuta una re-solicitud de fondo. El usuario verá la data actualizada tras estar ausente, excepto si falla.
- Un usuario está viendo un listado de elemento. Hace clic en uno y puede obtener la vista detallada. Vuelve a la lista, y si hace clic en el mismo elemento verá la data desde caché. Esto es perfecto, excepto si la re-solicitud de fondo automática falla.

En ambas situaciones, nuestra solicitud estará en el siguiente estado:

```json
{
  "status": "error",
  "error": { "message": "Something went wrong" },
  "data": [{ /* ... */ }]
}
```

Como puedes ver, tendremos disponibles tanto un error como la data obsoleta.

Esto es lo que hace React Query tan genial: al seguir su estrategia de caché *stale-while-revalidate* (obsoleto-mientras-revalida), siempre te ofrecerá data si esta existe, aunque esté obsoleta y esté tratando de re-solicitar nueva.

### ¿Cómo afrontamos esta situación?

Desde ahí te toca a ti decidir qué mostrar: ¿Es importante mostrar el error? ¿Es suficiente con mostrar la data obsoleta, si existe? ¿Deberíamos mostrar ambos, con un indicador de error?

No hay una respuesta correcta: depende de **tu caso concreto**.

Aun así, en los dos ejemplos que hemos visto, creo que sería confuso para el usuario si la data se sustituyera de repente por una pantalla de error.

Y esto es todavía más relevante si pensamos que React Query, por defecto, reintentará cada solicitud tres veces, así que pueden pasar un par de segundos hasta que la data obsoleta sea reemplazada por un error. Si además no tienes un indicador en pantalla de que se estaba ejecutando una solicitud de fondo, el usuario quedará *perplejo*.

Por eso, quizás es una buena idea comprobar primero si existe data:

```jsx
// ejecutar la solicitud
const todos = useTodosQuery();

// si existe data
if (todos.data) {
  return <div>{todos.data.map(renderTodo)}</div>;
}
// si existe un error
if (todos.error) {
  return 'An error has occurred: ' + todos.error.message;
}

// mostrar cargando si ninguno de los casos anteriores es verdadero
return 'Loading...';
```

Recuerda, no hay una regla clara de qué es lo correcto en este caso, depende mucho de tu app.

Eso sí, deberías ser **consciente** de los efectos que tiene un re-solicitado tan *agresivo*, y estructurar tu código en consecuencia en lugar de seguir los ejemplos predeterminados.

---

Gracias a [Niek Bosch](https://github.com/boschni) por resaltar inicialmente que este patrón de comprobación de estado puede ser perjudicial en algunos casos.
