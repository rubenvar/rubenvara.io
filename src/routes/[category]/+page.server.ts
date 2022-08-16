import { dev } from '$app/env';
import type { RequestHandler } from './__types';
import { getAllPosts } from '../_api';

const oldRoutes = [
  'bosnia-y-herzegovina',
  'estambul-y-ankara',
  'montenegro',
  'primer-gran-viaje',
];

export const GET: RequestHandler = async ({ params }) => {
  const { category } = params;

  if (oldRoutes.includes(category)) {
    console.log('this is an old route, redirect home');
    return {
      status: 301,
    };
  }

  const posts = await getAllPosts(dev, { category });

  if (posts.length) {
    return {
      body: { posts },
    };
  }

  return {
    status: 404,
  };
};
