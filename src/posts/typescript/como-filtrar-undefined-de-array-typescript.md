---
title: Cómo filtrar elementos `undefined` o `null` de un array en Typescript
seoTitle: Cómo Filtrar Elementos `undefined` o `null` de un array en Typescript
date: 2022-03-17
description: Cómo avisar (correctamente) a TypeScript de que un array ya no contiene elementos `undefined` tras filtrar con .filter()
status: published
---
<script>
  import Emphasis from '$lib/components/Emphasis.svelte'
</script>

Hace poco empecé a convertir un proyecto a TypeScript y así ir poco a poco **aprendiendo** este ~~lenguaje~~ *superset*. A menudo encuentro problemas que no sé cómo solucionar.

En este caso quiero filtrar un *array* de elementos para eliminar los `undefined` o `null` y poder seguir trabajando con la información.

Esto suelo hacerlo con `.filter()`, pero TypeScript parece que se *pierde* por el camino y no detecta correctamente el tipo del *array* devuelto. Tendremos que indicarle cómo seguir.

Me explico mucho mejor con un **ejemplo** muy sencillo:

## La base

Supongamos que tenemos una app donde listamos **vinos**. Todos los vinos tienen un nombre, origen y año. Algunos *pueden* tener una puntuación.

```ts
// Definimos el tipo Wine:
type Wine = {
  name: string;
  origin: string;
  year: number;
  rating?: number;
}
```

Ahora tenemos un *array* de vinos, que corresponden al tipo definido:

```ts
const wines: Wine[] = [
  {
    name: "Cune",
    origin: "Rioja",
    year: 2020,
  },
  {
    name: "Marqués del Pino Futuro",
    origin: "León",
    year: 2019,
    rating: 4.3,
  },
  // ...
];
```

### Lo que sí funciona

Por alguna razón queremos tomar la puntuación del **primer** vino del *array*, y loguearlo si existe:

```ts
// aquí el tipo de firstRating es: `number | undefined`
const firstRating = wines[0].rating;

if (firstRating) {
  // aquí el tipo de firstRating es: `number`
  console.log(firstRating);
}
```

TypeScript es suficientemente **inteligente** como para saber que, dentro del apartado `if {}`, `firstRating` es de tipo `number` porque acabamos de comprobar que el elemento existe.

## El problema

Ahora bien, pasemos a un caso en el que TypeScript no es *tan inteligente*. Hace poco que empecé a aprender TS y por alguna razón pensaba que esto funcionaría igual que lo que acabo de enseñarte...

Supongamos que, por alguna razón, queremos conseguir un *array* con todas las puntaciones:

```ts
// el tipo de ratings aquí será `(number | undefined)[]`
const ratings = wines.map((wine) => wine.rating);

console.log(ratings); // [undefined, 4.3, ...]
```

Vale, pero solo queremos las puntuaciones que existen, no los `undefined`. Así que filtramos después del `.map()`:

```ts
// el tipo de ratings seguirá siendo `(number | undefined)[]` 😕
const ratings = wines
  .map((wine) => wine.rating)
  .filter((rating) => !!rating);
```

Ahora `ratings` es un *array* de números, sin `undefined`s... ¿no?

Tú lo sabes, pero TypeScript no: el tipo de `ratings` en este caso sigue siendo `(number | undefined)[]`.

Esto es un problema si vamos a seguir trabajando con el *array* `ratings`, así que mejor buscarle una solución.

## La (no tan buena) solución

Si vives en el presente y no te importa el futuro ni las consecuencias de tus actos en el <Emphasis>continuo espacio-temporal</Emphasis>, puedes usar *type assertion* (confirmación de tipos) y no volver a pensar en ello.

Quedaría algo como esto:

```ts
// el tipo de ratings será `number[]`, o lo que tú le mandes realmente... 😕
const ratings = wines
  .map((wine) => wine.rating)
  .filter((rating) => !!rating) as number[];
```

Conseguido, el tipo de `ratings` será `number[]`. Podría traerte problemas en el futuro, pero a quién le importa, ¿verdad?

Para quienes esto nos daría cargo de conciencia, te traigo la solución ideal:

## La solución buena

La forma óptima (por lo que he podido encontrar) para arreglar esta situación es usar [*user-defined type guards*](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

Basicamente, en la *callback* que usamos en `.filter()` avisamos a TypeScript de que devolveremos un tipo `number` si la *callback* devuelve `true`:

```ts
// el tipo de ratings será `number[]`, por fin!
const ratings = wines
  .map((wine) => wine.rating)
  .filter((rating): rating is number => !!rating);
```

Listo, lo conseguimos.

---

Esto es especialmente útil si vas a concatenar más métodos, como un `.sort()` o un `.reduce()`. Si el tipo que le llega a uno de esos métodos fuera `(number | undefined)[]`, tendrías problemas con TS. De esta manera, todo sigue en orden.

La primera vez que me encontré con esta situación [Ben Ilegbodu](https://www.benmvp.com/blog/filtering-undefined-elements-from-array-typescript/) me salvó la vida.

Por cierto, si tienes una forma mejor de solucionar esto, me encantaría escucharla. Como te digo, estoy aprendiendo.
