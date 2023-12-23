---
title: React Query como un Gestor de Estado
seoTitle: React Query es Realmente un Gestor de Estado Asíncrono para Toda la Data de tu App
description: Todo lo que necesitas saber para hacer de React Query tu única fuente de verdad como gestor de estado asíncrono
date: 2023-01-06
status: published
original:
  title: React Query as a State Manager
  url: https://tkdodo.eu/blog/react-query-as-a-state-manager
series:
  name: react-query-tkdodo
  index: 10
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

A muchísima gente le _encanta_ React Query porque simplifica drásticamente la obtención de data en apps React. Así que... quizás te sorprenda si te digo que React Query **NO** es una librería de obtención de data.

React Query en realidad no solicita ninguna data por ti, y muy pocas de sus características están directamente ligadas a la red (destacan el [OnlineManager](https://tanstack.com/query/latest/docs/react/reference/onlineManager), `refetchOnReconnect`, o [reintentar mutaciones offline](https://tanstack.com/query/latest/docs/react/guides/mutations#retry)). Esto también te resultará obvio cuando escribas tu primera `queryFn` y tengas que usar _algo_ para obtener tu data, ya sea [fetch](https://developer.mozilla.org/es/docs/Web/API/Fetch_API), [axios](https://axios-http.com/), [ky](https://github.com/sindresorhus/ky), o hasta [graphql-request](https://github.com/jasonkuhrt/graphql-request).

Así que, si React Query no es una librería de obtención de data... ¿qué es?

## Un gestor de estado asíncrono

React Query es un gestor de estado async. Puede gestionar cualquier tipo de estado asíncrono: todo irá bien mientras reciba una `Promesa`. La mayoría del tiempo generamos Promesas al solicitar data, así que ahí es donde destaca. Pero hace más que simplemente gestionar los estados de carga y error por ti . Es un "gestor de estado global" real.

La `queryKey` identifica tu solicitud de forma única, así que mientras uses la misma clave en dos sitios diferentes, recibirás la misma data. Esto se puede abstraer mejor con un _custom hook_ para no tener que acceder a la función de solicitud de data dos veces:

```tsx
export const useTodos = () =>
  useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

function ComponentOne() {
  const { data } = useTodos();
}

function ComponentTwo() {
  // 🟢 recibirá exactamente la misma data que ComponentOne
  const { data } = useTodos();
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ComponentOne />
      <ComponentTwo />
    </QueryClientProvider>
  );
}
```

Esos componentes pueden estar _en cualquier sitio_ en tu árbol de componentes. Mientras estén bajo el mismo `QueryClientProvider`, recibirán la misma data.

React Query también _deduplica_ solicitudes que ocurrirían al mismo tiempo, así que en el ejemplo superior, aunque los dos components soliciten la misma data, solo existirá una llamada de red.

## Una herramienta de sincronización de data

Como React Query gestiona el estado asíncrono (o, en términos de obtención de data: estado del servidor), da por hecho que el frontend no es "propietario" de la data. Y eso es perfectamente válido:

Si mostramos en la pantalla la data obtenida de una API, solo mostramos una _captura_ de esta data: una versión del aspecto que tenía cuando la obtuvimos. Así que la pregunta que debemos hacernos es:

> ¿Es esa data correcta depués de obtenerla?

La respuesta depende totalmente del ámbito en el que estemos. Si solicitamos un _tweet_ con todos sus likes y comentarios, seguramente estará desactualizado bastante pronto. Si solicitamos tipos de cambio de divisas que se actualicen a diario, nuestra data será precisa durante algún tiempo incluso sin re-solicitar.

React Query provee los medios para _sincronizar_ nuestra versión con la del propietario real (el backend). Y al hacerlo, se inclina hacia el lado de actualizar a menudo más que hacia no actualizar con suficiente frecuencia.

### Antes de React Query

Antes de que librerías como React Query vinieran al rescate, eran comunes dos enfoques en la obtención de data:

- **Solicitar una vez, distribuir globalmente, actualizar casi nunca**: En algún punto se lanza una acción que inicia la solicitud de data, habitualmente al montar la app. Tras obtener la data, la ponemos en un gestor global de estado para poder acceder a ella desde cualquier punto de la app. Después de todo, muchos componentes necesitan acceder a esta información. ¿Re-solicitamos la data? No, ya la hemos _descargado_, así que ¿por qué querríamos hacerlo? Quizás si mandamos un POST al backend, será tan amable de pasarnos el estado más actual. Si quieres algo más preciso, siempre puedes actualizar la ventana...
- **Solicitar al montar, mantenerlo en local**: A veces podemos pensar que poner toda la data en un estado global es _demasiado_. Si solo necesitamos la data en un componente, podemos solicitarla en ese componente cuando se abra. Ya sabes: `useEffect` con `[]` como dependencias (recuerda usar `eslint-disable` si hay quejas...), `setLoading(true)`, etc. Por supuesto, ahora mostramos un _loading_ giratorio cada vez que ese componente se monte, hasta tener la data. ¿Qué otra cosa podemos hacer, si ya hemos perdido el estado local...?

---

Ambos enfoques son bastante subóptimos. El primero no actualiza nuestro caché local lo suficiente, y el segundo probablemente re-solicita con demasiada frecuencia, además de tener una UX cuestionable porque la data ya no está ahí cuando solicitamos por segunda vez.

¿Cómo enfoca React Query estos problemas?

### `stale-while-revalidate` (obsoleto-mientras-revalida)

Puede que lo hayas oido antes, es el mecanismo de caché que utiliza React Query. No es nada nuevo: puedes leer sobre las [extensiones HTTP de Control de Caché para Contenido Obsoleto aquí](https://datatracker.ietf.org/doc/html/rfc5861). En resument quiere decir que React query cacheará la data por ti y te la dará cuando la necesites, incluso si la data ya no está acutalizada (obsoleta).

El principio es que data obsoleta es mejor que nada, porque "nada" normalmente signigfica una _spinner_ de carga, y esto es percibido como _lento_ por los usuarios. Al mismo tiempo, tratará de hacer una re-solicitud en el fondo para revalidar la data.

### Re-solicitudes inteligentes

La invalidación del caché es algo bastante complicado, así que ¿cómo decides cuándo es el momento de pedir otra vez la data al backend? Por supuesto, no podemos hacerlo cada vez que un componente que llama a `useQuery` se re-renderice. Esto sería increíblemente _caro_, incluso según los estándares modernos.

Así que React Query es suficientemente inteligente y elige puntos estratégicos para lanzar un _refetch_. Puntos que parecen ser un buen indicador para decir: "Sí, ahora sería un buen momento para pedir data". Estos son:

- `refetchOnMount`: Cada vez que un nuevo componente que llama a `useQuery` se monta, React Query hará una revalidacón.
- `refetchOnwindowFocus`: Cada vez que _enfoques_ la pestaña, habrá una re-solicitud. Este es mi punto favorito para hacer una revalidación, pero muchas veces lleva a malentendidos. En desarrollo, cambiamos de pestaña muchas veces, así que percibimos esto como _demasiado_. Por otro lado, en proudcción esto habitualmente indica que un usuario que dejó nuestra app abierta en una pestaña ahora vuelve de revisar emails o mirar twitter. Mostrarles la info más actualizada tiene bastante sentido en esta situación.
- `refetchOnreconnect`: Si pierdes la conexión a internet y liego la recuperas, también es un buen indicador para revalidar lo que aparezca en pantalla.

Por último, si tú, como desarrollador de la app, conoces un buen momento para hacerlo, puedes lanzar una invalidación manual vía `queryClient.invalidateQueries`. Esto es muy útil tras hacer una mutación.

### Dejar que React Query _haga su magia_

Me encantan estos [valores predeterminados](https://tanstack.com/query/latest/docs/react/guides/important-defaults), pero como se ha dicho antes, están enfocados hacia mantener las cosas lo más actualizadas posible, y _no_ hacia minimizar las solicitudes de red. Esto ocurre principalmente porque `staleTime` es `0` por defecto, lo que significa que, por ejemplo, cada vez que montes una nueva instancia de un componente, se hara un _refetch_ en el fondo. Si haces esto bastante a menudo, especialmente con montajes frecuentes que no estén en el mismo ciclo de renderizado, puede que veas _muchas_ solicitudes en la pestaña de Red. Eso es porque React Query no puede _deduplicar_ en estas situaciones:

```tsx
function ComponentOne() {
  const { data } = useTodos();

  if (data) {
    // 🟡 se monta condicionalmente, solo cuando ya tenemos la data
    return <ComponentTwo />;
  }

  return <Loading />;
}

function ComponentTwo() {
  // 🟡 lanzará una segunda llamada de red
  const { data } = useTodos();

  /* ... */
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ComponentOne />
    </QueryClientProvider>
  );
}
```

> ¡Qué está pasando aquí! Acabo de solicitar data hace dos segundos, ¿por qué hay otra llamada de red?
>
> --Reacción muy válida al usar React Query por primera vez

Llegados a este punto puede parecer una buena idea pasar `data` vía `props`, o ponerla en un `Contexto` para evitar el traspaso excesivo de props, o deshabilitar los indicadores `refetchOnmount`/`refetchOnWindowfocus`, porque tantas solicitudes son demasiadas!

Generalmente, no hay nada malo en pasar data a través de props. Es la cosa más explícita que se puede hacer, y funcionaría bien en el ejemplo superior. Pero, ¿qué pasa si lo cambiamos un poco hacia una situación más real?:

```tsx
function ComponentOne() {
  const { data } = useTodos();
  const [showMore, toggleShowMore] = React.useReducer((value) => !value, false);

  // sí, dejamos la gestión de errores fuera del ejemplo
  if (!data) {
    return <Loading />;
  }

  return (
    <div>
      Todo count: {data.length}
      <button onClick={toggleShowMore}>Show More</button>
      {/* 🟢 muestra ComponentTwo tras pulsar el botón */}
      {showMore ? <ComponentTwo /> : null}
    </div>
  );
}
```

En este ejmplo, el segundo componente (que también depende de la data de "todos"), solo se montará después de que el usuario pulse un botón. Imagina que el usuario lo clica tras varios minutos. ¿No sería bueno una re-solicitud en esta situación, para que podamos mostrar los valores más actualizados?

Esto no sería posble si eligieras cualquiera de las opciones mencionadas, que básicamente se saltan lo que React Query querría hacer.

Así que, ¿cómo podemos quedarnos con los beneficios de ambos lados?

### Personalizar `staleTime`

Quizás ya hayas adivinado hacia dónde voy: La solución sería fijar `staleTime` a un valor que te parezca adecuado para tu caso específico. La clave es saber esto:

<Box>

Siempre que la data sea actual (_fresh_), vendrá solo del caché. Nunca verás una solicitud de red para data actual, no importa cuánto quieras recuperarla.

</Box>

Tampoco hay un valor _correcto_ para `staleTime`. En muchos casos, los valores por defecto funcionan muy bien. Personalmente, me gusta cambiarla a un mínimo de 20 segundos para deduplicar solicitudes en ese intervalo de tiempo, pero es totalmente decisión tuya.

#### Bonus: usar `setQueryDefaults`

Desde su versión 3, React Query ofrece una manera ideal de fijar valores predeterminados por _queryKey_ usando [`QueryClient.setQueryDefaults`](https://tanstack.com/query/latest/docs/react/reference/QueryClient#queryclientsetquerydefaults). Si sigues los patrones de los que hablamos [en la parte 8](/react-query/claves-eficaces-react-query), puedes fijar valores por defecto con toda la granularidad que quieras, porque pasar `queryKey`s a `setQueryDefaults` sigue el mismo filtrado estándar de React Query que usan el resto de [Filtros](https://tanstack.com/query/latest/docs/react/guides/filters#query-filters):

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🟢 por defecto globalmente a 20 segundos
      staleTime: 1000 * 20,
    },
  },
});

// 🚀 pero todo lo relacionado con los "todos" tendrá 1 minuto
queryClient.setQueryDefaults(todoKeys.all, { staleTime: 1000 * 60 });
```

## Un detalle sobre la separación de intereses

Es una preocupación bastante válida que añadir hooks como `useQuery` a componentes en todas las capas de tu app mezcla las _responsabilidades_ de lo que un componente debería hacer.

En _otros tiempos_, el patrón de componentes "smart-vs-dumb" se veía por todas partes. Prometía una separación clara, reusabilidad y facilidad para testear la app porque todos los componentes presentacionales solo "recibirían props". También llevo, por otro lado, a un traspaso excesivo de props (_prop drilling_), código repetido, patrones muy difíciles de añadir tipos estáticos y componentes divididos arbitrariamente.

Esto cambió mucho cuando llegaron los hooks. Ahora puedes usar `useContext`, `useQuery` o `useSelector` (con Redux) en cualquier sitio, y así inyectar las dependendicias en cada componente. Podríamos decir que esto hace tu componente más completo. También que es más independiente porque puedes moverlo libremente por tu app, y funcionará por sí mismo.

Te recomiendo echar un vistazo a [Hooks, HOCS, and Tradeoffs (⚡️) / React Boston 2019](https://www.youtube.com/watch?v=xiKMbmDv-Vw) por el maintainer de redux [Mark Erikson](https://twitter.com/acemarke).

En resumen, es cuestión de qué estés dispuesto a sacrificar. Lo que pueda funcionar en una situación, quizás no lo haga en otra. ¿Debería un `Button` reutilizable solicitar data? Probablemente no. ¿Tiene sentido dividir tu `Dashboard` en un `DashboardView` y un `DashboardContainer` que pasen props hacia abajo? Probablemente tampoco. Así que es responsabilidad tuya determinar los cuál es la herramienta correcta en cada caso.

## Conclusiones

React Query es perfecto para gestionar el estado asíncrono global en tu app, **si le dejas**.

Desactiva los indicadores de _re-solicitud_ si sabes que tiene sentido en tu situación, y resiste la tentación de sincronizar data delbackend con un gestor de estado diferente.

Normalmente, personalizar `staleTime` es todo lo que necesitas para conseguir una gran UX mientras mantienes el control de con qué frecuencia actualizas la data.
