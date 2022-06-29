import type { Post } from '$lib/utils/types';
import type { RequestHandler } from './__types/[slug]';
import { getCategoryCount, getSinglePost } from '../_api';
import { dev } from '$app/env';

export const get: RequestHandler = async ({ params }) => {
  const { category, slug } = params;

  const post: Post = await getSinglePost(category, slug);
  const categoryCount = getCategoryCount(category, dev);

  if (post) {
    return {
      body: { post, categoryCount },
    };
  }

  return {
    status: 404,
  };
};
