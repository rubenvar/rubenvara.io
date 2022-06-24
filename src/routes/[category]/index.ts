import { dev } from '$app/env';
import type { RequestHandler } from './__types';
import { getAllPosts } from '../_api';

export const get: RequestHandler = async ({ params }) => {
  const { category } = params;
  const posts = await getAllPosts(dev, {category});

  if (posts.length) {
    return {
      body: { posts },
    };
  }

  return {
    status: 404,
  };
};
