---
title: Cómo añadir temas a tu web SvelteKit y persistir en cookies y localStorage
date: 2024-08-10
status: draft
---

Si usas SSR, aunque guardes en `localStorage`, tendrás un problem: Evitar FOUC (Flash of Unstyled Content):

Persistir en cookies, para leer las cookies en un server hook.

## hooks.server.ts

```ts
import { isTheme } from '$lib/config';

export async function handle({ event, resolve }) {
  const theme = event.cookies.get('theme');

  if (!theme || !isTheme(theme)) {
    return await resolve(event);
  }

  return await resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace('data-theme=""', `data-theme="${theme}"`);
    },
  });
}
```

```ts
import type { Theme } from './utils/types';

export const themes = ['dark', 'light'] as const;
export function isTheme(maybeTheme: string): maybeTheme is Theme {
  return (themes as readonly string[]).includes(maybeTheme);
}
```

## stores/theme.ts

```ts
// https://rodneylab.com/using-local-storage-sveltekit/
// https://scottspence.com/posts/cookie-based-theme-selection-in-sveltekit-with-daisyui
import { browser } from '$app/environment';
import type { Theme } from '$lib/utils/types';
import { writable } from 'svelte/store';

let defaultValue: Theme = 'light';
// use the system as the default
if (browser && window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
  defaultValue = 'dark';
}

const initialValue = browser
  ? ((window.localStorage.getItem('theme') as Theme) ?? defaultValue)
  : defaultValue;

const theme = writable<Theme>(initialValue);

theme.subscribe((value) => {
  if (browser) {
    // to localStorage
    window.localStorage.setItem('theme', value);

    // to cookie
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `theme=${value}; max-age=${oneYear}; path=/;`;
    
    // update the html tag from the store
    document.documentElement.setAttribute('data-theme', value);
  }
});

export { theme };
```

## +layout.svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme';

  function toggleTheme() {
    const newTheme = $theme === 'dark' ? 'light' : 'dark';
    theme.set(newTheme);
  }

  onMount(() => {
    // add eventListener: listen for changes in the preferred theme from system
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        theme.set(e.matches ? 'dark' : 'light');
      });
  });

</script>

<button on:click={toggleTheme}>{$theme === 'dark' ? 'light' : 'dark'}</button>
```
