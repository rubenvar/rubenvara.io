---
title: Integrar GoatCounter en una app Next.js
seoTitle: "Integrar GoatCounter en Next.js: Cómo Agregar Analíticas Gratis"
description: Mira cómo usar las analíticas gratuitas de GoatCounter en una app Next.js, en un solo componente. Válido para webs SSR, SPA, SSG, etc.
date: 2022-10-03
status: published
---

El último paso que me falta en mi sitio web *calendarioaguasabiertas.com* para eliminar del todo las cookies es **abandonar Google Analytics**. Sé que existen decenas de opciones para sustituirlo. He decidido usar [GoatCounter](https://www.goatcounter.com/).

Me encanta la filosofía minimalista de esta herramienta, que sea de código abierto, nada invasiva, muy **ligera**, gratuita, etc. También que pueda alojarla yo mismo si quiero, evitando así que sea detectada por los bloqueadores de anuncios.

Te cuento en dos minutos cómo la integré en una app Next.js con todo tipo de páginas (algunas estáticas, algunas SSR, etc.)

## Punto de partida

Antes de empezar a hacer pruebas, con una búsqueda rápida por [Hello](https://beta.sayhello.so/) encontré estas dos ideas:

- [next-goatcounter](https://github.com/haideralipunjabi/next-goatcounter): un *plugin* con todo listo para integrar GoatCounter. Como no considero necesario un package más para instalar un `script` y loguear visitas, decidí hacerlo por mi cuenta.
- [Este tutorial de Rémy Beumier](https://remybeumier.be/blog/get-web-analytics-in-nextjs-with-goatcounter), de donde también saqué un par de ideas.

El código de estos dos recursos fue definitivamente muy útil en la solución final:

## Integrar GoatCounter en Next.js, sin paquetes externos

Cuando te registras en Goatcounter obtendrás el código que debes pegar en tu sitio web. Muy sencillo:

```html
<!-- código genérico de ejemplo para integrar GoatCounter -->
<script
  data-goatcounter="https://example.goatcounter.com/count"
  async
  src="//gc.zgo.at/count.js">
</script>
```

Idealmente metes este `script` *en cualquier sitio* de tu página y listo.

La cosa, como siempre, es algo más complicada en apps con SSR y demás, como una creada con Next.js, donde toda la **navegación** es *client-side*.

### La configuración de GoatCounter

Por un lado, para estos casos la documentación de GoatCounter [te recomienda](https://rbn.goatcounter.com/help/spa) ajustar `no_onload: true` en la configuración.

Hay otros ajustes que quizás también quieres usar.

En mi caso `allow_local: true` para que la herramienta registre visitas desde `localhost`, al menos mientras estoy haciendo pruebas.

Tienes [más ajustes](https://rbn.goatcounter.com/help/js) disponibles, y dos formas de configurarlos cuando cargas GoatCounter:

#### Opción 1

En la misma etiqueta `script`, con el atributo `data-goatcounter-settings`:

```html
<script
  data-goatcounter-settings='{"no_onload": true, "allow_local": true}'
  data-goatcounter="https://example.goatcounter.com/count"
  async
  src="//gc.zgo.at/count.js">
</script>
```

#### Opción 2

Usando JavaScript y cargándolos en el objeto global `window.goatcounter`:

```html
<script>
  window.goatcounter = {
    no_onload: true,
    allow_local: true,
  };
</script>
<script
  data-goatcounter="https://example.goatcounter.com/count"
  async
  src="//gc.zgo.at/count.js">
</script>
```

Eso sí, **importante**:

Si usas este sistema, tienes que hacerlo antes de la etiqueta `script` que carga el archivo `count.js`.

Si no, la visita se registrará antes de cargar tu configuración, y luego solo sobreescribirás el objeto `window.goatcounter` sin conseguir nada.

Para evitar problemas con este orden de carga, yo he utilizado el **primer sistema**.

---

Una vez que tenemos clara la configuración, hay dos partes para integrar GoatCounter en Next.js:

1. Cargar el `script`.
2. Registrar la visita.

Fácil, ¿verdad? Vamos con cada una por separado, y después vemos dónde y cómo ponerlo todo:

### Cargar el script en Next.js

Utilizo [el componente `Script`](https://nextjs.org/docs/basic-features/script) de Next.js.

Ofrece varias *estrategias* de carga. Para asegurar que el script de GoatCounter **existe** antes de intentar registrar la visita, pero no **bloquea** la carga de mi app, quiero configurarlo como `strategy="afterInteractive"`.

```jsx
<Script
  data-goatcounter-settings='{"allow_local": true, "no_onload": true}'
  data-goatcounter={process.env.NEXT_PUBLIC_GOATCOUNTER}
  src="//gc.zgo.at/count.js"
  strategy="afterInteractive"
/>
```

Ves que hemos añadido la config en el atributo `data-goatcounter-settings`. Yo los he escrito directamente, pero podrías agregarlos condicionalmente, etc.

También meto el enlace `data-goatcounter` en una *variable ambiental* para poder usar un link diferente en desarrollo y en producción.

Lo único que falta es detectar la navegación del usuario y registrarla:

### Registrar la visita

Creo una función auxiliar:

```js
function logGoatCounterPageview(url) {
  // si el script ya está cargado (.goatcounter existe en window)
  if (!window.goatcounter || !window.goatcounter.count) return;
  
  // loguear la visita a GoatCounter
  window.goatcounter.count({
    path: url,
    event: false,
  });
}
```

Y la llamo cada vez que ocurre un cambio de ruta. Para ello usamos los *hooks* `useRouter()` de Next.js y `useEffect()` de React.:

```js
const router = useRouter();

//  llamar a la función auxiliar en cada cambio de ruta
useEffect(() => {
  router.events.on('routeChangeComplete', logGoatCounterPageview);

  return () => {
    router.events.off('routeChangeComplete', logGoatCounterPageview);
  };
}, [router.events]);
```

---

Vale. ¿Pero dónde metemos todo esto?

### Integrarlo todo

Creamos un nuevo componente, `GoatCounter.jsx`. Dentro de este haremos todo el trabajo que acabamos de ver.

Así quedaría el componente completo:

```jsx
import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

function logGoatCounterPageview(url) {
  // si el script ya está cargado (.goatcounter existe en window)
  if (!window.goatcounter || !window.goatcounter.count) return;
  
  // loguear la visita a GoatCounter
  window.goatcounter.count({
    path: url,
    event: false,
  });
}

// definir el componente
export function GoatCounter() {
  const router = useRouter();

  // llamar a la función auxiliar en cada cambio de ruta
  useEffect(() => {
    router.events.on('routeChangeComplete', logGoatCounterPageview);

    return () => {
      router.events.off('routeChangeComplete', logGoatCounterPageview);
    };
  }, [router.events]);

  return (
    <Script
      data-goatcounter-settings='{"allow_local": true, "no_onload": true}'
      data-goatcounter={process.env.NEXT_PUBLIC_GOATCOUNTER}
      src="//gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}

```

Este componente lo introduzco en [la ruta especial](https://nextjs.org/docs/advanced-features/custom-app) `/pages/_app.jsx` de Next.js:

```jsx
import { GoatCounter } from '../components/GoatCounter';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoatCounter />
      <Component {...pageProps} />
    </>
  );
}
```

Y listo, con esto deberías estar viendo nuevas visitas en tu panel de control de GoatCounter tras navegar por tu sitio.

---

GoatCounter también ofrece el registro de *eventos*, algo que se podría integrar fácilmente con lo que ya hemos visto. Exportaríamos otra función auxiliar desde este mismo componente, y la llamaríamos tras cada clic que quisiéramos registrar como evento. Espero integrar esto muy pronto en mi proyecto y escribir sobre ello.
