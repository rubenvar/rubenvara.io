---
title: Cómo eliminar valores duplicados en un array con JavaScript
seoTitle: 2 Métodos para Eliminar Valores Duplicados en un Array con JavaScript o TS
date: 2020-10-04
updated: 2022-05-24
description: Dos formas claras y sencillas para eliminar duplicados en un conjunto con JavaScript y devolver solo valores únicos, para primitivos y objetos
status: published
---

Lo mismo que a la hora de [contar duplicados en un array](/javascript/como-contar-duplicados-array-javascript/), siempre que quiero conseguir un *array* con valores únicos, eliminando los duplicados con JavaScript, tengo que buscar cómo hacerlo y acabar copiando de [SO](https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array).

## Cómo elimino duplicados de un array usando JS

Dejo aquí recogidas las dos formas que suelo usar y seguro que te sirven:

### 1. Usando un `Set`

Introducidos con ES6, [los objetos `Set`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set) almacenan valores únicos, tanto primitivos como objetos. Lo combinamos con un [`spread`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax) y tenemos una forma muy concisa y clara de eliminar duplicados de un array:

```js
const arrayWithRepetition =
  ['a', 'a', 'z', 't', 'm', 'm', 'm', 'm', 't', 'a', 'm', 'm', 'a', 'm' ];

const uniqueValues = [...new Set(arrayWithRepetition)];

// uniqueValues:
// [ 'a', 'z', 't', 'm' ]
```

Creamos un nuevo `Set` a partir del array con repeticiones, y esto **elimina los duplicados**. Luego lo expandimos en un array, y terminado.

El `Set` respetará el orden inicial de los elementos a medida que los *encuentra* en el array original. Si quieres otro orden, puedes reordenar tanto el original como el resultado.

### 2. Usando un array auxiliar

Básicamente mantenemos un array donde almacenamos los valores encontrados, y para cada valor comprobamos si ya lo hemos *visto* anteriormente. Si no está en el array *almacén*, lo metemos.

```js
const arrayWithRepetition =
  ['a', 'a', 'z', 't', 'm', 'm', 'm', 'm', 't', 'a', 'm', 'm', 'a', 'm' ];

function getUniqueValues(arr) {
  const existing = [];

  // si ya existía, retorna false y no incluye `value` en el resultado
  // sino, mete el valor en `existing`y retorna su índice (truthy)
  return arr.filter((value) =>
    existing.includes(value) ? false : existing.push(value)
  );
}

// getUniqueValues(arrayWithRepetition):
// [ 'a', 'z', 't', 'm' ]
```

Tiene sus defectos, seguramente tendrás problemas si los valores de tu array no son [primitivos](https://developer.mozilla.org/es/docs/Glossary/Primitive), pero funciona bien para lo demás.

#### Si programas con TypeScript

Si quieres usar este segundo sistema y programas en TypeScript, tendrás que definir los tipos de tu función `getUniqueValues()`, o TS se quejará:

![problemas](/posts/duplicates-problemas.png)

Excepto que quieras crear una función muy versátil y reutilizable en diferentes casos, puedes definir el tipo del array que pasarás, y con eso lo tienes todo solucionado:

```ts
// ...
function getUniqueValues(arr: string[]) {
  // como meterás valores únicos de `arr`, tiene el mismo tipo
  const existing: string[] = [];

  // si ya existía, retorna false y no incluye `value` en el resultado
  // sino, mete el valor en `existing`y retorna su índice (truthy)
  return arr.filter((value) =>
    existing.includes(value) ? false : existing.push(value)
  );
}
```

---

Hay probalemente decenas de métodos para conseguir un array con valores únicos usando JS.

Si tienes un array con *millones* de valores, seguramente te interese buscar el sistema más eficiente.

Ya sabes que estoy encantado de leer cómo lo haces tú, intento aprender cosas nuevas todos los días, así que cuéntame!
