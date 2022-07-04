---
title: Cómo contar valores duplicados en un array en JavaScript
seoTitle: Cómo Contar Valores Duplicados y Ordenarlos en un Array en JavaScript
date: 2020-10-05
updated: 2022-06-12
description: "Un método rápido para contar valores repetidos en un array de cadenas o números con JavaScript, ordenarlos, y definirlo bien en TypeScript"
status: published
---

Otra de esas cosas que he tenido que consultar un millón de veces y copiar un *snippet* de <span class="emphasis emphasis-js">JavaScript</span> desde [SO](https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript) o algún blog.

Lo publico por aquí para que al menos no tenga que seguir buscándolo, y quizás te ayude.

## Contar cuántas veces se repite un valor

Hay muchas formas, algunas más eficientes y otras más **simples**. Si tienes un array con *millones* de valores quizás te interese encontrar otro sistema, pero yo lo suelo hacer así:

Si tenemos un *array* con valores que se repiten (o no):

```js
const arrayWithRepetition =
  ['a', 'a', 'z', 't', 'm', 'm', 'm', 'm', 't', 'a', 'm', 'm', 'a', 'm' ];
```

Creamos un objeto que alojará nuestro resultado, y después recorremos el array con un **loop**:

- Si el valor evaluado existe entre las propiedades del objeto, sumamos `+1` a su valor actual.
- Si no existe, creamos la propiedad con valor `0` y le sumamos `+1`.

```js
const result = {};

arrayWithRepetition.forEach((value) => {
  result[value] = (result[value] || 0) + 1;
});

// result:
// { a: 4, z: 1, t: 2, m: 7 }
```

Sencillo, en un par de lineas está solucionado.

También podrías usar el método de JavaScript `reduce()`, por ejemplo.

---

Según dónde vayas a usar este sistema, quizás te interese tener el resultado **ordenado**. Vamos a ver cómo podemos hacer esto también:

## Ordenar el resultado al contar repetición

- Ordenar los resultados **alfabéticamente** es más sencillo, ya que lo podemos hacer en el propio array antes de contar.
- Para ordenar por la **cantidad** de repeticiones la cosa se vuelve [más compleja](https://www.geeksforgeeks.org/counting-sort/). Tendremos que hacer más de un loop u otros inventos.

Vamos a ver cómo hacer ambas cosas:

### Orden alfabético

Simplemente ordenamos el array como queramos antes de contar. Como el *loop* del método `forEach()` [recorre el array en orden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), irá añadiendo los valores al objeto resultado en el mismo orden que los hayas colocado:

```js
const arrayWithRepetition =
  ['a', 'a', 'z', 't', 'm', 'm', 'm', 'm', 't', 'a', 'm', 'm', 'a', 'm' ];

const result = {};

arrayWithRepetition
  .sort() // orden alfabético a⟶z
  .forEach((value) => {
    result[value] = (result[value] || 0) + 1;
  });

// result:
// { a: 4, m: 7, t: 2, z: 1 }
```

Como ya vimos al [analizar el método `sort()` de JavaScript](/javascript/como-funciona-metodo-sort/), esto funcionará mejor si tienes un array de solo *strings* o solo números.

Y recuerda que el método `sort()` **muta** el array, así que si necesitas usar el original después, haz una copia antes de ordenar:

```js
// ...

// una forma sencilla de copiar un array simple:
[...arrayWithRepetition]
  .sort()
  // ...
```

### Ordenar por repetición

Para contar la repetición de elementos en un array, y conseguir el resultado ordenado por esa cantidad, todo con JS, la cosa es algo más compleja, como te decía.

Así es como yo lo haría:

```js
// contendrá el resultado de contar
const result = {};

// contamos como ya hemos visto
arrayWithRepetition.forEach((value) => {
  result[value] = (result[value] || 0) + 1;
});

// contendrá el resultado de ordenar
const sorted = {};

// tomamos las propiedades de `result`
Object.keys(result)
  .sort((a, b) => result[a] - result[b]) // ordenamos por valor en `result`
  .forEach((key) => sorted[key] = result[key]); // almacenamos en `sorted`

// sorted:
// {z: 1, t: 2, a: 4, m: 7 }
```

O usando JavaScript del futuro ([ES10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)):

```js
// ...

// hacemos magia:
const sorted = Object.fromEntries(
  Object.entries(result).sort(([, a], [, b]) => a - b)
);
```

De una u otra manera, el objeto `sorted` tendrá ahora las propiedades ordenadas de menor a mayor valor de repetición.

---

## ¿Programando en TypeScript? Tendrás problemas, como siempre

Como siempre si usas TypeScript, tendrás que definir las cosas un poco mejor:

![problemas](/posts/repetition-problemas.png)

Básicamente, TS no sabe qué tipo tiene el objeto `result` y deduce `{}`, así que cuando intentas asignar valores en el loop con `forEach()`, te dice que no se puede.

La solución: asignar un tipo a `result` cuando lo defines.

Yo lo hago de forma bastante *genérica*:

```ts
const result: {[key: string]: number} = {};

// ...
```

Le decimos a TS que `result` será un objeto con `string`s como propiedad y `number` como valores.

Idealmente lo definirías con todos los posibles valores que va a tener `result` como propiedad, tomándolos de los valores de `arrayWithRepetition`.

---

Espero que todo esto te sirva de ayuda, como siempre si tienes una forma mejor de hacerlo estoy encantado de aprender y mejorar, cuéntame!
