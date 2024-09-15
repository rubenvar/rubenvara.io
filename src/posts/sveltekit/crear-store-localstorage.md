---
title: Cómo crear una store en SvelteKit que persista los datos a localStorage
date: 2024-02-10
status: draft
---

```ts
// https://rodneylab.com/using-local-storage-sveltekit/
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'dark' | 'light';

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
    window.localStorage.setItem('theme', value);

    // update the html tag from the store?
    document.getElementsByTagName('html')[0].setAttribute('data-theme', value);
  }
});

export { theme };

```
