import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/utils/api';

export const load: PageServerLoad = async () => {
  const latestPosts = await getAllPosts({ take: 3 });

  if (latestPosts.length) {
    return { homePosts: latestPosts };
  }

  error(404, 'some error in main +page.ts');
};
