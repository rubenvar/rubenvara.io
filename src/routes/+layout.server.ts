import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (({ url }) => {
    const urlsToRedirect = ['bosnia-y-herzegovina', 'estambul-y-ankara', 'montenegro', 'primer-gran-viaje'];

    if (urlsToRedirect.includes(url.pathname.replaceAll('/', ''))) {
        redirect(308, '/');
    }
}) satisfies LayoutServerLoad;
