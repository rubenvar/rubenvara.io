---
title: "Consejos prácticos sobre React Query"
seoTitle: "8 Consejos Prácticos sobre React Query: Más Allá de los Docs"
description: "Primer post de la serie: Consejos para dominar React Query, aplicando ideas prácticas que extienden los docs de esta librería"
date: 2022-09-26
status: published
original:
  title: Practical React Query
  url: https://tkdodo.eu/blog/practical-react-query
series:
  name: react-query-tkdodo
  index: 1
---

Cuando GraphQL y especialmente [Apollo Client](https://www.apollographql.com/docs/react/) empezaron a hacerse bastante populares, sobre 2018, se hablaba mucho acerca de si sustituirían completamente a Redux, y se oía mucho la típica pregunta de [¿Ha muerto Redux?](https://dev.to/markerikson/redux---not-dead-yet-1d9k).

Quizás podrías no entender muy bien de qué iba todo esto: ¿Por qué reemplazaría una libería de *obtención de datos* (data fetching) a todo el gestor de estado global de tu aplicación? ¿Qué tiene uno que ver con el otro?

Podrías pensar que los clientes de GraphQL (como Apollo) solo obtendrían la data por ti, como hace [axios](https://github.com/axios/axios) en REST, y que obviamente después seguirías necesitando alguna forma de hacer accesible toda esa data a tu aplicación.

No podrías estar más equivocado.

## Estado en el Cliente *vs* en el Servidor

Lo que ofrece Apollo no es solo la habilidad de describir la data que quieres y de obtenerla desde la API: también viene con un *caché* para esa data.

Esto significa que puedes usar el mismo *hook* `useQuery` en múltiples components de tu app, y Apollo solo habrá solicitado la data **una vez** y después la devolverá desde el **caché**.

Te sonará muy familiar si ya usabas Redux para eso: Obtener data desde el servidor y tenerla disponible en *todas partes*.

Si trabajabas así, ya estabas tratando tu *estado en el servidor* como cualquier otro *estado en el cliente*... Excepto que tu app no **posee** ni **controla** el *estado en el servidor* (por ejemplo una lista de Posts o los detalles de un Usuario). Solo lo toma prestado para mostrar la versión más reciente al visitante, pero el servidor es el verdadero dueño de esta data.

Si lo miras así, esto introduce un **punto de inflexión** en como piensas sobre la data: si podemos aprovechar el caché para mostrar información que la app no *posee*, no quedará ya una gran cantidad de *estado en el cliente* que tenga que estar disponible en toda la app, y podrás gestionarlo ya de forma nativa sin librerías externas. Por esta razon mucha gente piensa que Apollo puede **sustituir** a Redux.

## React Query

Quizás nunca hayas tenido la oportunidad de usar GraphQL. Si ya tienes una API REST, no sufres problemas de *over-fetching*, y todo funciona bien... No hay necesidad de cambiar, sobre todo porque también haría falta migrar gran parte de tu *backend*, lo que no es tan sencillo.

Pero puede que aun así envidies la posibilidad de obtener data de forma tan **simple** en el *frontend*, incluyendo la gestión de estados de carga y error. Si existiera en React algo como Apollo pero para APIs REST...

Y aquí es donde entra [React Query](https://tanstack.com/query/v4/).

Creado por el **genio** del *open source* [Tanner Linsley](https://github.com/tannerlinsley) a finales de 2019, React Query toma todas las cosas buenas de Apollo y las traslada a REST. Realmente acepta cualquier función que devuelva una promesa, y usa la estrategia de caché *stale-while-revalidate*

La librería usa unos ajustes predeterminados que intentan mantener tu data lo más **actualizada** posible y mostrarla al usuario lo antes posible, haciendo que a veces parezca **instantáneo**, para conseguir la mejor experiencia de uso. Además, tiene gran flexibilidad y puedes cambiar algunos ajustes cuando en funcionamiento normal no es suficiente para tu caso.

Aun así este artículo **no** va a ser una intro a React Query.

Los docs ya hacen un trabajo genial en sus Guides & Concepts, también hay [Videos & Talks](https://tanstack.com/query/v4/docs/videos), y Tanner tiene un curso ([Essentials Course](https://learn.tanstack.com/)) con todo lo esencial sobre React Query. Suficiente para familiarizarte con esta librería.

## Consejos prácticos para usar React Query

En su lugar nos centraremos en algunos consejos prácticos, más allá de los docs, que te serán útiles si ya estás usando React Query. Ideas que el autor ha ido recogiendo a lo largo del tiempo usando esta librería en su tiempo libre, respondiendo preguntas en Discord o en GitHub Discussions.

### Los ajustes predeterminados

Los [Defaults](https://tanstack.com/query/v4/docs/guides/important-defaults) (ajustes predeterminados) de React Query están muy bien escogidos, pero sobre todo al principio pueden pillarte desprevenido.

**Primero**: React Query **no** invoca tu `queryFn` en cada re-renderizado de React, incluso con un `staleTime` de `0`. Tu app puede re-renderizar por muchas razones y en cualquier momento, así que solicitar tu data cada vez sería una locura.

> Programa siempre esperando re-renderizados, muchos. Yo lo llamo "render-resiliency".
>
> – Tanner Linsley

Si ves una re-solicitud (*refetch*) cuando no la esperabas, es probable que sea porque has vuelto a enfocar la ventana de tu app y React Query ha ejecutado su `refetchOnWindowFocus`, que es genial en *producción*:

Si el usuario va a otra pestaña y después vuelve a tu aplicación, automáticamente se lanzará una re-solicitud de fondo, y la data en la página se actualizará si algo ha cambiado en el servidor mientras tanto. Todo esto pasa sin que tenga que aparecer un "cargando" en tu página, y el componente no re-renderizará si la data es igual a la que ya tenías en caché.

En *desarrollo* esto se activará más a menudo, especialmente porque cambiar entre las Herramientas de Desarrollador (DevTools) y la página también lanzará una solicitud, así que tenlo en cuenta o desactívalo si esto supone un problema.

**Segundo**: parece que existe cierta confusión entre `cacheTime` y `staleTime`, esta es la diferencia:

- `staleTime`: El tiempo hasta que una *solicitud* (`query`) pasa de *activa* (`fresh`) a *obsoleta* (`stale`). Mientras la query siga activa, la data se leerá solo desde el caché, sin solicitudes a la red. Si la query está obsoleta (de forma predeterminada esto ocurre al instante), tomarás la data del caché, pero en el fondo se lanzará una re-solicitud de data [bajo ciertas condiciones](https://tanstack.com/query/v4/docs/guides/caching).
- `cacheTime`: El tiempo hasta que una solicitud *inactiva* se elimine del caché. El predeterminado es 5 minutos. Una solicitud pasa a ser inactiva cuando todos los componentes que la usan son desmontados.

Si necesitas cambiar uno de estos ajustes, casi siempre será `staleTime` para solicitar data del backend menos a menudo y usar más tiempo la del caché. Casi nunca necesitarás cambiar `cacheTime`.

### Usa React Query DevTools (Herramientas Dev propias)

Te ayudarán **muchísimo** a entender el estado en el que está una solicitud. Las *DevTools* también te mostrarán qué data está actualmente en caché, así que te será más fácil buscar errores. Además puedes usarlo para reducir tu conexión de red y detectar así re-solicitudes de fondo.

### Trata la `query key` como un array de dependencias

Por supuesto me refiero al array de dependencias del [Hook de efecto (`useEffect`)](https://es.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect), que ya conocerás si usas React.

¿Por qué son similares?

Porque React Query lanzará una re-solicitud cada vez que el array `query key` cambie. Cuando pasamos un parámetro variable a nuestra `queryFn`, casi siempre queremos solicitar data si ese valor cambia.

En lugar de intentar crear efectos complejos para lanzar una solicitud manualmente, podemos usar el array `query key`:

```ts
// tipos
type State = 'all' | 'open' | 'done';
type Todo = {
  id: number;
  state: State;
};
type Todos = ReadonlyArray<Todo>;

// query fn
const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await axios.get(`todos/${state}`);
  return response.data;
}

// hook custom, donde pasamos "state" dentro del "query key"
export const useTodosQuery = (state: State) =>
  useQuery(['todos', state], () => fetchTodos(state));
```

Imagina que nuestra interfaz muestra una lista de *ToDo*s con opción de filtrado.

Tendremos un estado local para almacenar ese filtrado: En cuanto el usuario cambie su selección actualizaremos ese estado, y React Query lanzará una solicitud automáticamente, porque el array `query key` ha cambiado.

Así, mantenemos la selección del usuario *sincronizada* con la solicitud, lo que es muy similar al array de dependencias de `useEffect`. Normalmente siempre que pases una variable a tu `queryFn` también querrás incluirla en tu `query key`.

#### Nueva entrada en el caché

Como la `query key` también es usada como una *clave* en el caché, tendrás una nueva entrada en el caché cuando cambies de "all" a "done" (en nuestro ejemplo previo), lo que conllevará una recarga cuando actives un filtro por primera vez.

Esto no es lo ideal, y puedes evitarlo usando la opción `keepPreviousData` o, cuando sea posible, pre-llenando el caché con [data inicial (initialData)](https://tanstack.com/query/v4/docs/guides/initial-query-data#initial-data-from-cache).

Según el ejemplo anterior, podemos hacer un pre-llenado de los *ToDo*s en el caché del cliente:

```ts
// tipos
type State = 'all' | 'open' | 'done'
type Todo = {
  id: number
  state: State
}
type Todos = ReadonlyArray<Todo>

// query fn
const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await axios.get(`todos/${state}`)
  return response.data
}

// hook custom, donde pasamos "state" dentro del "query key"
export const useTodosQuery = (state: State) =>
  useQuery(['todos', state], () => fetchTodos(state), {
    // pre-escribir la data inicial:
    initialData: () => {
      const allTodos = queryClient.getQueryData<Todos>(['todos', 'all'])
      const filteredData =
        allTodos?.filter((todo) => todo.state === state) ?? []

      return filteredData.length > 0 ? filteredData : undefined
    },
  })
```

Ahora cada vez que el usuario cambia entre estados, si no tenemos data todavía para su selección, intentamos pre-llenarlo con data del caché "all", que filtramos manualmente. Mientras tanto se ejecuta la solicitud en el fondo y el usuario verá la lista **actualizada** una vez que obtengamos la data.

Una gran mejora de la experiencia del usuario por un par de líneas de código.

### Mantén separados el estado del servidor y del cliente

Si obtienes data de `useQuery`, no pongas esa data en tu estado local. La razón principal es que implícitamente estás **perdiendo** las actualizaciones de fondo que hace React Query, ya que la *copia* en el estado no se actualizará.

Esto estaría bien si solo quieres, por ejemplo, obtener unos valores predeterminados para un formulario, y mostrar el formulario cuando tengas la data. Las siguientes actualizaciones no obtendrían nueva data, y aunque lo hicieran, tu formulario ya ha sido inicializado.

Si vas a hacer esto conscientemente recuerda no lanzar re-solicitudes **innecesarias**, ajustando `staleTime`:

```jsx
const App = () => {
  // solicita la data y fija "staleTime" en infinito
  const { data } = useQuery('key', queryFn, { staleTime: Infinity })

// carga el formulario cuando hay data
  return data ? <MyForm initialData={data} /> : null
}

// pone la data en el estado local
const MyForm = ({ initialData} ) => {
  const [data, setData] = React.useState(initialData)
  // ...
}
```

Si también quieres que la data que muestras sea editable por el usuario, la cosa se vuelve más **compleja**. El autor ha preparado un *CodeSandbox* con un ejemplo que puedes estudiar:

<iframe
  src="https://codesandbox.io/embed/inspiring-mayer-rp3jx?fontsize=14&hidenavigation=1&theme=dark&view=preview"
  style="width:100%;height:600px;border:0;border-radius:9px;overflow:hidden;margin-bottom:24px;"
  title="separate-server-and-client-state"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

La parte más importante de la demo es que el valor que recibimos de React Query no se pone nunca en el estado local. Así nos aseguramos de que siempre vemos la data más **reciente**, porque no hay una *copia* local.

### La opción `enabled` es muy potente

El hook `useQuery` tiene muchas opciones que puedes pasar para personalizar su comprtamiento, y `enabled` es una opción muy potente que te permite conseguir cosas como estas:

- [Dependent Queries](https://tanstack.com/query/v4/docs/guides/dependent-queries): Solicita data en una *query* y lanza una segunda *query* solo cuando hayas obtenido satisfactoriamente la data de la primera.
- Activa y desactiva solicitudes: Si tienes una *query* que solicita data regulamente con `refetchInterval`, puedes pararla temporalmente por ejemplo cuando se abra un *popup* para evitar actualizaciones en la pantalla de fondo.
- Espera input del usuario: Si tienes criterios de filtrado en tu `query key`, puedes desactivar la solicitud hasta que el usuario aplique un filtro.
- O desactiva una query tras input del usuario: Puedes desactivar una query si quieres mostrar data local en lugar de data del servidor según el input del usuario, como en el ejemplo del apartado anterior.

### No uses el `queryCache` como un gestor de estado local

Si manipulas el `queryCache` (con `queryClient.setQueryCache`), debería ser solo para *actualizaciones optimistas* (optimistic updates), o para escribir data que recibas del backend tras una *mutación*.

Recuerda que cada re-solicitud de fondo puede sobreescribir esa data, así que [usa](https://reactjs.org/docs/hooks-state.html) [otra](https://zustand.surge.sh/) [cosa](https://redux.js.org/) para el estado local.

### Crea *hooks* personalizados

Aunque solo necesites *envolver* una llamada a `useQuery`, crear un *hook* personalizado merece la pena:

- Mantienes la solicitud de data **fuera** de la intefaz, pero **cerca** de donde la llamarás.
- Puedes mantener todos los usos de una `query key` (y sus definiciones de tipos) en un solo archivo.
- Si necesitas cambiar ajustar o añadir transformaciones de data, puedes hacerlo en un solo sitio.

Ya hahemos visto un ejemplo de esto más arriba.

---

Espero que estos consejos te animen a usar React Query o te ayuden a entenderlo mejor, cuéntame si te surgen dudas.
