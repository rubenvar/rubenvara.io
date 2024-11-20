import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/utils/api';

export const load: PageServerLoad = async ({ params }) => {
  const posts = await getAllPosts({ category: params.category });

  if (posts.length) {
    return {
      posts,
      // on-page seo:
      title: `Todos los artículos sobre ${params.category}`,
      description: `Mira ${posts.length} artículos detallados sobre ${params.category}: quédate por aquí y seguro que aprendes algo`,
    };
  }

  error(404, 'some error in +page.server.ts in [category]');
};
