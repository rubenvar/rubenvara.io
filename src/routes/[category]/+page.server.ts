import { dev } from '$app/env';
import type { PageServerLoad } from './$types';
import { getAllPosts } from '../_api';
import { error, redirect } from '@sveltejs/kit';

const oldRoutes = [
  'bosnia-y-herzegovina',
  'estambul-y-ankara',
  'montenegro',
  'primer-gran-viaje',
];

export const load: PageServerLoad = async ({ params }) => {
  const { category } = params;

  if (oldRoutes.includes(category)) {
    console.log('this is an old route, redirect home');
    throw redirect(301, '/');
  }

  const posts = await getAllPosts(dev, { category });

  if (posts.length) {
    return {
      posts,
      // this was in stuff:
      title: `Todos los artículos sobre ${params.category}`,
      description: `Mira ${posts.length} artículos detallados sobre ${params.category}: quédate por aquí y seguro que aprendes algo`,
    };
  }

  throw error(404, 'some error in +page.server.ts in [category]');
};
