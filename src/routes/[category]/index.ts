import type { RequestHandler } from './__types';
import { getAllPosts } from '../_api';

export const get: RequestHandler = async ({ params }) => {
  const { category } = params;
  const posts = await getAllPosts(category);

  if (posts.length) {
    return {
      body: { posts },
    };
  }

  return {
    status: 404,
  };
};
