---
title: Cómo crear un sitemap completo en Next.js
date: 2021-07-06
status: draft
---

Opciones

- Si creas rutas desde `filesystem`.
- Si creas rutas *fetching* desde *endpoint*.
- Si tienes rutas *hardcoded*

Opciones

- Crear archivo estático con node, en cada `build`. (podrías re-crearlo con nuevo `unstable-revalidate` (2022-02-19)).
- O tener file como `sitemap.xml.js` y crearlo ahí dinámico.
