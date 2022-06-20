import type { RequestHandler } from './__types';
import { getAllPosts } from '../_api';

export const get: RequestHandler = async () => {
  const posts = await getAllPosts();

  if (posts.length) {
    return {
      body: { posts },
    };
  }

  return {
    status: 404,
  };
};
