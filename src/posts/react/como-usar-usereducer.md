---
title: Cómo funciona useReducer() en React y cuándo usarlo
seoTitle: Cómo Funciona useReducer() en React y Cuándo Usarlo
description: Quizás programes en React durante años sin necesitar useReducer(). Mira para qué sirve y cómo usarlo si tu useState() se está volviendo demasiado complejo
date: 2022-05-13
status: published
---

Desde mi punto de vista, `useReducer` es una de esas cosas que no necesitas aprender para hacer un uso básico de React. [Así lo piensan ellos también](https://reactjs.org/docs/hooks-reference.html#additional-hooks).

Básicamente, es una alternativa a `useState`. Realmente no tenía ni idea de esto tras casi 4 años programando en React 🤷‍♂️.

Hace poco me hizo falta finalmente y decidí escribir sobre ello para intentar entenderlo más claramente.

Vamos con un ejemplo lo más claro posible, primero para ver si lo necesitas, y después para ver cómo usar `useReducer`.

## Un poco de *contexto*

Digamos que estamos controlando el estado (`state`) de un componente, que gestiona el aspecto de un listado.

Podríamos usar `useState` y olvidarnos:

```js
import { useState } from 'react';

// en este ejemplo `view` puede ser 'grid' o 'list'
const [view, setView] = useState('grid');

// alternar entre un valor o el otro
function toggle() {
  setView((currentView) => currentView === 'grid' ? 'list' : 'grid');
}

// usamos la función `toggle` en botones, etc.
```

De hecho **así lo hacía hasta ahora** (dentro de un `Context` para poder acceder a esto desde toda la app).

Pero he necesitado hacer la cosa un poco más *compleja* para integrar nuevas posibilidades:

- Ahora queremos que este estado dependa de múltiples factores, como vista en móvil o escritorio, valores desde `localStorage`, primera visita a la página o usuario registrado con preferencias sobre este ajuste, etc.

**Ahí es cuando deberías usar `useReducer`**: cuando la lógica de un estado es más completa e involucra múltiples sub-valores o el proximo valor depende del anterior

## Cómo usar `useRecuder()`

En su uso más sencillo, el *hook* `useReducer` acepta dos valores:

- Una función reductora (la llamaremos `reducer`) que definiremos. Tiene que retornar lo que quieras poner en el estado.
- Y el valor inicial del estado.

Y devuelve dos valores. En lugar de el estado y una función para cambiarlo, como `useState`, `useReducer` devuelve:

- El estado actual.
- Un método `dispatch`, que usarás para modificar el estado.

```js
// en lugar de:
const [view, setView] = useState('grid');

// haríamos (tras definir `reducer`):
const [view, dispatch] = useReducer(reducer, 'grid');
```

Veámoslo en el ejemplo anterior:

```jsx
import { useReducer } from 'react';

// el valor inicial separado, ya que lo usaremos en más de un sitio
const initialView = 'grid';

// función reductora. recibe:
// - el estado actual
// - la acción que le enviamos con `dispatch`
function reducer(state, action) {
  // aquí toda la lógica para controlar el estado según la `action` recibida
  switch (action.type) {
    case: 'reset':
      // hacer algo si hemos pasado `type: 'reset'` en `dispatch`
      return initialView;
    
    case: 'change':
      // calcular algo si `type` es 'change'
    
    // etc...
    
    default:
      return state;
  }
}

// ...

// ya dentro del componente
const [view, dispatch] = useReducer(reducer, initialView);

// más tarde lo usaríamos en el componente:
return {
  <p>La vista actual es: {view}</p>

  <button onClick={() => dispatch({ type: 'reset' })}>Reset vista</button>
}
```

Este es un ejemplo parcial y sencillo, pero seguro que te vale para hacerte una idea.

Si el estado en vez de un valor (`'grid' o 'list'` en el ejemplo) fuera un objeto con varias propiedades, y necesitaras varias formas de controlarlo, como te decía al inicio, empiezas a ver la necesidad de usar `useReducer`.

---

Si la cosa va a ser bastante más compleja o vas a estar en esta situación en varias ocasiones en tu app, quizás ya te interese echar un vistazo a [Redux](https://redux.js.org/)...
