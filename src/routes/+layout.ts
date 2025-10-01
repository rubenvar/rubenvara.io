import type { LayoutLoad } from './$types';

export const prerender = true;
// export const trailingSlash = 'always';

export const load = (({ url }) => {
    return {
        key: url.pathname,
        canonical: `${url.origin}${url.pathname}`,
        title: 'Rubén Vara ~ Mi Blog sobre Javascript, Desarrollo Web, y Otras Historias',
        description: 'Web Personal: Qué hago ahora, mi blog sobre desarrollo web y Javascript, mi estilo de vida, y mi primer gran viaje. Un poco de todo',
    };
}) satisfies LayoutLoad;
