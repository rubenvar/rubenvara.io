/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
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
