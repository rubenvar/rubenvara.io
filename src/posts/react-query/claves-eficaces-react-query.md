---
title: Claves eficaces en React Query
seoTitle: "Query Keys eficaces en React Query: 4 Consejos para Mejorar tus Claves"
description: Aprende a gestionar las claves de React Query de manera eficaz a medida que tu app crece, y controla tu caché al detalle
date: 2022-11-27
status: published
original:
  title: Effective React Query Keys
  url: https://tkdodo.eu/blog/effective-react-query-keys
series:
  name: react-query-tkdodo
  index: 8
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

Las [Query Keys (o *claves* de solicitud)](https://tanstack.com/query/v4/docs/react/guides/query-keys) son un concepto básico **muy importante** en React Query. Son necesarias para:

1. Que la librería pueda mantener tu data en **caché** correctamente
2. Re-solicitar la data automáticamente cuando una dependencia de la solicitud **cambia**.
3. Te permitirán interactuar el con caché de la *query* **manualmente** cuando lo necesites, por ejemplo cuando quieras actualizar la data después de una mutación, o cuando quieras invalidar algunas solicitudes.

## Los 3 puntos más importantes de las `query key`s

Vamos a ver rápidamente qué significan estos tres puntos, antes de enseñarte cómo organizo personalmente las `query key`s para poder hacer todas estas cosas más efectivamente.

### 1. Data en caché

Internamente, el Caché de la solicitud es **un simple objeto** de JavaScript, donde las claves son Query Keys serializadas y los valores son tu Query Data + meta información.

Las claves son codificadas (*hash-eadas*) [de forma determinística](https://tanstack.com/query/v4/docs/react/guides/query-keys#query-keys-are-hashed-deterministically), así que también puedes usar objetos (aunque en el top level, las claves tienen que ser cadenas o arrays).

La parte más importante es que las claves tienen que ser **únicas** en tus solicitudes. Si React Query encuentra una entrada para una clave en el caché, la usará.

Además, fíjate en que no puedes usar la misma `key` para `useQuery` **y** para `useInfiniteQuery`. Después de todo, existe **solo un** Query Caché, así que se compartiría la data entre estos dos. Esto no es bueno porque las solicitudes infinitas tienen una estructura completamente distinta de las solicitudes *normales*:

```ts
// si ya existe esta query...
useQuery(['todos'], fetchTodos);

// 🔴 esto no funcionará (estamos reutilizando la clave)
useInfiniteQuery(['todos'], fetchInfiniteTodos)

// 🟢 usa otra clave en su lugar
useInfiniteQuery(['infiniteTodos'], fetchInfiniteTodos)
```

### 2. Re-solicitar automáticamente

<Box>

Las solicitudes son *declarativas*

</Box>

Este es un concepto **muy importante** que no puedo enfatizar suficiente, y también es algo que quizás tardará en *hacerte click*. La mayoría piensa en las solicitudes, y especialmente en las re-solicitudes, de forma *imperativa*.

Veamos un caso práctico:

Tengo una query, solicita cierta data. Luego hago click en un botón y quiero resolicitar la data, pero con parámetros diferentes. He visto muchos intentos que se parecen a esto:

```tsx
function Component() {
  const { data, refetch } = useQuery(['todos'], fetchTodos);

  // 🟡 ¿cómo paso parámetros a "refetch"?
  return <Filters onApply={() => refetch(/* ??? */)} />
}
```

La respuesta es: *no lo haces*. Porque `refetch` no es para eso. Es para re-solicitar **con los mismos parámetros**.

Si tienes un estado que cambia tu data, todo lo que necesitas es ponerlo en la `query key`, porque React Query provocará una re-solicitud automáticamente siempre que la clave cambie. Así que cuando quieras aplicar filtros, simplemente cambia tu estado:

```tsx
function Component() {
  // mantenemos los filtros en un estado
  const [filters, setFilters] = useState();
  // metemos los filtros en la query key
  const { data } = useQuery(['todos', filters], () => fetchTodos(filters));

  // 🟢 cambia el estado local y deja que este "maneje" la query
  return <Filters onApply={setFilters} />
```

El re-renderizado provocado por la actualización de `setFilters` pasará una `query key` diferente a React Query, lo que hará que este re-solicite la data. Mira un ejemplo más detallado en [el primer post de la serie](/react-query/consejos-practicos-react-query/).

### 3. Interacción manual

Las interacciones manuales del caché de la solicitud es donde la estructura de tus `query key`s es más importante.

Muchos de estos métodos de interacción, como [`invalidateQueries`](https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientinvalidatequeries) o [`setQueriesData`](https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientsetquerydata), aceptan [Query Filters](https://tanstack.com/query/v4/docs/react/guides/filters#query-filters), que te permiten hacer coincidir de forma aproximada (*fuzzy*) las `query key`s.

---

## Claves eficaces en React Query

<Box>

Ten en cuenta que los siguientes puntos reflejan la **opinión** del autor (como todo lo que he traducido de su blog, en realidad), así que no te lo tomes como algo que seguir *al pie de la letra* cuando trabajes con `query key`s.

El autor ha descubierto que estas estrategias funcionan mejor cuando tu app se vuelve más compleja, y que también *escalan* bastante bien. Está claro que no necesitas todo esto para una app de ToDos 😁.

</Box>

### Coubicar

Si todavía no has leído [Mantenibilidad a través de la coubicación (Maintainability through colocation)](https://kentcdodds.com/blog/colocation) por [Kent C. Dodds](https://twitter.com/kentcdodds), por favor hazlo. No creo que almacenar todas tus Query Keys en  `/src/utils/queryKeys.ts` vaya a ayudarte en nada.

Yo mantengo todas las Query Keys junto a sus respectivas solicitudes, coubicadas en el mismo directorio, algo como esto:

```sh
- src
  - features
    - Profile
      - index.tsx
      - queries.ts
    - Todos
      - index.tsx
      - queries.ts
```

El archivo `queries.ts` contendrá todo lo relacionado con React Query. Normalmente solo exporto *hooks* personalizados, así que tanto las `queryFn` como las `query key`s serán locales.

### Usa **siempre** arrays como clave

Sí, las `query key` pueden ser cadenas, pero para mantener las cosas unificadas, uso siempre arrays. React Query convierte las cadenas a arrays internamente de todas maneras, así que...

```ts
// 🔴 se transformará a ['todos'] de todas formas
useQuery('todos')
// 🟢
useQuery(['todos'])
```

<Box type="updated">

**Actualización**: En la versión 4 de React Query, todas las claves tienen que ser arrays.

</Box>

### La estructura

Estructura tus `query key`s de **más genérica** a **más especifica**, con tantos niveles de granularidad como sea necesario.

Así es como estructuraría un listado de ToDos que permita listas filtrables y vistas detalle:

```ts
['todos', 'list', { filters: 'all' }]
['todos', 'list', { filters: 'done' }]
['todos', 'detail', 1]
['todos', 'detail', 2]
```

Con esa estructura, puedo invalidar:

- Cualquier cosa relacionada con `['todos']`.
- Todas las listas o todas las vistas detalle.
- Una lista o vista detalle concreta (si conozco la clave exacta).

[Actualizar a partir de las respuestas de una mutación](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses) se vuelve mucho más flexible gracias a este sistema, porque puedes seleccionar todas las listas si es necesario:

```ts
// hook personalizado
function useUpdateTitle() {
  return useMutation(updateTitle, {
    // tras una mutación con éxito:
    onSuccess: (newTodo) => {
      // 🟢 actualizar una vista detalle
      queryClient.setQueryData(['todos', 'detail', newTodo.id], newTodo);
      
      // 🟢 y actualizar todas las listas que contengan este "todo"
      queryClient.setQueriesData(['todos', 'list'], (previous) =>
        previous.map((todo) => (todo.id === newTodo.id ? newtodo : todo))
      );
    },
  });
}
```

Esto no funcionaría si la estructura de listas y vistas detalle difiere mucho, así que también podrías invalidar todas las listas en su lugar:

```ts
function useUpdateTitle() {
  return useMutation(updateTitle, {
    onSuccess: (newTodo) => {
      // igual que en el anterior
      queryClient.setQueryData(['todos', 'detail', newTodo.id], newTodo);

      // 🟢 pero invalidar todas las listas
      queryClient.invalidateQueries(['todos', 'list']);
    },
  });
}
```

Si sabes en qué listas estas actualmente, por ejemplo a partir de los filtros en la url, y puedes contruir la `query key` exacta, también puedes combinar ambos métodos y: Llamar a `setQueryData` en tu lista + Invalidar todas las otras:

```ts
function useUpdateTitle() {
  // un hook personalizado que devuelve los filtros actuales,
  // desde la url por ejemplo
  const { filters } = useFilterParams();

  return useMutation(updateTitle, {
    onSuccess: (newTodo) => {
      // igual que en los anteriores
      queryClient.setQueryData(['todos', 'detail', newTodo.id], newTodo);

      // 🟢 actualizar la lista exacta en la que estamos
      queryClient.setQueryData(['todos', 'list', { filters }], (previous) =>
        previous.map((todo) => (todo.id === newTodo.id ? newtodo : todo))
      )

      // 🥳 e invalidar todas las listas, pero no re-solicitar la activa
      queryClient.invalidateQueries({
        queryKey: ['todos', 'list'],
        refetchActive: false,
      });
    },
  });
}
```

<Box type="updated">

**Actualización**: En la versión 4 de React Query, `refetchActive` ha sido sustituido por `refetchType`. En el ejemplo, sería `refetchType: 'none'`, ya que no queremos re-solicitar nada.

</Box>

### Usa *fábricas* de `query key`s

En todos los ejemplos anteriores verás que he creado manualmente todas las Query Keys. Esto es no solo más propenso a errores, sino que también hace que los cambios sean más difíciles en el futuro si, por ejemplo, decides añadir *otro* nivel de granularidad a tus claves.

Por eso recomiendo usar una *fábirca* de `query key` por cada elemento.

Es simplemente un objeto con entradas y funciones que producirá `query key`s, y que pudedes usar después en tus hooks personalizados. Para la estructura del ejemplo anterior, sería algo como esto:

```ts
// la "fábrica"
const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};
```

Esto nos da una gran **flexibilidad** porque cada nivel se contruye sobre los anteriores, pero todos son accesibles de forma independiente:

```ts
// 🟢 eliminar todas las queries relacionadas con "todos"
queryClient.removeQueries(todoKeys.all);

// 🟢 invalidar todas las vistas de lista
queryClient.invalidateQueries(todoKeys.lists());

// 🟢 pre-solicitar un todo concreto
queryClient.prefetchQueries(todoKeys.detail(id), () => fetchTodo(id));
```
