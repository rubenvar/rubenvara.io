---
title: React Query offline
seoTitle: App sin Conexión? Solucionado con React Query networkMode y fetchStatus
description: 'Novedades desde React Query v4 para trabajar offline: Nuevos ajustes (networkMode) y estados (fetchStatus)'
date: 2023-03-14
status: published
original:
  title: Offline React Query
  url: https://tkdodo.eu/blog/offline-react-query
series:
  name: react-query-tkdodo
  index: 13
---

Ya se ha mencionado en numerosas ocasiones: React Query es un [gestor asíncrono de estado](/react-query/react-query-gestor-estado/). Siempre que le des una Promesa, resuelta o rechazada, la librería estará contenta. No le importa de dónde venga esta Promesa.

Hay muchas formas de crear promesas, pero claramente el caso de uso más frecuente es solicitar data. Muy a menudo, esto requiere una conexión active de red. Pero algunas veces, especialmente en dispositivos móviles donde la conexión de red puede no ser fiable, necesitarás que tu app funcione sin ella.

## Problemas en la v3

React Query está muy bien equipado para gestionar situaciones offline. Al tener una capa de cacheado, mientras el caché esté lleno, puedes seguir trabajando aunque no tengas conexión de red. Veamos tres casos donde la v3 no funcionaba como se esperaría. Usaremos [el ejemplo básico de la documentación](https://react-query.tanstack.com/examples/basic):

### 1. Sin data en el caché

En la v3, todo funciona bien mientras el caché tenga data. Un caso donde las cosas empiezan a fallar es el siguiente:

- Con buena conexión, navegas a la vista de lista.
- Pierdes la conexión y haces clic en un post.

![Carga infinita](/posts/rq-offline-loading-forever.gif)

Lo que ocurre es que tu solicitud estará en estado `loading` hasta que recobres la conexión. Además, puedes ver una llamada de red fallida en las devtools del navegador. Esto es porque React Query siempre lanza la primera solicitud, y si falla, pausará los reintentos si no tienes conexión.

Además, las Devtools de React Query mostrarán que tu solicitud está `fetching`, lo cual no es del todo cierto. La solicitud está realmente `paused`, pero no había forma de representar ese concepto hasta la v4.

### 2. Sin reintentos

De manera similar, si en el escenario anterior hubieras desactivado los reintentos completamente, tu solicitud iría a un estado de `error` inmediatamente, sin forma de pararlo.

![Error de red](/posts/rq-offline-network-error.gif)

¿Por qué necesito reintentos para que mi solicitud vaya a `paused` si no tengo coenxión de red 🤷‍♂️?

### 3. Solicitudes que no necesitan red

Las solicitudes que no necesitan la red para funcionar (por ejemplo, hacer un procesado asíncrono costoso en un web worker) se pausarán hasta que tengas conexión si fallaran por cualquier otra razón. Además, esas solicitudes no se ejecutarán al enfocar la ventana porque esta funcionalidad está completamente deshabilitada si no tienes conexión.

---

En resumen, hay dos grandes problemas: En algunos casos, React Query asume que la conexión es necesaria cuando en realidad puede que eso no sea cierto (caso 3); y en otros casos, React Query lanza una solicitud aunque quizás no debería (casos 1 y 2).

## El nuevo `networkMode`

En la v4 y posteriores se intenta abordar este problema de forma holística con un nuevo ajuste de "modo de red" o `networkMode`. Con esto podemos diferenciar claramente entre solicitudes *online* y *offline*.

Es una opción para `useQuery` y para `useMutation`, lo que significa que se puede ajustar globalmente o caso por caso. Después de todo, puede que tengas algunas solicitudes que necesitan conexión, y otras que no.

### Modo `online`

Este es el modo **por defecto**, ya que se espera que la mayoría de usuarios utilicen React Query con solicitudes de data. En definitiva, con este setting se asume que una solicitud solo puede ejecutarse si tiene una conexión de red activa.

Así que, ¿qué pasa si quieres ejecutar una solicitud que necesita conexión cuando no la tienes? La solicitud se pondrá en un nuevo estado `paused`. Este estado es secundario al estado principal que puede ser `loading`, `success` o `error`, ya que puedes perder la conexión en cualquier momento.

Esto quiere decir que puedes estar en estado `success` y `paused`, por ejemplo, si has obtenido data con éxito una vez, pero una re-solicitud en segundo plano se pausó.

O puedes estar en estado `loading` y `paused` si una solicitud se monta por primera vez.

#### Ya teníamos `fetchStatus`

Siempre hemos tenido la opción `isFetching` que indicaba si una solicitud estaba en marcha. Similar al nuevo estado `paused`, una consulta podía estar en `success` y `fetching`, o en `error` y `fetching`. Las recargas en segundo plano te dan *muchos* estados posibles (👋 máquinas de estado).

Como `fetching` y `paused` son mutuamente excluyentes, se han combinado en el nuevo `fetchStatus` que es devuelto por `useQuery`:

- `fetching`: La consulta se está ejecutando realmente - una solicitud está en marcha.
- `paused`: La consulta no se está ejecutando - está pausada hasta que recuperes la conexión.
- `idle`: La consulta no está en marcha.

Como regla general, el `status` de la consulta te dará información sobre la data: `success` significa que tienes data, `loading` significa que aún no tienes data.

Por otro lado, el `fetchStatus` te da información sobre la `queryFn`: ¿Se está ejecutando o no? Las opciones `isFetching` e `isPaused` se derivan de este estado.

---

Revisemos cómo sería el anteiror caso 1 en la v4. Fíjate en el botón para cambiar el modo de red en las Devtools de RQ. Puedes *hacer creer* a React Query que no tiene red en lugar de desconectarte realmente.

![Pausado](/posts/rq-offline-paused.gif)

Puedes ver claramente el estado en el que está la consulta (`paused`) gracias a la nueva etiqueta morada. Además, la primera solicitud de red se llama cuando volvemos a conectar la red.

### Modo `always`

En este modo React Query no se preocupa en absoluto por tu conexión de red. Las consultas se lanzan siempre, y nunca se pausarán. Esto es especialmente útil si usas React Query para *otras cosas* que no sean obtener data.

### Modo `offlineFirst`

Este modo es muy similar a como Reat Query funcionaba en la v3. La primera solicitud se hace **siempre**, y si esa falla se pausarán los reintentos. Este modo es útil si tienes una capa de caché adicional sobre React Query, como el caché del navegador.

Veamos la API de repositorios de GitHub. Manda las siguientes cabeceras:

```sh
cache-control: public, max-age=60, s-maxage=60
```

...lo que siginifca que, durante los siguientes 60 segundos, si solicitas este contenido de nuevo, la respuesta vendrá del caché del navegador. ¡Lo mejor de esto es que funciona mientras estás offline! Los service workers (por ejemplo las [PWA offline-first](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers)) funcionan de forma similar, intereptando la solicitud de red y devolviendo respuestas cacheadas si están disponilbes.

Y todo esto no funcionaría si React Query decidiera *no lanzar* la solicitud porque no tienes conexión, como hace el modo por defecto `online`. Para interceptar una solicitud, esta tiene que suceder primero! Así que si tienes está capa adicional de caché, ajusta `networkMode: 'offlineFirst'`.

Si la primera solicitud se lanza y encuentra el caché, todo bien: tu consulta irá a estado `success` y obtendrás esa data. Y si el caché falla, seguramente tendrás un error de red, tras lo que React Query pausará los reintentos, podiendo tu consulta en estado `paused`. Lo mejor de ambos mundos 🙌.

## ¿Qué significa todo esto para mí, concretamente?

Nada, a no ser que quieras. Puedes ignorar `fetchStatus` y solo comprobar `isLoading`: React Query se comportará como siempre (bueno, incluso el caso 2 anterior funcionará mejor porque no verás el error de red).

Aun así, si tener una app preparada para casos en lo que no haya red es una prioridad para ti, ahora tienes la opción de observar el `fetchStatus` expuesto y actuar en consecuencia.
