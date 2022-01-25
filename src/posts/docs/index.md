---
slug: docs
title: Docs para publicar en mi web
date: 2020-03-21
updated: 2022-01-25
categories:
  - Docs
status: draft
---

## Post frontmatter

All possible frontmatter values for posts:

```yaml
---
slug: como-crear-conversor-colores-bulk
title: Cómo crear un conversor de colores en bloque (bulk)
seoTitle: Cómo Convertir una Lista de Colores de HEX a HSL en bloque
date: 2020-04-05
updated: 2020-04-10
description: Convertir colores HEX a HSL(). Muchos a la vez. Y evitar que alguien lo rompa. Todo en vanilla javascript
categories:
  - Javascript
  - Herramientas
status: published or draft
twitter: https://www.twitter.com/etc-etc-etc
---
```

Only `slug`, `title` and `date` are required.

`slug` is used to fetch the single post and when listing all posts, the folder name inside `/posts/` means nothing.

If no `seoTitle` or `description` provided, `title` is used.

### Managing Dates

Set `date` on publish. On subsequent updates, set `updated`, leave `date` untouched. I can always keep the previous `updated` dates in text notes.

If `updated` is equal to `date`, it's ignored. No need to set it on publish.

## Post status

Posts can be `status: "published"` or `status: "draft" (or anything else)`.

If not `"published"`, posts load in `dev` but not in `prod`.
