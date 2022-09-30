---
title: Optimización del renderizado en React Query
seoTitle: "Optimización del Renderizado en React Query: Cómo Evitar Re-Renders en tu App"
description: "Revisa estas 2 geniales funcionalidades de React Query para entender el renderizado de tu app y mejorar el rendimiento en cada caso"
date: 2022-09-29
status: published
original:
  title: React Query Render Optimizations
  url: https://tkdodo.eu/blog/react-query-render-optimizations
series:
  name: react-query-tkdodo
  index: 3
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

**Antes de empezar**: La *optimización del renderizado* es un concepto avanzado para cualquier app. React Query ya viene con optimizaciones y ajustes predeterminados muy buenos, y normalmente no hace falta tocar nada. Aun así, la gente tiende a dedicar mucho tiempo a los "renderizados innecesarios", y por eso el autor decidió escribir este artículo.

Pero recuerda: para la mayoría de aplicaciones este tipo de optimizaciones no importa tanto como piensas. Los re-renderizados son algo bueno, ya que se aseguran de que tu app está **actualizada**. Mejor un "re-render innecesario" que un "render que debería estar pero no está". Tienes más info sobre este tema:

- ["Fix the slow render before you fix the re-render"](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render) por Kent C. Dodds (y [su versión en castellano](https://www.sebastiangon11.com/blog/soluciona-los-renderizados-lentos-antes-de-los-re-renderizados) por Seba González).
- [Est artículo por @ryanflorence sobre optimizaciones prematuras](https://reacttraining.com/blog/react-inline-functions-and-performance).

---

En la [parte 2: Transformación de data con React Query](/react-query/transformacion-data-react-query/) ya hablamos por encima de la optimización del renderizado en la opción `select`. Aun así, quizás una de las preguntas más habituales es:

> ¿Por qué React Query re-renderiza mi componente dos veces si nada ha cambiado en mi data?

Vamos a verlo:

## Transición `isFetching`

En el último ejemplo de la parte 2 no fuimos del todo honestos cuando dijimos que este componente solo se re-renderizaría si la cuenta de "to do"s cambiara:

```tsx
// definir un hook inicial que acepta un selector como prop
export const useTodosQuery = (select) =>
  useQuery(['todos'], fetchTodos, { select });

// hook custom para devolver solo el número total de "Todo"s
export const useTodosCount = () => useTodosQuery((data) => data.length);

// componente
function TodosCount() {
  const todosCount = useTodosCount();

  return <div>{todosCount.data}</div>;
};
```

Cada vez que se haga una *re-solicitud de fondo* (background refetch), el componente del ejemplo se re-renderizará dos veces con la siguiente info:

```js
{ status: 'success', data: 2, isFetching: true }
{ status: 'success', data: 2, isFetching: false }
```

Esto pasa porque React Query expone diversa meta-información sobre cada solicitud, e `isFetching` es parte de ella. Esta *marca* será siempre `true` cuando se esté ejecutando una solicitud. Esto es **muy útil** si quieres mostrar un indicador de progreso, pero bastante inútil si no vas a hacerlo.

### La opción `notifyOnChangeProps`

Para estos casos React Query te ofrece la opción `notifyOnChangeProps`. Se puede ajustar en cada solicitud para decirle a React Query: "Por favor, avísame solo si cambia alguna de estas propiedades". Si lo ajustamos como `['data']`, conseguiremos la versión optimizada que buscábamos:

```ts
// definir un hook inicial que acepta como props:
// - un selector
// - las dependencias que observar antes de avisar de cambios
export const useTodosQuery = (select, notifyOnChangeProps) =>
  useQuery(['todos'], fetchTodos, { select, notifyOnChangeProps });

// hook para devolver solo el número total cuando cambie "data"
export const useTodosCount = () =>
  useTodosQuery((data) => data.length, ['data']);
```

Puedes verlo en acción en el ejemplo [optimistic-updates-typescript](https://github.com/TanStack/query/blob/9023b0d1f01567161a8c13da5d8d551a324d6c23/examples/optimistic-updates-typescript/pages/index.tsx#L35-L48) en los docs.

### Mantener la sincronización

El código del ejemplo funciona, pero podría perder la sincronización muy fácilmente.

¿Qué pasa si quisiéramos *reaccionar* a los errores? ¿O si empezamos a usar la *marca* `isLoading`? Tendríamos que mantener la lista `notifyOnChangeProps` sincronizada con cualquier campo que estemos usando en los componentes donde se use este *hook*.

Si se nos olvida una y solo observamos la propiedad `data`, y ocurre un error que querríamos mostrar, nuestro componente no se re-renderizará y por lo tanto estará **desactualizado**.

Esto es especialmente problemático si lo hemos metido directamente en el hook custom, ya que el hook no sabe qué usará el componente en realidad:

```tsx
// hook para devolver solo el número total cuando cambie "data"
export const useTodosCount = () =>
  useTodosQuery((data) => data.length, ['data']);

function TodosCount() {
  // 🚨 estamos usando "error", pero no se nos avisará cuando cambie "error"!
  const { error, data } = useTodosCount();

  return (
    <div>
      {error ? error : null}
      {data ? data : null}
    </div>
  );
};
```

Como te decía en el aviso inicial de este artículo, creo que esto es peor que un re-render innecesario de vez en cuando. Por supuesto, podríamos pasarle la opción `'error'` al hook custom, pero estarás conmigo en que hacerlo manualmente no es la mejor formar de *mantener* tu código.

¿Hay forma de hacerlo **automáticamente**? Pues sí:

### Solicitudes *rastreadas* (Tracked Queries)

Esta es la primera gran contribución del autor a la librería (gracias Dominik! 🙏).

Si ajustas `notifyOnChangeProps` a `['tracked']`, durante el renderizado React Query registrará qué campos utilizas en tus componentes, y los usará para crear la lista de dependencias. Esto optimizará el renderizado igual que si especificaras la lista manualmente, excepto que no tienes que preocuparte de ello.

También lo puedes activar **globalmente** para todas tus solicitudes:

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
};
```

Con esto no tienes que volver a pensar en los re-renderizados.

Por supuesto, nada es tan sencillo, y existe cierta carga extra cuando usas esta funcionalidad, así que utilízala sabiamente. Además, las solicitudes restreadas tienen algunas limitaciones, por eso no está activada por defecto:

- Si usas [el resto de una desestructuración](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#asignar_el_resto_de_un_arreglo_a_una_variable), estarás observando todos los campos. Una desestructuración normal está bien:

  ```ts
  // 🔴 rastreará todos los campos
  const { isLoading, ...queryInfo } = useQuery(/* ... */);

  // 🟢 esto está bien
  const { isLoading, data } = useQuery(/* ... */);
  ```

- Las solicitudes rastreadas solo funcionan *durante el renderizado*. Si solo accedes a campos en efectos secundarios, no se rastrearán. Esto es de todas formas un caso extremo debido a los *arrays* de dependencias:

  ```ts
  const queryInfo = useQuery(/* ... */);

  // 🔴 no registrará "data" correctamente
  React.useEffect(() => {
    console.log(queryInfo.data);
  });

  // 🟢 el array de dependencias es registrado durante el render
  React.useEffect(() => {
    console.log(queryInfo.data);
  }, [queryInfo.data]);
  ```

- Las solicitudes rastreadas no se resetean en cada renderizado, así que si registras un campo una vez, lo mantendrás registrado durante toda la vida del componente:

  ```tsx
  const queryInfo = useQuery(/* ... */);

  if (someCondition()) {
    // 🟡 se registrará "data" 
    // si "someCondition" fue "true" en cualquier render previo
    return <div>{queryInfo.data}</div>
  }
  ```

<Box type="updated">

**Actualización**: Desde React Query v4 las solicitudes registradas están acitvadas por defecto, y puedes desactivarlas ajustando `notifyOnChangeProps: 'all'`.

</Box>

## Compartir estructura (Structural sharing)

Una optimización del renderizado diferente y no menos importante que React Query tiene activada por defecto es "*compartir estructura*". Esta funcionalidad se asegura de que mantenemos la **igualdad referencial** de nuestra data en todos los niveles.

Como ejemplo, imagina que tenemos la siguiente estructura en nuestra data:

```json
[
  { "id": 1, "name": "Learn React", "status": "active" },
  { "id": 2, "name": "Learn React Query", "status": "todo" }
]
```

Supón que cambiamos nuestro primer "to do" al `status` "done" y se ejecuta una re-solicitud de fondo. Obtendremos un `json` **completamente nuevo** desde el *backend*, aunque sabemos que en realidad solo ha cambiado el primer "to do":

```json
[
  { "id": 1, "name": "Learn React", "status": "done" },
  { "id": 2, "name": "Learn React Query", "status": "todo" }
]
```

En este caso React Query tratará de **comparar** el estado viejo con el nuevo y mantener todo lo que pueda del anterior.

En el ejemplo, el array de "to do"s será nuevo, porque hemos actualizado un "to do". El objeto con `id: 1` también será nuevo, pero el objecto con `id: 2` tendrá la misma referencia que en el estado previo. React Query simplemente lo mantendrá y lo copiará al nuevo resultado porque nada ha cambiado en él.

Esto es muy **útil** cuando usamos selectores para suscripciones parciales, como en el hook que creamos en el último ejemplo de la parte 2:

```ts
// 🟢 solo re-renderizará si algo en el "to do" con "id: 2" cambia
const { data } = useTodo(2);
```

Como ya hemos dicho, con los selectores el "compartir estructura" se hace **dos veces:** Una con el resultado devuelto por `queryFn` para determinar si algo ha cambiado, y otra con el resultado de la función selectora.

Por eso, en algunos casos, especialmente con data de gran tamaño, "compartir estructura" puede convertirse en un cuello de botella. También, solo funciona con data serializable en JSON.

Si no necesitas esta optimización, puedes **desactivarla** ajustando `structuralSharing: false` en cualquier solicitud.

Revisa los [tests `replaceEqualDeep`](https://github.com/TanStack/query/blob/80cecef22c3e088d6cd9f8fbc5cd9e2c0aab962f/src/core/tests/utils.test.tsx#L97-L304) si quieres entender cómo funciona esto.

---

Bueno, un poco complejo, ¿no? Ya sabes, si tienes dudas escríbeme!
