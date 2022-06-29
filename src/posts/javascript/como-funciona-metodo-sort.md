---
title: "Entiende el (inestable) método sort(): consigue resultados consistentes en todos los navegadores"
seoTitle: "Entiende el (Inestable) Método sort(): Consigue Resultados Consistentes en Todos los Navegadores"
description: "Con algunos casos lógicos y otros menos previsibles, el método sort() puede amargarte el día: cómo obtener resultados consistentes en Chrome y Firefox"
date: 2022-06-05
status: published
---

Según [la documentación del método `sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) en MDN:

> The time and space complexity of the sort cannot be guaranteed as it depends on the implementation.

O en [su versión en español](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort):

> La ordenación no es necesariamente estable.

Empezamos bien...

---

Según mi experiencia (y mi opinión), vamos a partir de la siguiente premisa:

> El método sort() es inestable y cada navegador devuelve lo que buenamente puede, así que sigue las normas y cruza los dedos.

Para intentar enteder lo que pasa, y cómo paliarlo cuando uses este método en tu web/app, vamos a analizar cada caso.

- Vamos a probar un *array* que contenga solo números, y otros con números, strings, o `undefined`s.
- Vamos a comparar los resultados entre Firefox (~100) y Chrome (~100).
- Después plantearemos la mejor solución posible.

Recuerda que `sort()` muta el *array* sobre el que trabaja, así que haremos una copia del array en cada caso.

## Si no aportas una función

Este caso está documentado y los resultados son estables tanto en Firefox como en Chrome:

```js
const arr = [0, 42, 23893787, 234.3, 85, 1242e3];

const sorted = [...arr].sort();

// Firefox: [0, 1242000, 234.3, 23893787, 42, 85]
// Chrome:  [0, 1242000, 234.3, 23893787, 42, 85]
```

Si no se provee una función a `sort()`, los elementos se convierten a strings y se ordenan según su valor UTF-16 **de menor a mayor**.

Así, `234.3` aparece antes que `42`, ya que `"2"` es menor que `"4"`.

Si incluimos strings y `undefined`s en el *array*, el ordenamiento sigue siendo *lógico* y documentado. Los elementos `undefined` se quedan al final:

```js
const arr = [ 0, '?', 42, undefined, 23893787, 234.3, 85, 'a', 1242e3];

const sorted = [...arr].sort();

// Firefox: [0, 1242000, 234.3, 23893787, 42, 85, "?", "a", undefined]
// Chrome:  [0, 1242000, 234.3, 23893787, 42, 85, "?", "a", undefined]
```

### Para ordenar palabras

Esto te será útil si, por ejemplo, vas a ordenar una lista de palabras:

```js
const arr = ['empieza', 'ciudado', 'zapatilla', 'menú'];

const wordsSorted = [...arr].sort();

// Firefox: ["ciudado", "empieza", "menú", "zapatilla"]
// Chrome:  ["ciudado", "empieza", "menú", "zapatilla"]
```

Eso sí, recuerda que `"E"` es un carácter diferente de `"e"` en UTF-16, así que los resultados no serán los que esperas si mezclas mayúsculas y minúsculas:

```js
const arr = ['empieza', 'Molusco', 'Elemento', 'menú', 'Salvaje'];

const wordsSorted = [...arr].sort();

// Firefox: ["Elemento", "Molusco", "Salvaje", "empieza", "menú"]
// Chrome:  ["Elemento", "Molusco", "Salvaje", "empieza", "menú"]

// 🤷‍♂️
```

## Si provees una función, atención

Si el *array* incluye números, fechas, diferentes caracteres, etc., y necesitas más control, aporta una función al método.

Según la documentación, esta función recibe dos elementos (`a` y `b`) que son dos elementos *cualquiera* del *array* (recuerda: no confíes en el orden con el que representas tú el *array*, puede no ser estable) y tienes que retornar, idealmente, un **número**.

Vamos a ver las diferentes opciones y combinaciones.

## Si tu función retorna un *boolean*

Algunos tutoriales te mostrarán una función que compara los dos valores y retorna `true` o `false`:

**Cuidado con esto**, los resultados son distintos en cada navegador:

```js
const arr = [ 0, 42, 23893787, 234.3, 85, 1242e3];

const booleanSorted = [...arr].sort((a, b) => a > b);

// Firefox: [0, 42, 85, 234.3, 1242000, 23893787]
// Chrome:  [0, 42, 23893787, 234.3, 85, 1242000]
```

- Firefox ordena el *array* correctamente.
- Chrome te lo devuelve como se lo has dado, sin tocarlo 🤷‍♂️.

### Si el *array* tiene strings

La cosa se complica, y aquí vuelve a haber inconsistencias:

Si tu función comparadora devuelve un *boolean* pero el *array* tiene strings:

```js
const arr = [ 0, '?', 42, undefined, 23893787, 234.3, 85, 'a', 1242e3];

const booleanSorted = [...arr].sort((a, b) => a > b);

// Firefox: [0, "?", 42, 85, 234.3, 23893787, "a", 1242000, undefined]
// Chrome:  [0, "?", 42, 23893787, 234.3, 85, "a", 1242000, undefined]
```

- Firefox lo intenta, pero cuando le toca comparar número con string, lo deja sin tocar y el resultado no es muy *útil*.
- Chrome lo sigue dejando todo como estaba, sin tocarlo.

Ambos navegadores mandan los `undefined` al final.

## Si tu función devuelve un número

Idealmente, cuando la función compara `a` con `b`, sigue la siguiente idea:

- Si retornas `> 0`, `a` va después de `b`.
- Si retornas `< 0`, `a` va antes de `b`.
- Si retornas `0`, mantiene el orden.

Así que implementamos esto y conseguimos los resultados esperados (si queremos ordenar de menor a mayor):

```js
const arr = [ 0, 42, 23893787, 234.3, 85, 1242e3];

function sortCallback(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

const functionSorted = [...arr].sort(sortCallback);

// Firefox: [0, 42, 85, 234.3, 1242000, 23893787]
// Chrome:  [0, 42, 85, 234.3, 1242000, 23893787]
```

Puedes reescribir esto más resumido, obviando el retorno `0`, y todo sigue funcionando perfectamente:

```js
const functionSorted = [...arr].sort((a, b) => a > b ? 1 : -1);
```

Esto funciona a la perfección y con consistencia cuando tu array tiene **solo números** o **solo strings**.

### Si tienes un *array* de solo strings

Si quieres ordenar un listado de palabras, esta función funciona exactamente como si dejaras vacío el método `sort()`:

```js
const arr = ['empieza', 'Molusco', 'Elemento', 'menú', 'Salvaje'];

const wordsFunctionSorted = [...arr].sort((a, b) => a > b ? 1 : -1);

// Firefox: ["Elemento", "Molusco", "Salvaje", "empieza", "menú"]
// Chrome:  ["Elemento", "Molusco", "Salvaje", "empieza", "menú"]
```

Funciona como esperarías.

### Si el *array* contiene números y strings

Aquí es donde la cosa se vuelve lo más inconsistente posible.

Vamos a ver la comparación entre usar una función que solo devuelva `1` o `-1` (el modo *resumido* que acabo de enseñarte) y la que devuelve `1`, `-1` o `0`, en los dos navegadores:

```js
const arr = [ 0, '?', 42, undefined, 23893787, 234.3, 85, 'a', 1242e3];

const functionSorted = [...arr].sort(sortCallback);
const returnSorted = [...arr].sort((a, b) => a > b ? 1 : -1);

// Firefox  functionSorted  [0, "?", 42, 85, 234.3, 23893787, "a", 1242000, undefined]
// Firefox  returnSorted    [0, "?", 42, 85, 234.3, 23893787, "a", 1242000, undefined]

// Chrome   functionSorted  [0, "?", 42, 85, 234.3, 1242000, 23893787, "a", undefined]
// Chrome   returnSorted    ["a", 42, 85, 234.3, 1242000, 23893787, "?", 0, undefined]
```

Te dejo que saques tus propias conclusiones de esta.

### Restar los valores en la función

La última y acabamos, te lo prometo.

Si tienes un *array* con **solo números**, puedes resumir todo lo que hemos visto y **restarlos**. Esto también funciona muy bien y queda muy limpio:

```js
const arr = [ 0, 42, 23893787, 234.3, 85, 1242e3];

const subtractSorted = [...arr].sort((a, b) => a - b);

// Firefox: [0, 42, 85, 234.3, 1242000, 23893787]
// Chrome:  [0, 42, 85, 234.3, 1242000, 23893787]
```

Si es un *array* con **solo strings**, ambos navegadores te devuelven tu *array* sin tocarlo 😕:

```js
const arr = ['empieza', 'Molusco', 'Elemento', 'menú', 'Salvaje'];

const subtractSorted = [...arr].sort((a, b) => a - b);

// Firefox: ["empieza", "Molusco", "Elemento", "menú", "Salvaje"]
// Chrome:  ["empieza", "Molusco", "Elemento", "menú", "Salvaje"]
```

Los problemas vuelven si mezclas números y strings:

```js
const arr = [ 0, '?', 42, undefined, 23893787, 234.3, 85, 'a', 1242e3];

const subtractSorted = [...arr].sort((a, b) => a - b);

// Firefox: [0, "?", 42, 85, 234.3, 23893787, "a", 1242000, undefined]
// Chrome:  [0, "?", 42, 85, 234.3, 1242000, 23893787, "a", undefined]
```

### Una curiosidad: invertir el *array*

Si utilizas una función en el método `sort()`, con un *array* de solo números, y tu función retorna directamente un número positivo...

```js
const arr = [ 0, 42, 23893787, 234.3, 85, 1242e3];

const reverseSorted = [...arr].sort(() => 1);

// Firefox: [1242000, 85, 234.3, 23893787, 42, 0]
// Chrome:  [0, 42, 23893787, 234.3, 85, 1242000]
```

- Firefox invierte el array.
- Pero Chrome te lo devuelve sin tocarlo (¿?).

Esto ocurre tanto con *arrays* de solo números, solo strings, o mezclados.

Así que mejor use el método `reverse()` para invertir *arrays*.

---

## Conclusiones

Tras darle todas estas vueltas a la materia, estas son las conclusiones que saco (y como suelo trabajar) para evitar problemas, malentendidos, o errores según el navegador:

- Provee una **función** para comparar cualquier cosa.
- Provee una función que devuelva un **número**.
- Si solo trabajarás con números, puedes retornar la **resta** de los mismos y listo.
- Para mayor **consistencia** y seguridad, provee una función que tenga en cuenta los casos "mayor que", "menor que", e "igual a".

Además:

- Si vas a ordenar solo **palabras**, ten en cuenta mayúsculas/minúsculas.
- En la medida de lo posible, evita ordenar *arrays* que tengan números y strings **mezclados**. Si tienes un *array* así, seguramente querrás convertir todos los números a strings y ordenar después.
- Para simplemente **invertir** el orden del *array*, usa el método `reverse()`.
