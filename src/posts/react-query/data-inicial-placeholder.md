---
title: Data inicial y de ejemplo en React Query
seoTitle: Data Inicial y de Ejemplo (Placeholder) en React Query
date: 2022-12-13
description: "Conoce las distintas formas de evitar spinners de carga con React Query: Usa data inicial o placeholder para eludir cambios bruscos en tu app"
status: published
original:
  title: Placeholder and Initial Data in React Query
  url: https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
series:
  name: react-query-tkdodo
  index: 9
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

El artículo de hoy va sobre mejorar la experiencia del usuario al trabajar con React Query.

La mayor parte del tiempo no nos hacen mucha gracia esos marcadores giratorios de "Cargando...". Son necesarios *algunas* veces, pero queremos evitarlos siempre que sea posible.

Y React Query ya **nos da las herramientas** necesarias para librarnos de ellos en la mayoría de situaciones:

- Recibimos data desactualizada desde la caché mientras en el *background* se está actualizando.
- Podemos [pre-solicitar la data](https://tanstack.com/query/v4/docs/react/guides/prefetching) si sabemos que la necesitaremos luego.
- Incluso podemos [preservar la data previa](https://tanstack.com/query/v4/docs/react/guides/paginated-queries#better-paginated-queries-with-keeppreviousdata) cuando nuestras `query key`s cambian y queremos evitar esos estados de carga tan bruscos.

Otra forma es precargar la caché **de forma síncrona** con la data que pensemos que será correcta para nuestro caso, y para eso React Query ofrece dos enfoques distintos pero parecidos: [Data de ejemplo (placeholder)](https://tanstack.com/query/latest/docs/react/guides/placeholder-query-data) y [Data inicial](https://tanstack.com/query/latest/docs/react/guides/initial-query-data).

Vamos a empezar con lo que ambas formas tienen en común, y luego exploraremos sus diferencias y las situaciones donde una será mejor que la otra.

## Similitudes

Como ya hemos comentado, ambos enfoques ofrecen una forma de precargar la caché con data que tenemos disponible de forma síncrona.

Esto significa que si proveemos alguna de estas opciones nuestra solicitud no estará nunca en estado `loading`, y pasará directamente a `success`.

Además, ambas pueden ser tanto **un valor** como **una función** que devuelva un valor, para las ocasiones donde calcular ese valor sea costoso:

```tsx
function Component() {
  // 🟢 "status" será "success" aunque todavía no hayamos recibido la data
  const { data, status } = useQuery({
    queryKey: ['number'],
    queryFn: fetchNumber,
    placeholderData: 23,
  });

  // 🟢 lo mismo usando initialData y una función
  const { data, status } = useQuery({
    queryKey: ['number'],
    queryFn: fetchNumber,
    initialData: () => 42,
  });
}
```

Por último, ninguna de las dos tiene ningún efecto si ya tienes data en tu caché.

Por eso... ¿qué diferencia hay entre usar una o la otra?

## Inciso: opciones de una `query`

Para entenderlo, primero tenemos que mirar en un momento cómo (o *a qué nivel*) trabajan las opciones de una solicitud en React Query:

### A nivel caché

Por cada `query key` existe una única entrada en el caché. Esto es más o menos obvio, porque parte de lo que hace genial a React Query es la posibilidad de compartir data *globalmente* en nuestra aplicación.

Algunas opciones que pasemos a `useQuery` afectarán a esta entrada en el caché, por ejemplo `staleTime` o `cacheTime`.

Como solo existe **una única** entrada, esas opiones especifican cuándo esta es considerada desactualizada, o cuándo puede ser *recolectada*.

### A nivel observador

Un *observador* en React Query es, por encima, una suscripción creada para una entrada en el caché. El observador revisa esa entrada y será informado cada vez que algo cambie.

La forma más básica de crear un observador es llamar a `useQuery`. Cada vez que lo hagamos, creamos un observador, y nuestro componente se re-renderizará cuando la data cambie. Esto por supuesto significa que podemos tener **múltiples observadores** controlando la misma entrada de caché.

<Box>

Por cierto, puedes ver cuántos observadores tiene una solicitud en el número a la izquierda de la `query key` en las Herramientas del Desarrollador de React Query (3 en este ejemplo):

![observers](/posts/react-query-observers.png)

</Box>

Algunas opciones que trabajan a nivel observdador son `select` o `keepPreviousData`.

De hecho, lo que hace `select` tan bueno para [transformaciones de data](/react-query/transformacion-data-react-query/) es la habilidad para observar la misma entrada de caché, pero suscibirse a diferentes *porciones* de esta data en cada componente.

## Diferencias

Básicamente, `initialData` trabaja a nivel **caché**, mientras que `placeholderData` actúa a nivel **observador**. Esto tiene un par de consecuencias:

### Persistencia

Para empezar, `initialData` es persistida en caché. Es una forma de decirle a React Query: Tengo data *buena* para este caso, data que es tan buena como si la hubieras solicitado desde el backend.

Como funciona a nivel caché, solo puede haber **una** `initialData`, y esa data será puesta en caché tan pronto como esa entrada sea creada (cuando el primer observador sea montado). Si tratas de montar un segundo observador con `initialData` diferente, no hará nada.

Por otro lado, `placeholderData` no se persiste en caché **nunca**. Es una data de tipo *provisional*. No es *real*. React Query te lo ofrece para que puedas mostrar *algo* mientras la data real se está solicitando.

Como funciona a nivel observador, teóricamente podrías hasta tener diferentes `placeholderData` en diferentes componentes.

### Re-solicitudes de fondo

Con `placeholderData` siempre tendrás una re-solicitud de fondo (background refetch) cuando montes un observador la primera vez. Como la data *no es real*, React Query conseguirá la data real por ti.

Mientras esto ocurre, también obtendrás un indicador `isPlaceholderData` devuelto desde `useQuery`. Puedes usar este marcador para avisar visualmente a tus usuarios de que la data que están viendo es en realidad data *de ejemplo*. Volverá a `false` en cuanto la data real te llegue.

Con `initialData`, como la data es tan válida como cualquier otra que pondríamos en caché, se respeta `staleTime`. Si tienes un `staleTime` de 0 (valor por defecto), verás de todas formas una re-solicitud de fondo.

Pero si ajustas `staleTime` (por ejemplo 30 segundos) en tu `query`, React Query verá la data inicial y pensará:

> Oh, ya estoy recibiendo data nueva síncronamente, muchas gracias, no necesito ir al backend porque esta data es válida para los próximos 30 segundos.
>

Si esto no es lo que quieres, puedes pasar `initialDataUpdatedAt` a tu query. Esto le dirá a React Query cuándo se ha creado esta data inicial, y las re-solicitudes de fondo se llamarán teniendo esto en cuenta.

Esto es muy útil cuando uses data inicial desde una entrada de caché existente, usando la marca de tiempo `dataUpdatedAt` disponible:

```tsx
const useTodo = (id) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
    staleTime: 30 * 1000,
    initialData: () =>
      queryClient
        .getQueryData(['todo', 'list'])
        ?.find((todo) => todo.id === id),
    initialDataUpdatedAt: () =>
      // 🟢 re-solicitará en el background
      // si nuestra data es más antigua que "staleTime" (30 segundos)
      queryClient.getQueryState(['todo', 'list'])?.dataUpdatedAt,
  });
}
```

### Gestionar los errores

Imagina que usas `initialData` o `placeholderData`, se ejecuta una re-solicitud de fondo, y esta **falla**. ¿Qué crees que pasaría en cada caso?

He escondido las soluciones para que lo pienses primero, antes de expandirlas 😉

<details>
  <summary>Con <code>initialData</code></summary>
  <p>
    Como <code>initialData</code> es persistida al caché,
    el error en la re-solicitud es tratado como cualquier otro error en el <i>background</i>.
    Nuestra query estará en estado de <code>error</code>,
    pero nuestra <code>data</code> todavía estará ahí.
  </p>
</details>

<details>
  <summary>Usando <code>placeholderData</code></summary>
  <p>
    Como <code>placeholderData</code> es data irreal, y algo no ha funcionado,
    ya no veremos <strong>ninguna data</strong>. Nuestra query estará en estado de <code>error</code>,
    y nuestra <code>data</code> será <code>undefined</code>.
  </p>
</details>

## Cuál usar cuándo

Como siempre, depende de lo que prefieras. Personalmente uso `initialData` cuando estoy precargando una query **a partir de otra**, y `placeholderData` para todo lo demás.
