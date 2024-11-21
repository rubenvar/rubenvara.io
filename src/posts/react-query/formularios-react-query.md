---
title: Formularios en React Query
seoTitle: "Formularios en React Query: Cómo Gestionar Estados y Sincronizar Cambios"
description: "Los formularios tienden a mezclar estado de servidor y cliente: Cómo integrar React Query con un form"
date: 2023-04-11
status: published
original:
  title: React Query and Forms
  url: https://tkdodo.eu/blog/react-query-and-forms
series:
  name: react-query-tkdodo
  index: 14
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

<Box>

**Aviso**: El autor utiliza [react-hook-form](https://react-hook-form.com/) durante todo este artículo porque es una librería ideal para este caso, pero eso no significa que los patrones mostrados solo funcionen con react-hook-form: Los conceptos son aplicables a cualquier librería de formularios, y también si no usas ninguna librería.

</Box>

Los formularios son una parte importante de muchas aplicaciones web como sistema para actualizar data. Usamos React Query no solo para obtener data ([consultas](/react-query/react-query-gestor-estado)), sino también para modificarla ([mutaciones](/react-query/mutaciones-react-query)), así que necesitamos integrar nuestro querido gestor de estados con los formularios.

La buena noticia es que, en realidad, no hay nada especial acerca de los formualrios: son un montón de elementos html que se renderizan para mostrar datos. Aun así, como también queremos **modificar** esa data, la separación entre estado del Servidor y estado del Cliente empieza a difuminarse un poco, y aquí es donde puede venir la complejidad.

## Estado del Servidor vs Estado del Cliente

Como repaso, **Estado del Servidor** es un estado que no poseemos, que es mayormente asíncrono, y del que solo vemos una *captura* de cómo era la data la última vez que la obtuvimos.

**Estado del Cliente** es un estado del que el frontend tiene control total, mayormente síncrono, y del que conocemos de forma precisa los valores.

Cuando mostramos una lista de Personas, esto es sin duda Estado del Servidor. Pero ¿qué pasa si clicamos en una Persona para mostrar sus detalles en un formulario, con la inteción de quizás actualizar algunos valores? ¿Se convierte ese Estado del Sevidor en Estado del Cliente? ¿Es un híbrido?

## El enfoque sencillo

Ya hemos hablado de que no es muy buena idea copiar estado de un gestor a otro, ya sea copiar *props* de componente al estado, o copiar desde [React Query a estado local](/react-query/consejos-practicos-react-query).

Quizás los formularios puedan ser una excepción a esta regla, si lo haces deliberadamente y conoces los posibles pros y contras (y todo tiene sus pros y contras después de todo). Cuando cargamos nuestro fomulario de Persona, seguramente queremos tratar el Estado del Servidor solamente como *data inicial*. Obtenemos el `firstName` y `lastName`, los ponemos en el estado del formualrio, y luego dejamos al usuario que los actualice.

Veamos un ejemplo:

```jsx
function PersonDetail({ id }) {
  const { data } = useQuery({
    queryKey: ["person", id],
    queryFn: () => fetchPerson(id),
  });
  const { register, handleSubmit } = useForm();
  const { mutate } = useMutation({
    mutationFn: (values) => updatePerson(values),
  });

  if (data) {
    return (
      <form onSubmit={handleSubmit(mutate)}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input {...register("firstName")} defaultValue={data.firstName} />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input {...register("lastName")} defaultValue={data.lastName} />
        </div>
        <input type="submit" />
      </form>
    );
  }

  return "loading...";
}
```

Esto funciona increíblemente bien... Así que, ¿cuáles son esos pros y contras?

### La data puede ser `undefined`

Quizás sepas que `useForm` también acepta `defaultValues` directamente para todo el formulario, lo que estaría muy bien para formularios más grandes. Aun así, como no podemos llamar a un hook condicionalmente, y como nuestra `data` es `undefined` en el primer ciclo de renderizado (porque primero necesitamos obtenerla), no podemos simplemente hacer esto en el mismo componente:

```js
const { data } = useQuery({
  queryKey: ["person", id],
  queryFn: () => fetchPerson(id),
});
// 🚨 esto inicializará el formulario con undefined
const { register, handleSubmit } = useForm({ defaultValues: data });
```

Tendríamos el mismo problema al copiar a `useState`, o usando formularios controlados (lo que hace `react-hook-form` por debajo). La mejor solución para esto sería separar el formulario a su propio componente:

```jsx
function PersonDetail({ id }) {
  const { data } = useQuery({
    queryKey: ["person", id],
    queryFn: () => fetchPerson(id),
  });
  const { mutate } = useMutation({
    mutationFn: (values) => updatePerson(values),
  });

  if (data) {
    return <PersonForm person={data} onSubmit={mutate} />;
  }

  return "loading...";
}

// el componente
function PersonForm({ person, onSubmit }) {
  const { register, handleSubmit } = useForm({ defaultValues: person });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input {...register("firstName")} />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input {...register("lastName")} />
      </div>
      <input type="submit" />
    </form>
  );
}
```

Esto tampoco está mal, ya que separa la obtención de data de su presentación. No es lo que más le agrada al autor, pero cumple con lo necesario.

### Sin actualizaciones en segundo plano

React Query se centra en mantener tu UI sincronizada con el Estado del Servidor. En cuanto copiamos ese estado a otro sitio, React Query ya no puede hacer su trabajo. Si se ejecuta una recarga en segundo plano por alguna razón, y obtiene nueva data, nuestro formulario no se actualizará con ella.

Esto seguramente no sea un problema si somos los únicos trabajando con ese estado (como un formulario en nuestro perfil). En ese caso deberíamos al menos deshabilitar las actualizaciones en segundo plano poniendo un `staleTime` mayor en nuestra consulta. Después de todo, ¿para qué querríamos seguir mandando consultas al servidor si los cambios no se verán en pantalla?

```js
const { data } = useQuery({
  queryKey: ["person", id],
  queryFn: () => fetchPerson(id),
  // 🟢 sin actualizaciones en segundo plano
  staleTime: Infinity,
});
```

---

Este enfoque puede ser problemático en formularios más grandes y en entornos colaborativos. Cuanto mayor el formulario, más tiempo tardarán los usuarios en rellenarlo. Si varias personas trabajan en el mismo formulario, pero en distintos campos, quien actualice más tarde puede sobreescribir los valores que otros hayan cambiado, porque todavía veían una versión parcialmente desactualizada en su pantalla.

`react-hook-forms` ya nos permite detectar qué campos ha cambiado el usuario y solo mandar los campos *sucios* al servidor ([ejemplo](https://codesandbox.io/s/react-hook-form-submit-only-dirty-fields-ol5d2)), lo que está genial. Aun así, esto no muestra los últimos valores con cambios hechos por otros usuarios. ¿Quizás habrías cambiado tu input si hubieras sabido que alguien había modificado un campo concreto mientras tanto?

Así que, ¿Qué tenemos que hacer para mostrar las actualizaciones en segundo plano mientras editamos nuestros formulario?

## Conservar las actualizaciones en segundo plano

Un enfoque es separar rigurosamente los estados. Mantendremos el Estado del Servidor en React Query, y registraremos en el Estado del Cliente solo los cambios que el usuario ha hecho. La *fuente de verdad* que mostramos a los usuarios será entonces un estado **derivado** de esos dos: Si se ha modificado un campo, mostramos el Estado del Cliente. Sino, el Estado del Servidor:

```jsx
function PersonDetail({ id }) {
  const { data } = useQuery({
    queryKey: ["person", id],
    queryFn: () => fetchPerson(id),
  });
  const { control, handleSubmit } = useForm();
  const { mutate } = useMutation({
    mutationFn: (values) => updatePerson(values),
  });

  if (data) {
    return (
      <form onSubmit={handleSubmit(mutate)}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              // 🟢 estado derivado: valor del campo (cliente) + data (servidor)
              <input {...field} value={field.value ?? data.firstName} />
            )}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              // 🟢 estado derivado: valor del campo (cliente) + data (servidor)
              <input {...field} value={field.value ?? data.lastName} />
            )}
          />
        </div>
        <input type="submit" />
      </form>
    );
  }

  return "loading...";
}
```

Con este enfoque podemos mantener activas las actualizaciones en segundo plano, porque serán relevantes para los campos que no hayamos tocado. Ya no estamos atados al `initialState` que definimos al renderizar el formulario la primera vez. Como siempre, hay algunas cosas que tener en cuenta:

### Necesitas campos controlados

Hasta donde sé, no hay forma de conseguir esto con campos no controlados, por lo que el ejemplo anterior usa **campos controlados**.

<Box type="udapted">

**Actualizado**: React Hook Form tiene [una nueva API](https://www.react-hook-form.com/api/useform/#values) que reacciona a cambios y actualizaciones de los valores del formulario. Podemos usar esto en lugar de `defaultValues` para derivar nuestro estado desde el Estado del Servidor.

</Box>

### Derivar estado puede ser difícil

Este enfoque funciona bien para formulario planos, donde puedes tomar los valores del Estado del Servidor fácilmente usando coalescencia nula (??), pero sería más complicado para objetos anidados.

También puede ser una experiencia de usuario cuestionable cambiar valores del formulario de repente. Una mejor idea podría ser destacar los valores que están desincronizados con el Estado del Servidor, y dejar que el usuario decida qué quiere hacer.

---

Elijas el camino que elijas, intenta tener en cuenta las ventajas e inconvenientes de cada enfoque.

## Consejos y trucos

Aparte de estas dos maneras principales de montar tu formulario, aquí hay un par de ideas breves pero importantes para integrar React Query con formularios:

### Prevenir doble envío

Para evitar que un formulario se envíe dos veces, puedes usar el valor `isLoading` devuelto por `useMutation`, ya que será `true` mientras la mutación esté ejecutándose. Para deshabilitar el formulario, todo lo que necesitas es deshabilitar el botón principal:

```jsx
const { mutate, isLoading } = useMutation({
  mutationFn: (values) => updatePerson(values)
})
<input type="submit" disabled={isLoading} />
```

### Invalidar y resetear tras la mutación

Si no rediriges a una página diferente justo tras enviar el formulario, puede ser una buena idea resetear el formulario *después* de que la invalidación se haya completado. Como vimos en [Dominar las Mutaciones](/react-query/mutaciones-react-query), probablemente quieras hacer eso en la callback `onSuccess` de `mutate`. Esto funciona todavía mejor si mantenes el estado separado, ya que solo necesitas resetear a `undefined` para volver a tomar el Estado el Servidor:

```jsx
function PersonDetail({ id }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["person", id],
    queryFn: () => fetchPerson(id),
  });
  const { control, handleSubmit, reset } = useForm();
  const { mutate } = useMutation({
    mutationFn: updatePerson,
    // 🟢 devuelve una Promesa de la invalidación
    // para que se aguarde
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["person", id] }),
  });

  if (data) {
    return (
      <form
        onSubmit={handleSubmit((values) =>
          // 🟢 estado del cliente a undefined
          mutate(values, { onSuccess: () => reset() })
        )}
      >
        <div>
          <label htmlFor="firstName">First Name</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <input {...field} value={field.value ?? data.firstName} />
            )}
          />
        </div>
        <input type="submit" />
      </form>
    );
  }

  return "loading...";
}
```
