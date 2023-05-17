---
title: Tests en React Query
seoTitle: Cómo Montar y Ejecutar tus Tests en React Query
description: "Preparar el entorno, simular solicitudes de red y sobreescribir el funcionamiento de React Query: Todo lo que necesitas para ejecutar tus pruebas"
date: 2022-10-04
status: published
original:
  title: Testing React Query
  url: https://tkdodo.eu/blog/testing-react-query
series:
  name: react-query-tkdodo
  index: 5
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

Las preguntas sobre tests en React Query son bastante comunes, así que voy a tratar de responder algunas aquí. Creo que una razón para ello es que probar [componentes *inteligentes*](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) no es una de las cosas más fáciles, aunque quizás esta divisón está más bien obsoleta con la aparición de los *hooks*. Ahora se recomienda usar hooks directamente en lugar de separaciones arbitrarias y *pasar props hasta el infinito*.

Esto es una mejora en cuanto a co-ubicación y legibilidad del código, pero ahora tenemos más componentes que consumen dependencias a parte de *solo las props*.

Quizás usan `useContext`. Quizás `useSelector`. O quizás `useQuery`.

Estos componentes, técnicamente, ya no son **puros**, porque llamarlos en diferentes entornos genera resultados distintos. Al probarlos tienes que preparar estos entornos con cuidado para conseguir que todo funcione.

## Simular solicitudes de red

Como React Query es una librería asíncrona de gestión de estado del servidor, tus componentes seguramente harán solicitudes a un *backend*. Este backend no está disponible al testear para devolver data real, y aunque lo estuviera seguramente no querrás que tus pruebas dependan de ello.

Hay decenas de artículos sobre cómo simular data con Jest. Puedes simular tu API si tienes una. Puedes simular `fetch` o `axios` directemente, aunque quizás no deberías, según el artículo [Stop mocking fetch](https://kentcdodds.com/blog/stop-mocking-fetch) de Kent C. Dodds.

Mi consejo es que uses [mock service worker](https://mswjs.io/) por [@ApiMocking](https://twitter.com/ApiMocking). Esta será tu *única fuente de verdad* en lo que respecta a simular tus APIs:

- Funciona en pruebas con `node`.
- Compatible con REST y GraphQL.
- Tiene un [addon para storybook](https://storybook.js.org/addons/msw-storybook-addon), así que puedes programar *stories* para tus componentes con `useQuery`.
- Funciona en el navegador, e incluso puedes ver las solicitudes ejecutándose en las herramientas del desarrollador.
- Funciona con `cypress`, similar a las *fixtures*.

---

Una vez clara la capa de red, podemos empezar a hablar sobre temas específicos de React Query:

## `QueryClientProvider`

Siempre que usas React Query necesitas un `QueryClientProvider` al que pasar un `QueryClient` – un contenedor que alojará el `queryCache`. Este caché contendrá a su vez la data de tus solicitudes.

Yo prefiero darle a cada test su propio `QueryClientProvider` y crear un nuevo `new QueryClient` para cada test. Así cada prueba está completamente **aislada** de las demás.

Un enfoque diferente podría ser limpiar el caché tras cada test, pero yo prefiero reducir todo lo posible el estado compartido entre tests. Sino podrías obtener resultados inesperados o erróneos cuando tus pruebas se ejecutan en paralelo.

### Para *hooks* personalizados

Si vas a probar tus hooks personalizados (y [ya vimos en la parte 1](/react-query/consejos-practicos-react-query/) que deberías tenerlos), seguramente quieras usar [react-hooks-testing-library](https://react-hooks-testing-library.com/). Es lo más fácil que existe para probar hooks. Con esta libería puedes **envolver** tu hook en un [*wrapper*](https://react-hooks-testing-library.com/reference/api#wrapper), que es un componente React para *envolver* durante el renderizado el componente a probar.

Pienso que este es el mejor sitio para crear tu `QueryClient`, ya que se ejecutará una vez por prueba:

```jsx
// componente "envolvedor"
const createWrapper = () => {
  // creamos un nuevo "QueryClient" en cada test
  const queryClient = new QueryClient();
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// test usando el wrapper que envolverá el componente a testear
test("my first test", async () => {
  const { result } = renderHook(() => useCustomHook(), {
    wrapper: createWrapper(),
  });
});
```

### Para componentes

Si quieres probar un componente que usa el hook `useQuery`, también tendrás que envolver ese componente en un `QueryClientProvider`. Puedes *envolver* la función `render` de [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/).

Mira un ejemplo en los [tests internos de React Query](https://github.com/TanStack/query/blob/ead2e5dd5237f3d004b66316b5f36af718286d2d/src/react/tests/utils.jsx#L6-L17).

### Descativa los *reintentos*

Es uno de los fallos más habituales al hacer pruebas con React Query: Esta librería hace **tres reintentos** con un retroceso exponencial, lo que significa que seguramente tus tests fallarán por *timeout* si quieres probar una solicitud errónea.

La forma más fácil de desactivar los reintentos es de nuevo vía `QueryClientProvider`. Extendiendo el ejemplo superior:

```jsx
// componente "envolvedor"
const createWrapper = () => {
  // creamos un nuevo "QueryClient" en cada test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // desactiva los reintentos
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// test usando el wrapper que envolverá el componente a testear
test("my first test", async () => {
  const { result } = renderHook(() => useCustomHook(), {
    wrapper: createWrapper(),
  });
}
```

Esto fijará el predeterminado para todas las solicitudes bajo este componente como "no reintentos".

Recuerda que esto solo funcionará si no has fijado *reintentos explícitos* en un `useQuery`. Si por ejemplo estableces una solicitud concreta con 5 reintentos, esto tendrá prioridad ante los valores por defecto.

### setQueryDefaults

Y el mejor consejo que puedo darte para evitar este problema es: **no fijes** estas opciones en `useQuery` directamente. Intenta usar o sobreescribir los valores por defecto todo lo posible, y si realmente necesitas cambiar algo para una solicitud específica, usa [queryClient.setQueryDefaults](https://tanstack.com/query/v4/docs/reference/QueryClient#queryclientsetquerydefaults).

Por ejemplo, en vez de fijar `retry` en `useQuery`:

```jsx
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  // 🔴 no podrás sobreescribir este ajuste en los tests!
  const queryInfo = useQuery('todos', fetchTodos, { retry: 5 });
}
```

Hazlo así:

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cambia los valores por defecto
      retry: 2,
    },
  },
});

// 🟢 solo la solicitud "todos" re-intentará 5 veces
queryClient.setQueryDefaults('todos', { retry: 5 });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
};

/* ... */
```

En este caso todas las solicitudes reintentarán 2 veces, solo `todos` reintentará 5 veces, y todavía tendrás la opción de **desactivarlo** para todas la solicitudes en los tests.

### ReactQueryConfigProvider

Por supuesto, esto último solo funciona para solicitudes donde conoces la `query key`. Algunas veces *realmente* necesitas ajustar valores para un subgrupo dentro de tu árbol de componentes.

En la v2 React Query tenía [ReactQueryConfigProvider](https://react-query-v2.tanstack.com/docs/api#reactqueryconfigprovider) exactamente para esto. Desde la v3 puedes hacer lo mismo con par de líneas extra:

```jsx
const ReactQueryConfigProvider = ({ children, defaultOptions }) => {
  const client = useQueryClient();
  // crear el cliente dentro de useState
  const [newClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: client.getQueryCache(),
        muationCache: client.getMutationCache(),
        defaultOptions,
      })
  );

  return (
    <QueryClientProvider client={newClient}>
      {children}
    </QueryClientProvider>
  );
};
```

Puedes verlo en acción en este [ejemplo de codesandbox](https://codesandbox.io/s/react-query-config-provider-v3-lt00f).

## Recuerda simpre usar `await` en la solicitud

Como React Query es **asíncrono** por naturaleza, cuando llames al hook no obtendrás un resultado inmediatamente. Normalmente estará en estado `loading` y sin data que comprobar.

Las [utilidades `async`](https://react-hooks-testing-library.com/reference/api#async-utilities) de react-hooks-testing-library ofrecen muchas formas de resolver este problema. En el caso más simple, podemos esperar hasta que la solicitud haya pasado a un estado de éxito.

```jsx
// componente "envolvedor" (similar a anteriores ejemplos)
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// test usando el wrapper que envolverá el componente a testear
test("my first test", async () => {
  const { result, waitFor } = renderHook(() => useCustomHook(), {
    wrapper: createWrapper()
  });

  // 🟢 esperar a la que la solicitud esté en "success"
  await waitFor(() => result.current.isSuccess);

  expect(result.current.data).toBeDefined();
}
```

<Box type="updated">

**Actualización**: [@testing-library/react v13.1.0](https://github.com/testing-library/react-testing-library/releases/tag/v13.1.0) tiene un nuevo [`renderHook`](https://testing-library.com/docs/react-testing-library/api/#renderhook) que puedes usar para esto.

Eso sí, no devuelve su propio `waitFor`, así que tendrás que [importarlo desde @testing-library/react](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor) en su lugar. La API es un poco distinta, ya que no permite devolver un booleano y espera una `Promesa` en su lugar.

Tenemos que modificar el código un poco:

```jsx
import { waitFor, renderHook } from '@testing-library/react';

test("my first test", async () => {
  const { result } = renderHook(() => useCustomHook(), {
    wrapper: createWrapper(),
  });

  // 🟢 devuelve una Promesa a "waitFor" vía "expect"
  await waitFor(
    () => expect(result.current.isSuccess).toBe(true)
  );

  expect(result.current.data).toBeDefined();
}
```

</Box>

## Silencia los errores

React Query, por defecto, muestra los errores en la consola. Esto puede ser bastante molesto durante las pruebas, ya que verás 🔴 en la consola aunque todos los tests sean 🟢. React Query te permite **sobreescribir** este comportamiento predeterminado:

```ts
import { setLogger } from 'react-query';

setLogger({
  log: console.log,
  warn: console.warn,
  // 🟢 no más errores en la consola
  error: () => {},
});
```

<Box type="updated">

**Actualización**: `setLogger` [fue retirado en la v4](https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#setlogger-is-removed). En su lugar puedes pasar un `logger` modificado al crear `QueryClient`:

```js
const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    // 🟢 no más errores en la consola
    error: () => {},
  }
});
```

</Box>

Además los errores ya no se muestran en producción para evitar confusiones.

## Todo junto

Dominik, el autor del post y *maintainer* de React Query, ha creado un repositorio donde todo esto **se une** muy sencillamente: mock-service-worker, react-testing-library, y el *wrapper* que hemos visto en los ejemplos.

Contiene 4 pruebas: tests básicos de fallo y éxito para hooks personalizados y para componentes. Puedes verlo aquí: <https://github.com/TkDodo/testing-react-query>.
