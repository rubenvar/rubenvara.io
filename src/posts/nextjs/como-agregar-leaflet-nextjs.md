---
title: Cómo usar leaflet.js con SSR en Next.js
description: Menos complicado de lo que parece
date: 2023-02-07
status: draft
---

<script>
  import Emphasis from '$lib/components/Emphasis.svelte'
</script>

Hace poco creé una side-app para mi proyecto <Emphasis>Calendario Aguas Abiertas</Emphasis>: Usando toda la info ya almacenada en esa app, creé una página que muestra todos los eventos en un mapa, a pantalla completa ([puedes ver el resultado aquí](https://mapa.calendarioaguasabiertas.com)).

Aunque en la app principal ya he implementado mapas en diferentes vistas y pantallas, esta side-app era **simplemente un mapa**, lo que me permitió repensar cómo hacer todo el trabajo para que funcione lo más ligera y *finamente* posible.

Te cuento en dos minutos cómo implementar un mapa con `leaflet` en una app Next.js que use Server Side Rendering.

## Instalar las dependencias

Entiendo que ya tienes instalado Next.js, React, y demás. Vamos a ver cómo meter el mapa con leaflet sobre lo que ya tengas.

```sh
npm install leaflet react-leaflet
```

Eso es todo.

Si quieres añadir varias mejoras y detalles a tu resultado, en la sección final vemos unos cuantos paquetes más que tendrás que instalar.

## Crear el componente de mapa

## Importar el componente

Importar

```js
import dynamic from 'next/dynamic';
```

Usar

```jsx
export function MapPage() {
  // importa Map
  const MapWithNoSSR = dynamic(() => import('./Map'), { ssr: false });
  // ...
  return (
    // ...
    <MapWithNoSSR />
    // ...
  )
}
```

Si el componente `Map` se encarga de solicitar la data que luego rnderizará, listo.

Si quieres solicitar la data en el componente `MapPage` para poder usarla en otros componentes que estén en esta página (algo más realista), puedes pasar a `MapWithNoSSR` las mismas `props` que pasarías al componente `Map`:

```jsx
export function MapPage() {
  // solicita tu data a la API, etc.
  const events = [ /* ... */ ];
  // importa Map
  const MapWithNoSSR = dynamic(() => import('./Map'), { ssr: false });

  return (
    // si Map acepta la prop "events"
    <MapWithNoSSR events={events} />
  )
}
```

## Detalles y optimizaciones

### Agrupar los iconos en un mapa leaflet

```sh
npm install leaflet.markercluster @changey/react-leaflet-markercluster
```

 markercluster

### Aceptar gestos en pantallas táctiles

```sh
npm install leaflet-gesture-handling
```

gesture-handling
Sin capturar el scroll y *encerrar* al usuario en nuestro mapa

### a11y icon

```sh
npm install leaflet-defaulticon-compatibility
```

¿Problemas porque no se muestra el icono en tu mapa leaflet?

Lo solucionamos con un paquete

---
