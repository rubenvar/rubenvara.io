---
title: Definir una propiedad de un objeto según otras props del mismo, en TypeScript
seoTitle: Cómo Definir una Propiedad de un Objeto según otras Propiedades del Mismo Objeto, en TypeScript
description: "Definiendo un objeto en TypeScript: Una propiedad podría tener varios valores, y según estos queremos definir otras propiedades del mismo objeto"
date: 2022-05-17
status: published
---

Hace poco me encontré con una situación similar a esta intentando a implementar un `useReducer`, aunque [eso es otra historia](/react/como-usar-usereducer).

Vamos a tener una `action`. Esta `action` es un objeto, con la propiedad `type`.

Inicialmente podríamos definir así el tipo para esta `action`:

```ts
type Action = {
  type: 'init' | 'change' | 'reset';
}
```

La idea es que, según un posible `input` externo (clic en botón, cambio en tamaño de la pantalla, etc.) se despachará esta acción que será recibida por una función.

Esta función comprueba qué ha recibido y devuelve o calcula algo en consecuencia.

La función sería algo como esto:

```ts
function reducer(action: Action) {
  if (action.type === 'init') {
    // hacer algo
  }
  if (action.type === 'change') {
    // hacer otra cosa
  }
}
```

Todo bien hasta aquí.

Ahora, la cosa es algo más compleja:

Si `action.type === 'change`, la `action` llevará *siempre* una segunda propiedad, `payload`. Esta propiedad contiene datos sobre el `change` en cuestión.

El tipo de `payload` sería algo así:

```ts
type Payload = 'view-grid' | 'view-list' | 'view-map';
```

Así que ahora queremos definir el tipo de `action` correctamente.

## El problema

¿Cómo lo hacemos?

### Lo primero que se me ocurre

La idea inicial es agregar payload al tipo `Action`:

```ts
type Action = {
  type: 'init' | 'change' | 'reset';
  payload?: Payload;
}
```

Pero tendremos problemas en la función `reducer()`:

```ts
function reducer(action: Action) {
  if (action.type === 'init') {
    // hacer algo
  }
  if (action.type === 'change') {
    return action.payload;
    // problemas porque `action.payload` puede no existir...
  }
}
```

Podríamos comprobar si existe la propiedad `payload`, pero la idea es definir *perfectamente* el tipo `Action`, sin hacer chapuzas.

## Vale. ¿Qué queremos conseguir?

Lo que queremos es **exactamente** esto:

> **Solo** si `type === 'change'`, la función `reducer` debería **saber** que existe una propiedad `payload`.

Así que mi pregunta para los dioses de TypeScript sería algo como lo siguiente:

> ¿Hay alguna forma de crear un tipo *condicionalmente*? Solo si `Action['type'] === 'change'`, existirá una segunda propiedad `payload`. Sino, no.

Después de muchas vueltas por Internet, no he conseguido encontrar una solución que funcione *exactamente* así.

Así que esta es la forma que encontré para hacerlo funcionar como quiero:

## La solución

Al final opté por definir el tipo para `action` como un *conjunto*:

```ts
type Action =
  | {
    type: 'init';
  }
  | {
    type: 'change';
    payload: Payload;
  }
  | {
    type: 'reset';
  };
```

Ahora dentro de la anterior función `reducer(action: Action)`, cuando estamos dentro del bloque `if (action.type === 'change') { ... }`, TS sabe que existe la propiedad `payload`, pero no en los otros bloques `if`.

---

¿Conoces una forma más elegante, sencilla o funcional de conseguir esto? Me encantaría escucharla, por favor.
