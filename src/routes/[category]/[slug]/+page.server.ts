import { error } from '@sveltejs/kit';
import type { Post } from '$lib/utils/types';
import type { PageServerLoad } from './$types';
import { getCategoryCount, getSinglePost } from '$lib/utils/postApi';
import { dev } from '$app/environment';

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

  throw error(404, 'some error in [slug]/+page.server.ts');
};
