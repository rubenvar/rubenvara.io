import type { Theme } from './utils/types';

export const siteUrl = 'https://rubenvara.io';
export const themes = ['dark', 'light'] as const;
export function isTheme(maybeTheme: string): maybeTheme is Theme {
    return (themes as readonly string[]).includes(maybeTheme);
}
