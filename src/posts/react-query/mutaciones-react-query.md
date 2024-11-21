---
title: Domina las Mutaciones en React Query
seoTitle: 'Mutaciones: Efectos Secundarios, Invalidaciones y Actualización Optimista'
description: Aprende todo lo necesario sobre ejecutar efectos secundarios en el servidor con las mutaciones de React Query
date: 2023-02-27
status: published
original:
  title: Mastering Mutations in React Query
  url: https://tkdodo.eu/blog/mastering-mutations-in-react-query
series:
  name: react-query-tkdodo
  index: 12
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

Hemos cubierto ya mucho terreno en lo que se refiere a las caracterísicas y conceptos que ofrece React Query. La mayoría es sobre la *obtención* de data, usando el hook `useQuery`. Existe, aun así, una segunda parte integral al trabajar con data: la *actualización*.

Para este caso, React Query expone el hook `useMutation`.

## ¿Qué son las mutaciones?

Hablando en general, las mutaciones son funciones que tienen un *efecto secundario*. Por ejemplo, mira el métido `push` de un Array: tiene el efecto secundario de **cambiar** el array al que estás añadiendo un valor:

```js
const myArray = [1];
myArray.push(2);

console.log(myArray); // [1, 2]
```

El opuesto, **inmutable**, sería `concat`, que también puede añadir valores a arrays, pero devolverá el nuevo array, en lugar de manipular directamente el array original con el que trabajabas:

```ts
const myArray = [1];
const newArray = myArray.concat(2);

console.log(myArray); //  [1]
console.log(newArray); // [1, 2]
```

Como su nombre indica, `useMutation` también tiene una especie de efecto secundario. Como estamos en el contexto de la [gestión de estado del servidor](/react-query/react-query-gestor-estado/) con React Query, las mutaciones describen una función que realiza un efecto secundario **en el servidor**. Crear un nuevo `to-do` en tu base de datos sería una mutación. Loguear a un usuario sería también una mutación clásica, porque realiza el efecto secundario de crear un token para el usuario.

En algunos (pocos) aspectos, `useMutation` es similar a `useQuery`. En otros, muy diferente.

## Similitudes con `useQuery`

`useMutation` sigue el estado de una mutación, igual que `useQuery` hace para las solicitudes. Te dará valores `loading`, `error` y `status` para hacerte más sencillo mostrar a los usuarios qué está pasando.

...Y aquí acaban los parecidos: hasta React Query v4 (incluido) existían las callbacks `onSuccess`, `onError` y `onSettled` en ambos hooks, pero [esto ya no es así](https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose).

## Diferencias con `useQuery`

<Box>

- `useQuery` es **declarativo**.
- `useMutation` es **imperativo**.

</Box>

Eso significa que las solicitudes se ejecutan automáticamente. Defines las dependencias, pero React Query se encarga de ejecutar la solicitud inmediatamente, y también hace algunas actualizaciones en el *background* cuando lo estima necesario. Esto funciona muy bien para las solicitudes porque queremos mantener sincronizado lo que vemos en la pantalla con la data real en el backend.

Para las mutaciones, esto no funcionaría tan bien. Imagina que se creara un nuevo *to-do* cada vez que enfocas la ventana de tu navegador... Así que en lugar de ejecutar la mutación inmediatamente, React Query te da una función que puedes invocar cuando quieras hacer la mutación:

```tsx
function AddComment({ id }) {
  // esto no hace nada todavía
  const addComment = useMutation({
    mutationFn: (newComment) =>
      axios.post(`/posts/${id}/comments`, newComment),
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        // 🟢 mutación invocada cuando se envía el form
        addComment.mutate(
          new FormData(event.currentTarget).get('comment')
        )
      }}
    >
      <textarea name="comment" />
      <button type="submit">Comment</button>
    </form>
  )
}
```

Otra diferencia es que las mutaciones no comparten estado como hace `useQuery`. Puedes llamar a `useQuery` varias veces en componentes distintos y obtendrás siempre el mismo resultado desde caché. Pero esto no funcionará para las mutaciones.

<Box type="updated">

- **Actualización**: Empezando con la v5, puedes usar el hook [`useMutationState`](https://tanstack.com/query/v5/docs/react/reference/useMutationState) para compartir estado de mutación entre componentes.

</Box>

## Enlazando mutaciones con solicitudes

Las mutaciones, por diseño, no están emparejadas directamente con solicitudes. Una mutación que da un *like* a un artículo en un blog no tiene ningún enlace con la solicitud que obtiene ese artículo. Para que eso funcione necesitarías algún tipo de esquema interno, algo que React Query no tiene.

Para que el efecto de una mutación se refleje en nuestras solicitudes, React Query ofrece dos sistemas:

### Invalidación

Esta es conceptualmente la manera más sencilla de mantener tu *pantalla* actualizada. Recuerda que solo estamos mostrando una *captura* de la data del servidor en un instante concreto. React Query intenta mantenerse al día, por supuesto, pero si cambias el estado del servidor intencionalmente con una mutación, este es el momento ideal para avisarle de que alguna data en caché es ahora **inválida**.

React Query entonces irá y hará una re-solicitud de esa data si está en uso actualmente, y tu pantalla se actualizará automáticamente cuando la solictud termine. Lo **único** que tienes que hacer es decirle a la librería qué solicitudes invalidar:

```tsx
const useAddComment = (id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newComment) =>
      axios.post(`/posts/${id}/comments`, newComment),
    onSuccess: () => {
      // 🟢 re-solicitar los comentarios del post
      queryClient.invalidateQueries({
        queryKey: ['posts', id, 'comments']
      })
    },
  })
}
```

La invalidación de solicitud es bastante inteligente. Como todos los [filtros de solicitudes](https://react-query.tanstack.com/guides/filters#query-filters), usa búsqueda aproximada (fuzzy) en la `queryKey` de la solicitud. Si tienes múltiples keys para tu lista de comentarios, se invalidarán todas. Eso sí, solo se re-solicitarán las que estén actualmente actvas. El resto se marcará como obsoleta (stale), lo que causará su re-solicitud la próxima vez que se usen.

Como ejemplo, imagina que tenemos la opción de ordenar los comentarios, y cuando se añadió el nuevo comentario, teníamos dos solicitudes en nuestro caché:

```sh
['posts', 5, 'comments', { sortBy: ['date', 'asc'] }
['posts', 5, 'comments', { sortBy: ['author', 'desc'] }
```

Como solo estamos mostrando una de ellas en pantalla, `invalidateQueries` re-solicitará esa y marcará la otra como "obsoleta".

### Actualizaciones directas

Algunas veces preferimos no re-solicitar data, especialmente si la mutación ya devuelve todo lo que neceistas. Si tienes una mutación que actualiza el título de un artículo, y el backend devuelve el artículo completo como respuesta, puedes actualizar el caché directamente con `setQueryData`:

```ts
const useUpdateTitle = (id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTitle) =>
      axios
        .patch(`/posts/${id}`, { title: newTitle })
        .then((response) => response.data),
    // la respuesta se pasa a onSuccess
    onSuccess: (newPost) => {
      // 🟢 actualizar la vista detalle directamente
      queryClient.setQueryData(['posts', id], newPost)
    },
  })
}
```

Poner la data directamente en el caché con `setqueryData` actuará como si esta data se hubiera devuelto desde el backend, lo que significa que todos los componentes usando esa solicitud se re-renderizarán correctamente.

Tienes más ejemplos de actualizaciones directas y la combinación de los dos enfoques en la [parte 8, Claves eficaces](/react-query/claves-eficaces-react-query/).

---

El autor recomienda usar invalidación en la mayoría de casos. Por supuesto esto depende del caso de uso, pero para que las actualizaciones directas funcionen bien, necesitas más código en el frontend, y hasta cierto punto **lógica duplicada** desde el backend. Las listas ordenadas son, por ejemplo, bastante difíciles de ordenar directamente, ya que la posición de una entrada podría haber cambiado tras la actualización. Invalidar la lista completa es un enfoque más *seguro*.

## Actualizaciones optimistas

Las actualizaciones optimistas son uno de los puntos fuertes para usar las mutaciones de React Query. El caché de `useQurey` nos da data al instante al cambiar entre solicitudes, especialmente combinado con [prefetching](https://react-query.tanstack.com/guides/prefetching). Toda la UI parece muy rápida por ello, así que ¿por qué no tener las mismas ventajas para las mutaciones?

La mayor parte del tiempo tenemos la seguridad de que una mutación funcionará. ¿Por qué debería esperar el usuario unos segundos hasta que el backend nos dé el ok para mostrar el resultado en pantalla? La idea de las actualizaciones optimistas es *imitar* el éxito de una mutación incluso antes de mandarla al servidor. Cuando este nos devuelva una respuesta de éxito, todo lo que hay que hacer es invalidar la vista para volver a ver data *real*. Si la llamada falla, devolvemos la UI al estado anterior a la mutación.

Esto funciona muy bien para mutaciones *pequeñas* donde el usuario espera un feedback instantáneo. No hay nada peor que tener un botón tipo *switch* que haga una solicitud, y que no se mueva hasta que esta se haya completado. Los usuarios acabarán clicando dos o tres veces el mismo botón, y la UI parecerá lenta.

### ¿Ejemplos?

El autor ha decidido no mostar un ejemplo extra. [La documentación oficial](https://react-query.tanstack.com/guides/optimistic-updates) ya cubre este tema bastante bien, y también hay un ejemplo en codesandbox [con Typescript](https://tanstack.com/query/v4/docs/examples/react/optimistic-updates-typescript).

También opina que las actualizaciones optimistas se usan en *exceso*. No todas las mutaciones necesitan ser optimistas. Deberías tener mucha seguridad en que realmente casi nunca falla, porque la experiencia de usuario al volver atrás la UI no es muy buena: Imagina un formulario en una modal que se cierra cuando lo envías, o una redirección desde una vista detalle a una vista de lista tras una actualización. Si se hacen de forma prematura, es difícil deshacerlas.

Además, asegúrate de que el feedback instantáneo es **realmente necesario** (como en el botón del ejemplo anterior). El código para hacer funcionar actualizaciones optimistas no es trivial, especialemnte en comparación con mutaciones *normales*. Cuando replicas el resultado tienes que imitar lo que haría el backend, lo que puede ser tan sencillo como cambiar un booleano o añadir un item a un array, pero puede complicarse rápido:

- Si el *to-do* que añades necesita una `id`, ¿de dónde la sacas?
- Si la lista que se está viendo está ordenada, ¿meterás la nueva entrada en la posición correcta?
- ¿Qué pasa si otro usuario ha añadido algo más en ese intervalo? ¿Se moverá la entrada que hemos añadido a la lista cuando se haga una re-solicitud?

Todos estos casos pueden hacer peor la experiencia de usuario en algunas situaciones, donde habría valido con deshabilitar el botón y mostrar una animación de carga mientras la mutación está en marcha. Como siempre, deberías elegir la herramienta corecta para cada tarea.

## Problemas habituales

Para terminar, veamos algunas cosas que es bueno recordar al trabajar con mutaciones y que no son tan obvias al principio:

### Promesas pendientes

React Query hace un `await` con las promesas que se devuelven desde la callback de una mutación, y sucede que `invalidateQueries` devuelve una Promesa. Si quieres que tu mutación esté en estado `loading` mientras se actualizan las solicitudes relacionadas, tienes que devolver en tu callback el resultado de `invalidateQueries`:

```ts
{
  // 🚀 esperará a la invalidación para terminar
  onSuccess: () => {
    return queryClient.invalidateQueries({
      queryKey: ['posts', id, 'comments'],
    })
  }
}

{
  // 🚀 sin mirar atrás: no esperará
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['posts', id, 'comments']
    })
  }
}
```

### `mutate` o `mutateAsync`

El hook `useMutation` devuelve dos funciones: `mutate` y `mutateAsync`. ¿Cuál es la diferencia, y cuándo deberías usar cada una?

`mutate` no devuelve nada, mientras que `mutateAsync` devuelve una Promesa que contiene el resultado de la mutación. Así que podrías tener la tentanción de usar `mutateAsync` cuando necesitas acceder a la respuesta de una mutación, pero te recomendaría usar `mutate` *casi* siempre.

Siempre puedes acceder la `data` o el `error` a través de las callbacks de la mutación, y no tienes que preocuparte de gestionar los errores: como `mutateAsync` te da control sobre la Promesa, también tienes que capturar los errores manualmente, o puede que te salte una ["unhandled promise rejection"](https://stackoverflow.com/questions/40500490/what-is-an-unhandled-promise-rejection).

```ts
const onSubmit = () => {
  // 🟢 acceder a la respuesta desde onSuccess
  myMutation.mutate(someData, {
    onSuccess: (data) => history.push(data.url),
  })
}

const onSubmit = async () => {
  // 🚨 funciona, pero no se gestionan los errores
  const data = await myMutation.mutateAsync(someData)
  history.push(data.url)
}

const onSubmit = async () => {
  // 🟡 esto está bien, pero no puede ser más verboso...
  try {
    const data = await myMutation.mutateAsync(someData)
    history.push(data.url)
  } catch (error) {
    // no hacer nada
  }
}
```

Gestionar los errores no es necesario con `mutate`, porque React Query captura (y descarta) el error por ti internamente. Literalmente está implementado con: `mutateAsync().catch(noop)` 😎.

Las únicas situaciones donde es mejor usar `mutateAsync` es cuando realmente necesitas una Promesa por el hecho de que sea una promesa. Esto puede ser necesario si quieres lanzar múltiples Promesas de forma concurrente y esperar a que todas terminen, o si tienes mutaciones dependientes y no quieres caer en un "callback hell".

### Las mutaciones solo aceptan un argumento en `variables`

Como el último argumento de `mutate` es el objeto de opciones, `useMutation` actualmente solo acepta *un* argumento para variables. Esto es por supuesto una limitación, pero se puede salvar fácilmente usando un *objeto*:

```tsx
// 🔴 sintaxis inválida, NO funcionará
const mutation = useMutation({
  mutationFn: (title, body) => updateTodo(title, body),
})
mutation.mutate('hello', 'world')

// 🟢 usa un objeto para múltiples variables
const mutation = useMutation({
  mutationFn: ({ title, body }) => updateTodo(title, body),
})
mutation.mutate({ title: 'hello', body: 'world' })
```

Para leer más sobre por qué esto es necesario, puedes mirar [esta discusión](https://github.com/tannerlinsley/react-query/discussions/1226).

### Algunas callbacks no se ejecutarán

Puedes tener callbacks tanto en `useMutation` como en la misma `mutate`. Es importante saber que las callbacks en `useMutation` se ejecutan **antes** que las de `mutate`. Además, puede que las callbacks en `mutate` no se ejecuten si el componente se desmonta antes de que la mutación haya terminado.

Por eso pienso que es una buena práctica separar responsabilidades en tus callbacks:

- Haz las cosas que sean absolutamente necesarias y relacionadas con la lógica (como invalidar solicitudes) en las callbacks de `useMutation`.
- Haz cosas relacioandas con la UI como redirecciones o mostrar notificaciones en las callbacks de `mutate`. Si el usuario se marcha de la pantalla actual antes de la que la mutación termine, estas no se llamarán.

Esta separación funciona todavía mejor cuando el `useMutation` viene de un hook personalizado, ya que esto mantendrá la lógica de solicitud en el hook, mientras las acciones de UI están en la UI. Esto también hace el hook más reutilizable, porque puede que la interacción con la UI varíe según el caso, pero la lógica de invalidación se mantenga constante:

```ts
const useUpdateTodo = () =>
  useMutation({
    mutationFn: updateTodo,
    // 🟢 invalidar la lista siempre
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos', 'list']
      })
    },
  })

// en el componente:
const updateTodo = useUpdateTodo()
updateTodo.mutate(
  { title: 'newTitle' },
  // 🟢 solo redirigir si seguimos en la página detalle
  // cuando la mutación termine
  { onSuccess: () => history.push('/todos') }
)
```
