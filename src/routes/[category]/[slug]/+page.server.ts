import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryCount, getSinglePost } from '$lib/utils/postApi';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ params }) => {
  const { category, slug } = params;

  const post = await getSinglePost(category, slug);
  
  if (post) {
    const categoryCount = getCategoryCount(category, dev);
    
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
