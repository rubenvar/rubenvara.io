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

Hazme caso, hay que instalar todo esto. Lo iremos usando poco a poco.

## Crear el componente de mapa

## Importar el componente

- use next/dynamic to import component after page load (`ssr: false`)

## Detalles y optimizaciones

- markercluster
- a11y icon

---
