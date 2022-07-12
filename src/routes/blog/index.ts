import { dev } from '$app/env';
import type { RequestHandler } from './__types';
import { countLinks, countWords, getAllCategories, getAllPosts } from '../_api';

export const get: RequestHandler = async () => {
  const posts = await getAllPosts(dev);

  if (posts.length) {
    if (dev) {
      // calculate and return link count only in development
      return {
        body: {
          posts,
          counted: countLinks(posts),
          words: countWords(posts),
          categories: await getAllCategories(dev),
        },
      };
    }
    return {
      body: { posts },
    };
  }

  return {
    status: 404,
  };
};
