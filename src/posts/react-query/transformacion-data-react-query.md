---
title: Transformación de data en React Query
seoTitle: "Transformar Data con React Query: Cómo y Dónde hacerlo para Optimizar tu App"
description: Descubre las posibilidades para transformar data tras una solicitud con React Query, una tarea habitual e importante para mejorar tu app
date: 2022-09-28
status: published
original:
  title: React Query Data Transformations
  url: https://tkdodo.eu/blog/react-query-data-transformations
series:
  name: react-query-tkdodo
  index: 2
---

Bienvenido a la parte 2 de la serie de posts sobre React Query.

A medida que el autor se va adentrando más en esta librería y la comunidad alrededor de ella, va observando ciertos **patrones** en las preguntas que la gente suele formular. En lugar crear un artículo completo sobre ello, va diseccionando cada tema en diferentes posts más manejable.

Este, el primero de ellos, trata sobre una tarea bastante habitual e importante:

## Transformación de data

Si tu caso es como el de la mayoría, lo más probable es que no uses GraphQL en tu app en producción. Si lo haces alégrate, porque tienes el *lujo* de poder de solicitar tu data en el formato que desees.

Si trabajas con REST estás más limitado por lo que devuelve el *backend*. ¿Cómo y dónde es la mejor manera de transformar la data cuando usas React Query? La única respuesta real en desarrollo software también aplica aquí:

> Depende.
>
> – Todos los desarrolladores, siempre

Aquí tienes 3+1 ideas sobre **dónde** puedes transformar data, con sus respectivos pros y contras:

### 0. En el *backend*

Este es mi favorito, si te lo puedes permitir. Si el backend devuelve **exactamente** la estructura que quieres, no necesitas hacer nada más.

Esto puede sonarte irreal en muchos casos (por ejemplo cuando trabajas con APIs REST públicas), pero es muy posible en aplicaciones internas donde la API y el frontend es desarrollado por el mismo equipo.

Si controlas el backend y existe un *endpoint* del que obtienes la data para tu caso concreto, devuélvela con el formato que necesitas en el *frontend* y listo.

🟢 Nada que hacer en el frontend.

🔴 No siempre es posible.

### 1. En la `queryFn` de React Query

La `queryFn` es la función que pasas a `useQuery`. El *hook* espera que la función devuelva una Promesa, y la data resultante se alojará en el caché de la *query*.

Pero eso no quiere decir que estés obligado a devolver la data en el mismo formato en el que la recibes desde el backend. Puedes transformarla antes de devolverla:

```ts
// definir la "queryFn"
const fetchTodos = async (): Promise<Todos> => {
  // obtener la data desde el backend
  const response = await axios.get('todos');
  const data: Todos = response.data;

  // transformarla una vez obtenida, antes de devolverla
  // (en este caso, devolver solo el "name" en mayúsculas)
  return data.map((todo) => todo.name.toUpperCase())
}

// definir el hook custom
export const useTodosQuery = () => useQuery(['todos'], fetchTodos)
```

En el frontend, ya puedes trabajar con esta data *como si viniera así desde el backend*. De hecho, según el ejemplo, en ningún lugar en tu código tendrías disponibles unos "name"s que **no** estuvieran en mayúsculas. Tampoco tendrás acceso a la estructura original.

En muchos caso esto es perfectamente aceptable y ya tendrías suficiente, sin complicarte más la vida como en las siguientes opciones que vamos a ver. Eso sí, recuerda que:

- Si miras en las DevTools de React Query (las Herramientas del desarrollador propias, de las que hablamos [en la primera parte](/react-query/consejos-practicos-react-query/)), verás la data con la estrucura **transformada**.
- Si miras el resultado de *Red* (en las Herramientas del Desarrollador de tu navegador) verás la estructura **original** enviada por el backend.

Además, no hay optimización posible por parte de React Query: Cada vez que solicitas la data, tu transformación se ejecuta. Si es un proceso *costoso*, considera una de las próximas alternativas.

Algunas empresas también tienen una capa compartida extra para la solicitud de data, así que quizás no tengas acceso a esta capa para realizar tus transformaciones.

🟢 Transformación *cerca* del backend.

🟡 La estructura transformada va al caché, así que no tienes acceso a la estructura original.

🔴 Se ejecuta en cada solicitud.<br/>
🔴 Imposible si tienes una capa compartida previa que no puedes modificar libremente.

### 2. En la función de renderizado

Como te aconsejaba en la parte 1, si has creado un hook personalizado para cada solicitud, puedes transformar tu data ahí mismo:

```ts
// definir la "queryFn"
const fetchTodos = async (): Promise<Todos> => {
  // obtener la data desde el backend
  const response = await axios.get('todos');
  return response.data;
};

// definir el hook custom
export const useTodosQuery = () => {
  const queryInfo = useQuery(['todos'], fetchTodos);

  return {
    ...queryInfo,
    // aplicar la transformación de data antes del render
    data: queryInfo.data?.map((todo) => todo.name.toUpperCase()),
  };
};
```

Ahora bien, haciéndolo así esto se ejecutará tanto cada vez que **solicites** data, como también en cada nuevo **renderizado** de tu componente (incluso en los que no involucren solicitudes de data).

Quizás esto no sea un problema en tu app, pero si lo es puedes optimizarlo con el hook `useMemo`.

#### Si vas a usar `useMemo`

Ten cuidado de definir las dependencias lo más *estrechamente* posible:

`data` dentro de `queryInfo` será **estable** hasta que haya un cambio importante (en cuyo caso también querrás re-ejecutar la transformación), pero `queryInfo` por sí mismo **no lo será**. Si añades `queryInfo` como dependencia, la transformación se ejecutará en cada renderizado y no habremos conseguido nada:

```ts
export const useTodosQuery = () => {
  const queryInfo = useQuery(['todos'], fetchTodos);

  return {
    ...queryInfo,
    data: React.useMemo(
      () => queryInfo.data?.map((todo) => todo.name.toUpperCase()),
      // 🚨 fíjate en añadir "queryInfo.data", no solo "queryInfo":
      [queryInfo.data]
    ),
  };
};
```

Especialmente si tienes lógica adicional en tu hook personalizado que combinar con tu transformación de data, esta es una buena opción. Ten en cuenta que `data` puede ser `undefined`, así que usa [*encadenamiento opcional*](http://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (optional chaining) cuando trabajes con ella.

🟢 Optimizable con `useMemo`.

🟡 La estrcutura original no se puede inspeccionar en las DevTools.

🔴 La sintaxis es un poco más *barroca*.<br/>
🔴 `data` puede ser `undefined`.

### 3. Usar la opción `select`

La versión 3 de React Query introdujo los *selectores*, que también se pueden usar para transformar la data:

```ts
// definir el custom hook
export const useTodosQuery = () =>
  useQuery(['todos'], fetchTodos, {
    // usar la opción select para aplicar la transformación
    select: (data) => data.map((todo) => todo.name.toUpperCase()),
  });
```

Los selectores solo serán ejecutados si **existe** la data, así que aquí no te tienes que preocupar porque sea `undefined`. Un selector como el del ejemplo se ejecuta en cada render, ya que su identidad cambia (es una función *inline*). Si tu transformación es *costosa*, tienes dos opciones:

Puedes memorizarlo con `useCallback`:

```ts
// definir el custom hook
export const useTodosQuery = () =>
  useQuery(['todos'], fetchTodos, {
    // memorizar con useCallback
    select: React.useCallback(
      (data: Todos) => data.map((todo) => todo.name.toUpperCase()),
      []
    ),
  })
```

O extrarlo a una función **estable**:

```ts
// función estable
const transformTodoNames = (data: Todos) =>
  data.map((todo) => todo.name.toUpperCase());

// definir el custom hook
export const useTodosQuery = () =>
  useQuery(['todos'], fetchTodos, {
    // ✅ usar la función definida
    select: transformTodoNames,
  });
```

#### Puedes ir más allá

Yendo aún más lejos, la opción `select` se puede usar para suscribirse solo a partes de la data. Esto es lo que hace este método realmente único.

Según este ejemplo:

```js
// definir un hook inicial que acepta un selector como prop
export const useTodosQuery = (select) =>
  useQuery(['todos'], fetchTodos, { select });

// usarlo pasándole el selector que quedamos en cada caso:
// - devolver solo el número total de "Todo"s
export const useTodosCount = () => useTodosQuery((data) => data.length);
// - buscar un único "Todo" según su "id"
export const useTodo = (id) =>
  useTodosQuery((data) => data.find((todo) => todo.id === id));
```

Aquí hems creado un hook [tipo useSelector de Redux](https://react-redux.js.org/api/hooks#useselector) pasando un selector personalizado a nuestro `useTodosQuery`. El hook todavía funcionará como antes, ya que si no le pasas nada `select` será `undefined` y devolverá todo correctamente.

Pero si le pasas un selector, solo te suscribes al resultado de esa función. Esto es muy potente, ya que significa que incluso aunque actualicemos el nombre de un "ToDo", el componente que se suscribió a la cuenta total vía `useTodosCount` **no re-renderizará**. La cuenta no ha cambiado, así que React Query no necesita *informar* a ese componente sobre la actualización (recuerda que esto es un ejemplo simplificado y no del todo cierto, hablaremos de esto en profundidad en [la parte 3: Optimización del renderizado](/react-query/optimizacion-renderizado-react-query/)).

🟢 Máxima optimización.<br/>
🟢 Permite suscripciones parciales.

🟡 La estructura puede ser diferente en cada componente.<br/>
🟡 *Compartir estructura* (structural sharing) se realiza dos veces (hablamos de esto en detalle en la parte 3)
