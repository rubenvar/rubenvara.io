---
title: Usar Websockets con React Query
seoTitle: "Websockets y React Query: Información en Tiempo Real en tu app React"
description: Una guía paso a paso para conseguir notificaciones en tiempo real con Websockets y React Query
date: 2022-10-14
status: published
original:
  title: Using WebSockets with React Query
  url: https://tkdodo.eu/blog/using-web-sockets-with-react-query
series:
  name: react-query-tkdodo
  index: 7
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

Otra pregunta bastante habitual: cómo gestionar *data* en tiempo real con **WebSockets** junto con React Query. Aquí tienes varias ideas para empezar:

## Qué son los WebSockets

Sencillamente, los WebSockets permiten enviar información en tiempo real del servidor al cliente (el navegador):

En una conexión normal, con HTTP, el cliente hace una solicitud al servidor pidiendo por favor alguna *data*, el servidor responde con esa data o un error, y luego la conexión se cierra.

Como el cliente es el que abre la conexión e inicia la solicitud, no existe forma de que se envíe nueva data al cliente cuando el servidor sabe que tiene una actualización.

Aquí es donde entran los [WebSockets](https://en.wikipedia.org/wiki/WebSocket).

Como con cualquier otra solicitud HTTP, el navegador inicia la conexión, pero indica que desearía *mejorar* la conexión a WebSocket. Si el servidor lo acepta, se cambia el protocolo. La conexión no terminará, y en su lugar se mantendrá abierta hasta que uno de ambos lados decida cerrarla.

Ahora tenemos una conexión **bidireccional** abierta donde ambos lados pueden transmitir data, con la principal ventaja de que el servidor puede mandar actualizaciones seleccionadas al cliente.

Esto puede ser muy útil si tienes múltiples usuarios viendo la misma data, y uno hace una actualización. Normalmente los otros usuarios no verán esa información hasta que actualizasen la página. WebSockets permite mostrar esos cambios en tiempo real.

En [este post de Dimas Pardo](https://ehorus.com/es/que-es-websocket/) tienes más detalles.

## Integración con React Query

Como React Query es en principio una librería async de gestión de estado para el lado cliente, este artículo **no** entrará en cómo gestionar WebSockets en el servidor.

React Query no incluye nada específico para WebSockets. Esto no quiere decir que no soporte WebSockets o que no funcionen bien con la librería. Solo que React Query es *muy* agnóstica en cuanto a cómo obtienes tu data: Todo lo que necesita para funcionar es una `Promesa` resuelta o rechazada, el resto depende de ti.

## Paso a paso

La idea general es montar tus solicitudes como siemppre, como si no fueras a trabajar con WebSockets. La mayoría del tiempo tendrás tus *endpoints* HTPP habituales para solicitar o mutar data.

```js
// solicitar todos los posts
const usePosts = () => useQuery(['posts', 'list'], fetchPosts);

// solicitar un post
const usePost = (id) =>
  useQuery(['posts', 'detail', id], () => fetchPost(id));

// 🟢 nada nuevo
```

Por otro lado, puedes crear un `useEffect` a nivel app que conecte con tu endpoint WebSocket. Su funcionamiento dependerá de qué tecnología estés usando.

Hay quien se suscribe a data en tiempo real desde [Hasura](https://github.com/TanStack/query/issues/171#issuecomment-649810136). Hay un gran artículo sobre conectarse a [Firebase](https://aggelosarvanitakis.medium.com/a-real-time-hook-with-firebase-react-query-f7eb537d5145). En este ejemplo vamos a usar la [API WebSocket](https://developer.mozilla.org/es/docs/Web/API/WebSocket) nativa del navegador:

```js
// hook para la conexión
const useReactQuerySubscription = () => {
  React.useEffect(() => {
    const websocket = new WebSocket('wss://echo.websocket.org/');
    
    // conectado
    websocket.onopen = () => {
      console.log('connected');
    }
    // desconexión
    return () => {
      websocket.close();
    }
  }, []);
}
```

## Consumir data

Tras configurar la conexión, seguramente tendremos algún tipo de *callback* que llamaremos cuando llegue data a través del WebSocket. De nuevo, qué data es esta dependerá de cómo lo hayas configurado. Inspirado por [este mensaje](https://github.com/TanStack/query/issues/171#issuecomment-649716718) de [Tanner Linsley](https://github.com/tannerlinsley), yo prefiero mandar *eventos* desde el backend en lugar de objetos de data completos:

```js
const useReactQuerySubscription = () => {
  // creamos un cliente de React Query
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    const websocket = new WebSocket('wss://echo.websocket.org/');
    
    // conectado
    websocket.onopen = () => {
      console.log('connected');
    }
    // al recibir un mensaje
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // auto-crear la queryKey a partir del evento recibido
      const queryKey = [...data.entity, data.id].filter(Boolean);
      // invalidar las solicitudes afectadas
      queryClient.invalidateQueries(queryKey);
    }
    // desconexión
    return () => {
      websocket.close();
    }
  }, [queryClient]);
}
```

Eso es realmente todo lo que necesitas para que las vistas de *list* y *detail* se actualicen cuando recibes un evento.

- `{ "entity": ["posts", "list"] }` invalidará la lista de posts.
- `{ "entity": ["posts", "detail"], id: 5 }` invalidará un post.
- `{ "entity": ["posts"] }` invalidará todo lo relacionado con posts.

[La Invalidación de Solicitudes](https://tanstack.com/query/v4/docs/guides/query-invalidation) combina muy bien con los WebSockets. Este sistema también soluciona el problema de recibir excesiva data, ya que si recibimos un evento para una entidaad en la que no estamos interesados, no pasará nada:

Por ejemplo, si estamos en la página de *Perfil*, y recibimos una actualización para *Posts*, `invalidateQueries` se asegurará de que la siguiente vez que visites la página *Posts* esta sea re-solicitada. Eso sí, no la re-solicitará directamente, ya que no tenemos observadores activos. Si nunca visitamos esa página, la actualización habría sido innecesaria.

### Actualizaciones parciales

Por supuesto, si tienes sets grandes de data que reciben actualizaciones **pequeñas** pero **frecuentes**, querrás mandar data parcial por el WebSocket.

¿Ha cambiado el título del post? Manda solo el título. ¿Ha cambiado el número de likes? Manda eso.

En estas actualizaciones parciales puedes usar [`queryClient.setQueryData`](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientsetquerydata) para cambiar directamente el caché de la solicitud en lugar de simplemente invalidarlo entero.

Esto será algo más laborioso si tienes múltiples `queryKey`s para la misma data, por ejemplo si tienes diversos criterios de filtrado como parte de la `queryKey`, o si quieres actualziar las vistas de lista *y* detalle con el mismo mensaje. [`queryClient.setQueriesData`](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientsetqueriesdata) te hará la vida más fácil en este caso.

```js
const useReactQuerySubscription = () => {
  // creamos un cliente de React Query
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    const websocket = new WebSocket('wss://echo.websocket.org/');
    
    // conectado
    websocket.onopen = () => {
      console.log('connected');
    }
    // al recibir un mensaje
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      queryClient.setQueriesData(data.entity, (oldData) => {
        const update = (entity) =>
          entity.id === data.id ? { ...entity, ...data.payload } : entity;
        return Array.isArray(oldData) ? oldData.map(update) : update(oldData);
      });
    }
    // desconexión
    return () => {
      websocket.close();
    }
  }, [queryClient]);
}
```

Un poco demasiado *dinámico* para mi gusto, no maneja la adición o borrado (es un ejemplo simplificado), y a [TypeScript](/react-query/react-query-typescript/) no le hará mucha gracia, así que yo prefiero la invalidación.

De todas formas, aquí tienes un [ejemplo en codesandbox](https://codesandbox.io/s/react-query-websockets-ep1op) con ambos tipos de eventos: invalidación y actualizaciones parciales.

<Box>

**Nota**: Verás que el *hook* es algo más complicado porque se usa el mismo WebSocket para simular la re-solicitud del servidor. No te preocupes por ello si tienes un servidor real.

</Box>

## Aumentar `staleTime`

React Query viene con un `staleTime` de *cero* [por defecto](https://tanstack.com/query/v4/docs/guides/important-defaults). Esto significa que todas las solicitudes serán inmediatamente consideradas como **obsoletas**, lo que a su vez significa que re-solicitará cuando un nuevo suscriptor sea montado, o cuando el usuario enfoque la ventana. Es así para mantener tu data lo más actualizada posible.

Esto choca un poco con WebSockets, que ya actualizan tu data en tiempo real. ¿Para qué necesito re-solicitar data cuando acabo de *invalidar* el caché porque el servidor me lo acaba de decir con un mensaje expreso?

Así que si ya actualizas toda tu data por WebSockets de todas formas, considera ajustar un `stateTime` alto.

En el ejemplo anterior en *codesandbox* se usa `Infinity`. Esto significa que la data será solicitada inicialmente con `useQuery`, y luego siempre vendrá del caché. Las re-solicitudes solo ocurren por las invalidaciones explícitas.

El mejor sistema para esto es ajustar el valor por defecto global al crear el `QueryClient`:

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
```
