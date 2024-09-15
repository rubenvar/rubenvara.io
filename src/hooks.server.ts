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
