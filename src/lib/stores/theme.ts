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
