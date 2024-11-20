---
title: Gestión de Errores en React Query
seoTitle: Los 3 Sistemas Recomendados para Gestionar Errores en React Query
description: 'Cómo gestionar errores en React Query y notificar al usuario: usa Error Boundary, el estado de la función, o las callback onError'
date: 2023-02-08
status: published
original:
  title: React Query Error Handling
  url: https://tkdodo.eu/blog/react-query-error-handling
series:
  name: react-query-tkdodo
  index: 11
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

La gestión de errores es una parte integral del trabajo con datos asíncronos, especialmente las solicitudes de data. Asumámoslo: No todas las solicitudes tendrán éxito, ni todas las Promesas se completarán.

Aun así, a menudo esto es algo en lo que no pensamos desde el principio. Preferimos gestionar los casos _bonitos_, y la gestión de errores se convierte más en una idea secundaria.

Eso sí, no pensar sobre cómo vamos a gestionar nuestros errores puede afectar negativamente la experiencia de usuario. Para evitar eso, vamos a sumergirnos en las opciones que ofrece React Query cuando hablamos de gestión de errores.

## Prerrequisitos

React Query necesita una Promesa **rechazada** para gestionar los errores correctamente. Por suerte, esto es lo que obtendrás cuando trabajes con librerías como [Axios](https://axios-http.com/).

Pero si trabajas con [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) u otras librerías que _no_ te den una Promesa rechazada o códigos de error 4xx o 5xx, tendrás que hacer esa transformación por tu cuenta en la `queryFn`. Esto está cubierto [en los docs oficiales](https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default).

## El ejemplo estándar

Veamos cómo suelen ser la mayoría de ejemplos sobre mostrar errores:

```tsx
function TodoList() {
  const todos = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (todos.isPending) {
    return "Loading...";
  }

  // 🟢 gestión de errores estándar
  // (también podría comprobar: todos.status === 'error')
  if (todos.isError) {
    return "An error occurred";
  }

  return (
    <div>
      {todos.data.map((todo) => (
        <Todo key={todo.id} {...todo} />
      ))}
    </div>
  );
}
```

Aquí gestionamos las situaciones de error comprobando el valor `isError` (derivado del enum `status`) que nos da React Query.

Esto es correcto para algunos casos, pero también tiene un par de desventajas:

1. No gestiona muy bien los errores en el _background_: ¿Realmente querríamos desmontar nuestra lista `<Todo>` completa porque un _refetch_ haya fallado? Quizás la API está temporalmente caída, o hemos alcanzado un límite de llamadas, en cuyo caso podría funcionar de nuevo en unos minutos. Puedes echar un vistazo al [número 4: Comprobar estados en React Query](/react-query/comprobar-estado-react-query/) para ver cómo mejorar esta situación.
2. Puede convertirse en algo muy repetitivo si tienes que hacer esto en cada componente que haga una solicitud.

Para solucionar el segundo problema podemos usar directamente una característica propia de React:

## _Barreras_ de error (error boundaries)

Los [error boundary](https://es.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) (o _barreras_ de error) son un concepto general en React para capturar errores de ejecución que suceden al renderizar, lo que nos permite reaccionar correctamente y mostrar una UI _fallback_ en su lugar,

Esto está bien porque podemos _envolver_ nuestros componentes en Error Boundaries con la granularidad que queramos, y el resto de la UI no se verá afectada por este error.

Una cosa que los Error Boundaries **no pueden hacer** es capturar errores asíncronos, ya que estos no ocurren durante el renderizado. Así que para que esto funcione con React Query, la librería captura el error por ti internamente y lo re-lanza en el siguiente ciclo de renderizado para que el Error Boundary pueda pillarlo.

Esto es un enfoque simple pero **genial** para la gestión de errores, y todo lo que tienes que hacer para que funcione es pasar la opción `throwOnError` a tu _query_ (o ponerla en la configuración por defecto):

```tsx
function TodoList() {
  // 🟢 propagará todos los errores el Error Boundary más cercano
  const todos = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    throwOnError: true, // <-
  });

  if (todos.data) {
    return (
      <div>
        {todos.data.map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </div>
    );
  }

  return "Loading...";
}
```

Desde la versión 3.23.0 de React Query puedes incluso personalizar qué errores deberían ir hacia un Error Boundary, y cuáles prefieres gestionar localmente, pasando una función a `throwOnError`:

```ts
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  // 🚀 solo los errores de servidor irán al Error Boundary
  throwOnError: (error) => error.response?.status >= 500,
});
```

Esto también funciona para [mutaciones](https://react-query.tanstack.com/guides/mutations), y es bastante útil en el envío de formularios. Los errores 4xx se pueden gestionar localmente (por ejemplo si una validación del backend ha fallado), mientras que los 5xx se pueden propagar al Error Boundary.

<Box type="updated">

**Recuerda**: Antes de React Query v5 la opción `throwOnError` se llamaba `useErrorBoundary`.

</Box>

## Mostrar notificaciones de error

En algunos casos puede ser mejor mostar una notificación tipo pop-up que aparezca en algun sitio (y desaparezca sola), en lugar de renderizar banners de alerta en la pantalla. Estas normalmente se abren de forma imperativa, como las que ofrece [react-hot-toast](https://react-hot-toast.com/).

```ts
import toast from 'react-hot-toast';

toast.error('Something went wrong');
```

...¿Y cómo podemos hacer esto cuando obtengamos un error de React Query?

### La _callback_ `onError`

<Box type="updated">

**Actualización**: Las callbacks `onError` y `onSuccess` a continuación se eliminaron de React Query a partir de la v5. Puedes leer las razones [aquí](https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose).

</Box>

```ts
const useTodos = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    // 🟡 parece ok, pero quizás _no_ sea lo que quieres...
    onError: (error) => toast.error(`Something went wrong: ${error.message}`),
  });
```

A primera vista parece que la callback `onError` es exactamente lo que necesitamos para lanzar un _efecto secundario_ si el `fetch` falla, y funcionará bien... ¡Siempre que solo usemos **una vez** nuestro hook personalizado!

La callback `onError` en el `useQuery` se llama para **cada `Observer`**, lo que significa que si llamas a `useTodos` dos veces en tu app, obtendrás **dos** notificaciones de error, aunque solo haya fallado **una** llamada de red.

Conceptualmente, puedes imaginar que la callback `onError` funciona parecido a un `useEffect`. Así que si expandiéramos lo anterior a esa sintáxis, será más evidente que se ejecutará para cada _Consumer_:

```ts
const useTodos = () => {
  const todos = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // 🚨 los efectos se ejecutan individualmente
  // para cada componente que usa este hook
  React.useEffect(() => {
    if (todos.error) {
      toast.error(`Something went wrong: ${todos.error.message}`);
    }
  }, [todos.error]);

  return todos;
};
```

Por supuesto, si no añades la callback al hook personalizado, sino a la invocación del hook, todo está bien. Pero ¿qué pasa si no queremos notificar a todos los Observers de que la llamada falló, sino solo avisar al usuario **una vez**? Para esto, React Query tiene callbacks en otro nivel:

### Callbacks globales

Hay que proporcionar las callbacks globales al crear el `QueryCache`, lo que ocurre de forma implícita al crear un `new QueryClient`, pero también se puede personalizar:

```ts
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error(`Something went wrong: ${error.message}`),
  }),
});
```

Esto mostrará solo una notificacíon por solicitud, justo lo que queremos 🥳. También es probablemente el mejor lugar para poner cualquier tipo de _tracking_ o monitorización de errores, porque está **garantizado** que solo se ejecutará una vez por solicitud y **no puede ser sobreescrito** por, por ejemplo, `defaultOptions`.

## Poniendo todo en conjunto

Las tres formas principales de gestionar errores en React Query son:

- la propiedad `error` al usar `useQuery`.
- la callback `onError` (en la llamada, o las globales de QueryCache).
- usar Error Boundaries.

Puedes mezclarlas como prefieras, y lo que el autor recomienda es mostrar notificaciones de error para llamadas en el background (para mantener la UI intacta), y gestionar todo lo demás con Error Boundaries:

```ts
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 🟢 solo muestra notificaciones si tenemos data en cache
      // lo que indica un error en un refetch del background
      if (query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`);
      }
    },
  }),
});
```
