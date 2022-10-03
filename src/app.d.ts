/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface PrivateEnv {}
  // interface PublicEnv {}
  // interface Session {}
}

declare interface Window {
  goatcounter: {
    count: (args: { path: string; event: false }) => void;
  };
}

declare module 'dayjs/locale/es.js';

declare const __PKG_VERSION__: string;
