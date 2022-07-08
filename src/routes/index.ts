import { dev } from '$app/env';
import type { RequestHandler } from './__types';
import { getAllPosts } from './_api';

export const get: RequestHandler = async () => {
  const latestPosts = await getAllPosts(dev, { take: 3 });

  if (latestPosts.length) {
    return {
      body: { homePosts: latestPosts },
    };
  }

  return {
    status: 404,
  };
};
