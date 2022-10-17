---
title: Proxy de imágenes en Next.js ¿Cómo y Para qué?
date: 2022-10-17
status: draft
---

[Con](https://github.com/Blazity/next-image-proxy)

Usos:

- Makes it possible to use dynamic domains in next/image component.
- html2canvas with images that seem local even if they are external (canvas doesn't render external images, CORS, etc.)
- reduce Cloudinary usage.

En `/pages/api/imageProxy.ts`:

```ts
// really simple image proxy from https://github.com/Blazity/next-image-proxy
// to serve cloudinary images with my domain
// for html2canvas to work properly in single race thumbnail building proces
import { withImageProxy } from '@blazity/next-image-proxy';

export default withImageProxy({
  whitelistedPatterns: [/^https?:\/\/res.cloudinary.com/],
});
```

Uso:

```ts
import NextImage from 'next/image'

export function SomeComponent() {
  const actualImageUrl = 'https://cdn-images-1.medium.com/max/1024/1*xYoAR2XRmoCmC9SONuTb-Q.png'

  return <NextImage src={`/api/imageProxy?imageUrl=${actualImageUrl}`} width={700} height={300} />
}
```
