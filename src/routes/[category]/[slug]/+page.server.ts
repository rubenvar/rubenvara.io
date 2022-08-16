import type { Post } from '$lib/utils/types';
import type { PageServerLoad } from './$types';
import { getCategoryCount, getSinglePost } from '../../_api';
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { category, slug } = params;

  const post: Post = await getSinglePost(category, slug);
  const categoryCount = getCategoryCount(category, dev);

  if (post) {
    return {
      post,
      categoryCount,
      // this was in stuff:
      title: post.seoTitle || post.title,
      description: post.description || post.title,
    };
  }

  throw error(404, 'some error in +page.server.ts');
};
