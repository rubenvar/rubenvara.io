---
title: React Query y TypeScript
seoTitle: "React Query y TypeScript: Supera los Gotchas y Consigue la Mejor Experiencia"
description: Combinando estas dos potentes herramientas en una app React conseguirás experiencias de usuario y desarrollo óptimas, y gran seguridad de tipos
date: 2022-10-11
status: published
original:
  title: React Query and TypeScript
  url: https://tkdodo.eu/blog/react-query-and-type-script
series:
  name: react-query-tkdodo
  index: 6
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

[TypeScript](https://www.typescriptlang.org/) está 🔥 *on fire*. Parece que en esto estamos de acuerdo dentro de la comunidad *frontend*. Muchísimos desarrolladores ya esperan que una librería esté escrita en TypeScript o al menos provea **definiciones de tipos**.

Para mí, si una librería está escrita en TypeScript, las definiciones de tipos son los mejores docs que existen. Nunca estarán incorrectos porque reflejan directamente la implementación. Muchas veces inspecciono los tipos antes de leer los docs de la librería.

React Query fue inicialmente escrita en JavaScript (v1), y después fue reescrita en TypeScript para la v2. Esto quiere decir que ahora ya existe muy buen soporte para los usuarios de TypeScript.

Hay, de todas formas, un par de *gotchas* o *sorpresas* al trabajar con TypeScript debido a lo dinámico e *inopinado* que es React Query. Vamos a verlos de uno en uno para mejorar tu experiencia todavía más.

## Genéricos (*Generics*)

React Query hace un uso extenso de [genéricos](https://www.typescriptlang.org/docs/handbook/2/generics.html). Esto es necesario porque la librería no solicita data por ti, así que **no puede** saber qué `tipo` tendrá la data devuelta por tu backend/API.

La sección sobre TypeScript en [los docs oficiales](https://tanstack.com/query/v4/docs/typescript) no es muy extensa, y nos dice que debemos especificar explícitamente los Genéricos que `useQuery` esperará cuando lo llames:

```ts
function useGroups() {
  return useQuery<Group[], Error>('groups', fetchGroups);
}
```

Con el paso del tiempo React Query ha añadido más Genéricos al *hook* `useQuery` (ahora existen cuatro), mayormente porque se ha añadido nueva funcionalidad.

El código anterior funciona, y se asegurará de que la propiedad `data` de nuestro hook personalizado tiene el tipo correcto (`Group[] | undefined`), además de que nuestro `error` sea del tipo `Error | undefined`.

Pero no funcionará así para casos más avanzados, especialmente cuando se necesiten los otros dos Genéricos.

### Los cuatro Genéricos

Esta es la definición actual del hook `useQuery`:

```ts
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>
```

Hay muchas cosas juntas aquí, así que vamos a verlo uno por uno:

- `TQueryFnData`: el tipo devuelto por la función `queryFn`. En el ejemplo anterior es `Group[]`.
- `TError`: el tipo de los errores que esperar de `queryFn`. `Error` en el ejemplo.
- `TData`: el tipo que nuestra data tendrá finalmente. Solo es relevante si usas la opción `select`, ya que entonces la propiedad `data` puede ser diferente de la que devolvería la `queryFn`. Sino, será por defecto lo que `queryFn` devuelva.
- `TQueryKey`: el tipo de la `queryKey`, solo relevante si usas la `queryKey` que se pasa a tu `queryFn`.

Como puedes ver, todos esos Genéricos tienen valores predeterminados, lo que significa que si no provees unos, TypeScript recurrirá a esos tipos.

<Box>

Esto funciona muy parecido a los parámetros por defecto en JavaScript:

```js
  // si no se provee "b", será "2"
function multiply(a, b = 2) {
  return a * b;
}

multiply(10, 5) // devuelve 50
multiply(10) // devuelve 20
```

</Box>

### Inferencia de tipos

TypeScript funciona mejor si le dejas inferir (o *averiguar*) por sí mismo qué tipo debería tener cada cosa. No solo hace que tu código sea más fácil de *escribir* (no tienes que poner todos los tipos), sino también que sea más fácil de *leer*. En muchos casos hará que tu código tenga el mismo aspecto que si fuera JavaScript.

Dos ejemplos muy simples de inferencia de tipos:

```ts
// 🟢 num es de tipo "number"
const num = Math.random() + 5;
```

```ts
// 🟢 tanto "greeting" como el resultado de "greet" serán "string"
function greet(greeting = 'ciao') {
  return `${greeting}, ${getName()}`
}
```

Respecto a los Genéricos, también pueden ser parcialmente inferidos desde su uso, lo que es súper genial. Podrías proveerlos manualmente, pero en muchos casos no es necesario:

```ts
// función que devuelve el mismo valor y acepta Genéricos
function identity<T>(value: T): T {
  return value;
}

// 🟡 no haría falta pasar el Genérico
let result = identity<number>(23)

// 🟡 no haría falta anotar el resultado
let result: number = identity(23)

// 🟢 inferirá correctamente que "result" es tipo "string"
let result = identity('react-query-string-text');
```

### La Inferencia Parcial de Argumentos de Tipo

...no existe en TypeScript todavía ([mira esta *issue* abierta](https://github.com/microsoft/TypeScript/issues/26242)). Esto significa que si provees *un* Genérico, tienes que proveerlos *todos*.

Pero como React Query usa valores predeterminados en su Genéricos, podemos no darnos cuenta de esto. Los mensajes de error devueltos pueden ser un poco *crípticos*.

Veamos un ejemplo donde esto es contraproducente:

```ts
function useGroupCount() {
  return useQuery<Group[], Error>('groups', fetchGroups, {
    select: (groups) => groups.length,
    // 🔴 Type '(groups: Group[]) => number' is not assignable to type '(data: Group[]) => Group[]'.
    // 🔴 Type 'number' is not assignable to type 'Group[]'.ts(2322)
  });
}
```

Como no hemos pasado un **tercer Genérico**, se carga el valor por defecto, que es también `Group[]`, pero en realidad devolvemos un `number` desde nuestra función `select`.

Una solución es simplemente añadir el tercer Genérico:

```ts
function useGroupCount() {
  // 🟢 solucionado
  return useQuery<Group[], Error, number>('groups', fetchGroups, {
    select: (groups) => groups.length,
  });
}
```

Mienstras no tengamos Inferencia Parcial de Argumentos de Tipo, hay que usar lo que podamos.

Así que, ¿cuál es la alternativa?

### Inferirlo todo

Empecemos por **no** pasar ningún Genérico y dejar que TypeScript decida qué hacer. Para que esto funcione necesitamos que la función `queryFn` devuelva un *buen* tipo. Por supuesto, si agregas tu función en-línea sin un tipo explícito para su resultado, tendrás `any`, porque eso es lo que `axios` o `fetch` te darán:

```ts
function useGroups() {
  // 🔴 data será "any" en este caso
  return useQuery('groups', () =>
    axios.get('groups').then((response) => response.data) // queryFn en-línea
  );
}
```

Si te gusta, como a mí, mantener tu capa de API separada de tus solicitudes, tendrás que añadir definiciones de tipo para evitar `any` implícito, así que React Query puede inferir el resto:

```ts
// extraemos y anotamos la queryFn
function fetchGroups(): Promise<Group[]> {
  return axios.get('groups').then((response) => response.data);
}

// 🟢 "data" será "Group[] | undefined" en este caso
function useGroups() {
  return useQuery('groups', fetchGroups);
}

// 🟢 "data" será "number | undefined" en este caso
function useGroupCount() {
  return useQuery('groups', fetchGroups, {
    select: (groups) => groups.length,
  });
}
```

Las ventajas de este sistema son:

- Ya no hay que especificar los Genéricos manualmente.
- Funciona en casos donde el tercer Genérico (`select`) y el cuarto (`queryKey`) era requeridos.
- Seguirá funcionando si se añaden más Genéricos a React Query.
- El código es menos confuso y se parece más a JavaScript.

### ¿Y qué hay de `error`?

Por defecto, sin ningún Genérico, el tipo de `error` será inferido a `unknown`.

Esto podría sonarte como un *bug*, ¿por qué no es `Error`? Esto se hace a propósito, porque en JavaScript puedes devolver *cualquier cosa* desde `throw`, no tiene por qué ser de tipo `Error`:

```js
// todos son totalmente válidos
throw 5;
throw undefined;
throw Symbol('foo');
```

Como React Query no se encarga de la función que devuelve la Promesa, tampoco puede saber qué `tipo` de errores producirá. Así que `unknown` es lo correcto.

Una vez que TypeScript permita saltarse algunos Genéricos al llamar a una función con múltiples Genéricos (mira [esta *issue* para más información](https://github.com/microsoft/TypeScript/issues/10571)) podremos controlar esto mejor. Pero por ahora, si necesitamos manejar errores y no queremos pasar Genéricos, podemos reducir el tipo con una comprobación `instanceof`:

```tsx
const groups = useGroups();

if (groups.error) {
  // 🔴 esto no funciona porque: Object is of type 'unknown'.ts(2571)
  return <div>An error occurred: {groups.error.message}</div>;
}

// 🟢 el check "instanceof" reduce a tipo `Error`
if (groups.error instanceof Error) {
  return <div>An error occurred: {groups.error.message}</div>
}
```

Como de todas formas tenemos que comprobar si existe un error, el check `instanceof` parece una buena idea, y además se asegurará de que nuestro `error` tiene una propiedad `message`.

Esto va en línea con TypeScript, ya que desde la versión 4.4 tenemos el indicador `useUnknownInCatchVariables` (según [esto](https://github.com/microsoft/TypeScript/issues/41016)), con el que las variables `catch` son `unknown` en lugar de `any` como anteriormente.

## *Narrowing* de tipos

Es probable que no uses la desestructuración con React Query. Primero porque nombres como `data` y `error` son muy genéricos (a propósito), así que de todas formas los renombrarás. Mantener todo el objeto será lo que dé contexto a qué `data` es, o de dónde viene el `error`.

Además, **antes de TypeScript 4.6**, ayudaba a TypeScript a ajustar los tipos cuando usabas uno de los indicadores booleanos de estado, algo que no podías conseguir si usabas la desestructuración:

```ts
// solicitud
const { data, isSuccess } = useGroups();

if (isSuccess) {
  // 🔴 aquí "data" todavía será de tipo `Group[] | undefined`
}

// solicitud sin desestructurar resultado
const groupsQuery = useGroups();

if (groupsQuery.isSuccess) {
  // 🟢 "groupsQuery.data" será de tipo `Group[]`
}
```

Esto no tenía nada que ver con React Query, es como TypeScript funcionaba. En [este tweet](https://twitter.com/danvdk/status/1363614288103964672) de [@danvdk](https://twitter.com/danvdk) hablan más del tema.

<Box type="updated">

**Actualizado**: Como te decía, TypeScript 4.6 añadió [control flow analysis for destructured discriminated unions](https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/#cfa-destructured-discriminated-unions), lo que hace que ambos ejemplos del código superior funcionen. Así que esto ya no es un problema.

</Box>

## Tipos con la opción `enabled`

Como vimos [en la parte 1](/react-query/consejos-practicos-react-query/), la opción `enabled` es muy potente, pero puede ser un poco confuso usarla a nivel de tipos si quieres emplearla para [Solicitudes Dependientes](https://tanstack.com/query/v4/docs/guides/dependent-queries) y desactivar tu solicitud mientras algunos parmámetros no estén definidos:

```ts
// queryFn
function fetchGroup(id: number): Promise<Group> {
  return axios.get(`group/${id}`).then((response) => response.data);
}

// solicitud
function useGroup(id: number | undefined) {
  return useQuery(['group', id], () => fetchGroup(id), {
    // activar la solicitud solo si existe "id"
    enabled: Boolean(id),
  });
// 🔴 Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
// 🔴 Type 'undefined' is not assignable to type 'number'.ts(2345)
}
```

Técnicamente, TypeScript está en lo cierto, `id` es posiblemente `undefined`: la opción `enabled` no hace ningún *Narrowing* de tipos.

Además existen formas de sobrepasar la opción `enabled`, por ejemplo llamando al método `refetch` devuelvo por `useQuery`. En ese caso `id` podría ser `undefined`.

El mejor sistema, si no te gusta el [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator), es **aceptar** que `id` puede ser `undefined` y rechazar la promesa en la `queryFn`. Añade algo de duplicación, pero también es explícito y seguro:

```ts
// queryFn
function fetchGroup(id: number | undefined): Promise<Group> {
  // 🟢 comprobar "id" al inicio porque también puede ser `undefined`
  return typeof id === 'undefined'
    ? Promise.reject(new Error('Invalid id'))
    : axios.get(`group/${id}`).then((response) => response.data);
}

// solicitud
function useGroup(id: number | undefined) {
  return useQuery(['group', id], () => fetchGroup(id), {
    enabled: Boolean(id),
  })
}
```

## Actualizaciones optimistas

<Box type="updated">

**Actualización**: Desde TypeScript 4.7 se añadió [Improved Function Inference in Objects and Methods](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7-beta/#improved-function-inference-in-objects-and-methods), lo que soluciona el problema que te cuento a continuación. Las actualizaciones optimistas deberían inferir correctametne el tipo sin trabajo extra.

</Box>

Conseguir que las actualizaciones optimistas funcionen **bien** con TypeScript no es algo sencillo, así que tienes un extenso [ejemplo](https://tanstack.com/query/v4/docs/examples/react/optimistic-updates) en los docs.

La parte importante es: Tienes que definir explícitamente el tipo del argumento `variables` que pasas a `onMutate` para conseguir la mejor inferencia posible de tipos. [Este comentario](https://github.com/tannerlinsley/react-query/pull/1366#discussion_r538459890) también tiene más información.

## useInfiniteQuery

En general, agregar tipos a `useInfiniteQuery` no es diferente de `useQuery`. Un problema mencionable es que el valor `pageParam`, que es pasado a la función `queryFn`, tiene el tipo `any`. Podría mejorarse en la librería, pero mientras sea `any`, probablemente es mejor anotarlo explícitamente:

```ts
type GroupResponse = { next?: number, groups: Group[] }

const queryInfo = useInfiniteQuery(
  ['groups'],
  // 🟢 tipo explícito para sobreescribir `any`
  ({ pageParam = 0 }: { pageParam: GroupResponse['next']) =>
    fetchGroups(groups, pageParam),
  {
    getNextPageParam: (lastGroup) => lastGroup.next,
  }
)
```

Si `fetchGroups` devuelve una respuesta de tipo `GroupResponse`, `lastGroup` tendrá su tipo inferido correctamente, y podemos usar el mismo tipo para anotar `pageParam`.

## Tipo de la `queryFn` predeterminada

Muchos usuarios de React Query utilizan una [`defaultQueryFn`](https://tanstack.com/query/v4/docs/guides/default-query-function), una `queryFn` predeterminada. Es una buena forma de aprovechar la `queryKey` para construir la url de solicitud. Si agregas la función al crear el `queryClient`, el tipo de `QueryFunctionContext` también será adivinado:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        const { data } = await axios.get(`${baseUrl}/${url}`);
        return data;
      },
    },
  },
});
```

Esto funciona, pero `url` será inferido con el tipo `unknown`, porque `queryKey` es de tipo `unknown[]`:

En el momento en que se crea el `queryClient` no hay ninguna garantía de cómo se construirán las `queryKey`s al llamar a `useQuery`, así que no hay mucho que React Query pueda hacer. Esto ocurre por la naturaleza dinámica de esta funcionalidad.

No es algo negativo por si mismo, y solo quiere decir que tendrás que trabajar *defensivamente* y ajustar el tipo con comprobaciones al trabajar con ello, por ejemplo:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        // 🟢 ajustar el tipo de "url" a "string" para poder usarlo
        if (typeof url === 'string') {
          const { data } = await axios.get(`${baseUrl}/${url.toLowerCase()}`);
          return data;
        }
        throw new Error('Invalid QueryKey');
      },
    },
  },
});
```

Esto ilustra muy bien por qué `unknown` es un gran tipo (y poco usado) en comparación a `any`... aunque eso es un tema para otro post ;)
