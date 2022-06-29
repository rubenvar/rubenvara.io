/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  interface Stuff {
    title: string;
    description: string;
    canonical: string;
  }
}

declare module 'dayjs/locale/es.js';

declare const __PKG_VERSION__: string;
