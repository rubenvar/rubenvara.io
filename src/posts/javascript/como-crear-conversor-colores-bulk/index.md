---
title: Cómo crear un conversor de colores en bloque (bulk)
seoTitle: Cómo Convertir una Lista de Colores de HEX a HSL en bloque
date: 2020-04-05
updated: 2022-04-10
description: Convertir colores HEX a HSL(). Muchos a la vez. Y evitar que alguien lo rompa. Todo en vanilla javascript
status: published
---

<!-- <script>
import AlertBox from "../../components/md/AlertBox";
import Emphasis from "../../components/md/Emphasis";
</script> -->

La otra tarde estaba diseñando la paleta de colores para una nueva web. Me encontré que en el listado de tonos que iba a usar como partida, venían todos en HEX 🤷‍♂️

<!-- FOTO -->

<!-- <AlertBox type="success" title="Deberías usar HSL"> -->

Como ya deberías saber, es muchísimo más fácil [crear nuevas paletas de colores usando hsl](https://rubenvara.io), además del resto de ventajas de trabajar con este formato.

<!-- </AlertBox> -->

Así que decidí convertir el listado entero de hex a hsl.

Pero no conseguí encontrar un conversor online que lo hiciera con todo el listado a la vez. Tendría que ir de uno en uno, y tenía 50 colores.

Así que decidí crear un _bulk-converter_, un conversor en bloque:

GIF del conversor

<!-- Solo en html, css y <Emphasis use="js">vanilla javascript</Emphasis>. No podía ser muy complicado. -->

Bueno, al final en vez de en html directamente, lo escribí en [pug](https://pugjs.org/).

Y bueno, en vez de en css, lo hice con [scss](https://sass-lang.com/) pero solo por la comodidad de asegurar la especificidad, y porque me he acostumbrado a usar `styled-components` en React. Pero eso es otra historia.

El javascript sí que es solo vanilla javascript, no hace falta llenarlo todo de paquetes para convertir unos colores de hex a hsl.

Bueno, en realidad todo el conjunto está compilado con [Gulp](https://gulpjs.com/) (para convertir el pug a html y el scss a css) como si fuera el siglo XX. Así que realmente sí que hay unos pocos paquetes de npm instalados... Pero solo los necesarios para que funcione Gulp (todos `dev-dependencies`), así que no pasan a la aplicación real. Que al final solo son tres archivos:

- index.html
- style.css
- scripts.js

De toda la vida.

Vamos a por ello:

## Cómo se hace (las típicas _User Stories_)

Queremos un formulario donde el usuario pueda **pegar** una lista de colores hex.

Queremos **comprobar** que lo que ha pegado es válido, para no romper nada.

Queremos **convertir** colores desde notación hexadecimal (`#10b06e`) a HSL (`hsl(155, 83%, 38%)`).

Y queremos **devolver** una lista completa con los colores en orden.

## Las partes

Tenemos un `textarea` donde pegar los colores en hex.

Un botón para convertir.

Y un `textarea` con `readonly` donde aparecen los resultados (así es más fácil seleccionar y copiar). Pronto se auto-copiarán al portapapeles con solo hacer clic en el `textarea` o algo así.

Y listo.

Bueno, y un botón de ' 💣 reset' que borra los dos campos, para los perezosos.

## El proceso de conversión

Agarramos el `input` que ha pegado el usuario, a ver qué aspecto tiene.

Para eso escuchamos clics en el botón y pasamos a procesar el `value` de la `textarea`:

```js
button.addEventListener(`click`, () => {
  // aquí procesamos el input del user
}
```

Ya les hemos pedido que sea solo una lista de valores hex separada por comas, pero nunca deberías fiarte...

Antes de realmente convertir entre hex y hsl hay que manipular un poquillo el `input`.

### Qué nos ha dado el user

Veamos. Esto iría dentro de la _callback_ del _EventListener_ que acabamos de ver:

```javascript
// usamos directamente los values de las textareas aunque no sea lo más ortodoxo
resultInput.value = userInput.value
  // separamos el listado por las comas, a un array de cadenas
  .split(`,`)
  // quitamos TODOS los espacios en cada cadena
  .map((h) => h.replace(/ /g, ``))
  // quitamos TODAS las new-lines
  .map((h) => h.replace(/\n/g, ``))
  // quitamos los elementos vacíos en el array
  .filter((h) => h !== ``)
  // pasamos cada código hex a la función conversora
  // (que devuelve una cadena con el hsl(), ahora lo veremos)
  .map((h) => calculateHSL(h))
  // juntamos todas las cadenas del array en una mega cadena
  // separando cada color con una new-line
  .join(`\n`);
```

Bien. Realmente lo único que hemos hecho ha sido separar el input del usuario en cadenas y mandarlo a la función que convierte hex a hsl.

Pero lo que le hemos mandado podría ser cualquier cosa...

### Sólo queremos colores hex

Por eso, lo primero que hace la función `calculateHSL(input)` es pasar el `input` por un `regex.test()` bastante estricto. Para comprobar que no nos están pasando la lista de la compra, sino una lista de colores hex.

```js
function calculateHSL(inp) {
  // un regex algo WET, escrito en un momento
  const regex = /^(#)?[a-fA-F0-9]{3}$|^(#)?[a-fA-F0-9]{6}$/;
  // comprobar que el formato es correcto, sino out
  const isHex = regex.test(inp);
  if (!isHex) return console.error(`${inp} not valid (╯°□°）╯︵ ┻━┻`);

  // seguir procesando el input
}
```

Sí, el regex podría escribirse mejor.

Y en caso de error habría que avisar al usuario de que algo no va bien, en lugar de solo mandar un error a la consola. Pronto.

Lo que hace el regex:

- Al inicio puede haber o no haber un (y solo un) símbolo `#`.
- Después puede haber 3 o 6 caracteres que sean números o letras entre `a` y `f`, mayúsculas o minúsculas.
- Y después tiene que acabar, no puede haber más caracteres detrás

Podría convertir todas las letras a _mayus_ o _minus_ antes del test... Pero realmente da igual porque en ambos casos (e incluso aunque estén mezcladas) las fórmulas podrán convertir los valores hexadecimales a hsl sin problema.

Después quitamos el símbolo `#` para evitar problemas. Si no lo traía, pues nos da igual. Y si unos lo traían y otros no en el input general, así tratamos a todos igual.

```js
function calculateHSL(inp) {
  // ...lo que ya hemos visto

  const hex = inp.replace(`#`, ``);

  // ...empezar a calcular colores aquí, a continuación
```

Empezamos con lo divertido (si te gustan las matemáticas)

Por cierto, todas las próximas fórmulas las he sacado de [la fabulosa guía para convertir formatos de color de CSS-Tricks](https://css-tricks.com/converting-color-spaces-in-javascript/)

### Convertir hex a hsl()

Para convertir de un color en formato HEX a HSL, el proceso es el siguiente:

1. Se convirte de hex a rgb (ambos listan simplemente valores de rojo, verde y azul, pero uno en hexadecimal y otro sobre 255)
2. Se convirten los canales `r`, `g` y `b` del RGB() a Hue (matiz), Saturation (saturación) y Lightness (luminosidad).

### Primero queremos el color en rgb()

Así que empezamos por separar los valores `r`, `g`, y `b`.

Todo lo que viene ahora dentro de la misma función que hemos visto:

```js
// definimos las variables para los canales
let r;
let g;
let b;
// los colores HEX pueden venir con 6 dígitos o con 3 solo (#fff), lo asignamos aquí
if (hex.length === 6) {
  r = +`0x${hex[0]}${hex[1]}`;
  g = +`0x${hex[2]}${hex[3]}`;
  b = +`0x${hex[4]}${hex[5]}`;
} else if (hex.length === 3) {
  r = +`0x${hex[0]}${hex[0]}`;
  g = +`0x${hex[1]}${hex[1]}`;
  b = +`0x${hex[2]}${hex[2]}`;
} else {
  return console.log(`${inp} not valid (╯°□°）╯︵ ┻━┻`);
}
```

Si queda claro sáltate este detalle, sino aquí tienes una explicación:

#### Cómo convertir de hex a rgb()

En el caso de un hex de 6 dígitos, los dos primeros serán el canal `rojo`, los siguientes dos serán el `verde` y los dos últimos el `azul`. En un código corto, repetimos cada valor.

Para cada canal (r, g, y b), hacemos una cadena con los dos dígitos, le añadimos `0x` delante, y después lo convertimos a número (con un `+` delante).

Listo, habremos pasado, por ejemplo, de `#10B06E` a `r = 16`, `g = 176`, `b = 110`.

¿Cómo obtenemos los valores de matiz, saturación y luminosidad de estos tres canales?

Aquí es donde se complica la cosa:

### Convertir rgb() en hsl()

Primero sacaremos el _matiz_, el _hue_.

Para ello calculamos primero un par de valores que usaremos en todas las fórmulas:

```js
// dividimos por 255 para conseguir valores solo entre 0 y 1
r /= 255;
g /= 255;
b /= 255;
// sacamos el máximo y el mínimo de los tres
const min = Math.min(r, g, b);
const max = Math.max(r, g, b);
// y la diferencia entre ambos
const delta = max - min;
```

#### Calcular el Matiz

Aquí hay que aplicar un par de fórmulas.

Si todos los canales son iguales (no hay max o min, delta es 0), el matiz es 0. Listo.

Si predomina uno de los canales, se calcula el matiz con los otros dos. Cada fórmula es diferente según qué canal sea el máx. Aquí tienes los cálculos:

```js
// calcular el hue
let h;
// si no hay diferencia entre canales
if (delta === 0) h = 0;
// fórmulas para cada canal
else if (max === r) h = ((g - b) / delta) % 6;
else if (max === g) h = (b - r) / delta + 2;
else if (max === b) h = (r - g) / delta + 4;
```

Como te decía, fórmulas. Puedes intentar buscarles una lógica si quieres.

Esto nos dará un valor, pero lo necesitamos en grados, sobre 360.

Así que lo multiplicamos por `60`.

Y si ha quedado negativo, le sumamos `360` para conseguir el valor equivalente pero positivo.

Solo queremos positivos en el resultado `hsl()`.

```js
// a grados
h = Math.round(h * 60);
// solo positivos bajo 360
if (h < 0) h += 360;
```

Ya queda poco

Vamos a por los dos que quedan, que los calcularemos en el orden inverso:

Primero la _luminosidad_, que la usaremos para la _saturación_.

#### Calcular la Luminosidad

Muy fácil.

La media de los canales máximo y mínimo:

```js
// calcular Luminosidad
let l = (max + min) / 2;
```

Y a por el último:

#### Calcula la Saturación

Al igual que con el _matiz_, si `delta` era 0, este también es 0. Sino, aplicamos otra fórmula:

```js
// calcular Saturación
let s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
```

#### El último detalle

Ya solo falta un último retoque con _saturación_ y _luminosidad_:

Estos dos valores tienen que ser porcentajes en el resultado final. Y sin decimales.

```js
// L y S sobre 100
l = +(l * 100).toFixed(0);
s = +(s * 100).toFixed(0);
```

Listo.

### hsl() con el formato correcto

Retornamos el color hsl en su forma correcta (la que podrás usar al escribir css):

```js
// out el hsl formateado para css
return `hsl(${h}, ${s}%, ${l}%)`;
```

Y listo, la fórmula devuelve el color hex que le habíamos pasado formateada como una cadena hsl() que el usuario podrá copiar y pegar donde quiera.

## Solo falta el botón de reset

Que la verdad no tiene mucha complicación:

Escuchamos clicks en el botón de Reset. Y pasamos `''` a las dos `textarea`s:

```js
reset.addEventListener(`click`, () => {
  userInput.value = ``;
  result.value = ``;
  // ¿podría ser más elegante? seguro, pero esto es suficiente
});
```

## Conclusión

Ya has visto cómo se hace, aquí te lo repito todo otra vez en dos líneas.

El código completo con todo lo que acabas de ver (pero junto), con los `getElementById`s y demás, [lo tienes aquí mismo](https://github.com/rubenvar/bulk-color-converter/blob/master/src/scripts.js).
