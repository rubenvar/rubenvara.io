import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';
import {
  countLinks,
  countWords,
  getAllCategories,
  getAllPosts,
} from '$lib/utils/api';

export const load: PageServerLoad = async () => {
  const posts = await getAllPosts(dev);

  if (posts.length) {
    if (dev) {
      return {
        posts,
        // calculate and return link count only in development
        counted: countLinks(posts),
        words: countWords(posts),
        categories: await getAllCategories(dev),
        // this was in stuff:
        title: `Mi blog sobre JavaScript y otras tecnologías: ${posts.length} artículos detallados`,
        description: `Dicen que no sabes lo que sabes hasta que intentas enseñarlo, así que en eso estamos: Escribo sobre JavaScript y desarrollo web en español`,
      };
    }
    return {
      posts,
      // this was in stuff:
      title: `Mi blog sobre JavaScript y otras tecnologías: ${posts.length} artículos detallados`,
      description: `Dicen que no sabes lo que sabes hasta que intentas enseñarlo, así que en eso estamos: Escribo sobre JavaScript y desarrollo web en español`,
    };
  }

  throw error(404, 'some error from blog +page.server.ts');
};
