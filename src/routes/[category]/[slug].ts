import type { Post } from '$lib/utils/types';
import type { RequestHandler } from './__types/[slug]';
import { getSinglePost } from '../_api';

export const get: RequestHandler = async ({ params }) => {
  const { category, slug } = params;

  const post: Post = await getSinglePost(category, slug);

  if (post) {
    return {
      body: { post },
    };
  }

  return {
    status: 404,
  };
};
