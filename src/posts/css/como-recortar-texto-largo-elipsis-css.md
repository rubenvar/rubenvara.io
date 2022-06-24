---
title: Cómo auto-recortar texto largo con una elipsis en CSS
seoTitle: Cómo Auto-Recortar Texto Largo y mostrar una Elipsis de Forma Elegante, solo con CSS
date: 2022-03-08
description: Si quieres que un texto de longitud variable se recorte automáticamente para encajar, css te lo auto-soluciona agregando una elipsis al final
status: published
---

Aunque esto exista en `css` de toda la vida, hace poco que acabo de descubrirlo y entender cómo funciona realmente.

Como siempre tengo que buscarlo otra vez cada vez que quiero usarlo, lo dejo escrito aquí y seguro que te aporta algo.

Requisitos:

1. Tener un texto.
2. Tener un espacio **concreto** donde queramos meterlo.

Importante que el espacio tenga un tamaño definido.

---

Vamos a explicarlo mejor con un ejemplo:

Digamos que tienes un texto, importado o generado, del cual no conoceremos la longitud. Nos vale algo como esto por ahora:

```html
<div>
  <p>Me encantan los helados.</p>
  <p>Mi preferido es el de yogur de amarena con chips de chcolate blanco.</p>
  <p>El verano es genial!</p>
</div>
```

Ahora queremos mostrarlo en un `grid`, de columnas iguales. También te valdría un `flex`, una `table`, etc. Agregamos algunos estilos:

```html
<style>
  div {
    background-color: blanchedalmond;
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(3, 1fr);
  }

  p {
    border: 1px solid firebrick;
    padding: 12px;
    border-radius: 3px;
  }
</style>
```

Se verá algo como esto:

![El texto pasa a la siguiente línea](/posts/ellipsis1.png)

Todo bien.

## Pero vamos a ponernos *detallistas*

Digamos que por razones estilísticas no queremos que el texto pase a otra línea. Modificamos los estilos del `p`:

```html
<style>
  div {
    /* ... */
  }

  p {
    /* ... */
    white-space: nowrap;
  }
</style>
```

Ahora tendremos lo siguiente:

![La caja es demasiado ancha](/posts/ellipsis2.png)

Todo bien otra vez... Pero tenemos el capricho de que todas las cajas tengan la misma anchura.

Hay otras maneras, pero para simplificar, como conocemos la anchura deseada, la forzamos en el `grid`:

```html
<style>
  div {
    /* ... */
    grid-template-columns: repeat(3, 250px);
  }

  p {
    /* ... */
    white-space: nowrap;
  }
</style>
```

Esto daría el resultado que querríamos, pero no podemos dejarlo así:

![El texto se sale...](/posts/ellipsis3.png)

## El resultado más elegante: auto-elipsis

Tenemos que ocultar el texto que se salga de las cajas:

```html
<style>
  div {
    /* ... */
    grid-template-columns: repeat(3, 250px);
  }

  p {
    /* ... */
    white-space: nowrap;
    overflow-x: hidden;
  }
</style>
```

Más o menos esta era la idea inicial, pero estarás conmigo en que no podemos dejar el texto cortado de esta manera:

![El texto se corta](/posts/ellipsis4.png)

Para dejarlo más elegante, es aquí donde utilizaremos el estilo que agregará, **automáticamente**, la elipsis (...):

```html
<style>
  div {
    /* ... */
    grid-template-columns: repeat(3, 250px);
  }

  p {
    /* ... */
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
</style>
```

Y por fin lo habremos conseguido:

![Esto es lo que queríamos!](/posts/ellipsis5.png)

Perfecto. El texto que no supere la anchura quedará sin tocar. Si se saldría de la caja, `css` auto-recorta y añade la elipsis para mostrar que el texto es demasiado largo.

## Recuerda los requisitos

- Si el contenedor (el `p` en este caso) no tiene una anchura definida, añadir estos estilos no hará nada.
- Si no evitamos que el texto pase a otra línea (`white-space: nowrap`), `text-overflow: ellipsis` no tendrá efecto.
- Si no ocultamos el texto que se salga (`overflow: hidden`), tampoco veremos resultados.

---

## Truco extra

Puede ser que el texto a mostrar sea *importante* y no quieras que se pierda información. Por supuesto, puedes expandir el contenido con JavaScript, usar otros estilos, etc.

Un sistema muy sencillo, según a qué usuarios enfoques tu contenido, es añadir un `title` a cada `p` en este caso con el texto completo. Al colocar encima el ratón se mostrará ese texto.
