import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';
import { getAllCategories, getAllPosts } from '$lib/utils/api';
import { countLinks, countWords } from '$lib/utils/helpers';

export const load: PageServerLoad = async () => {
    // get ALL posts
    const posts = await getAllPosts();

    if (posts.length) {
        if (dev) {
            return {
                posts,
                // calculate and return link count only in development
                counted: countLinks(posts),
                words: countWords(posts),
                categories: await getAllCategories(),
                // on-page seo:
                title: `Mi blog sobre JavaScript y otras tecnologías: ${posts.length} artículos detallados`,
                description: `Dicen que no sabes lo que sabes hasta que intentas enseñarlo, así que en eso estamos: Escribo sobre JavaScript y desarrollo web en español`,
            };
        }
        return {
            posts,
            // on-page seo:
            title: `Mi blog sobre JavaScript y otras tecnologías: ${posts.length} artículos detallados`,
            description: `Dicen que no sabes lo que sabes hasta que intentas enseñarlo, así que en eso estamos: Escribo sobre JavaScript y desarrollo web en español`,
        };
    }

    error(404, 'some error from blog +page.server.ts');
};
