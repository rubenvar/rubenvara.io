import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { getAllPosts } from '$lib/utils/postApi';

export const load: PageServerLoad = async () => {
  const latestPosts = await getAllPosts(dev, { take: 3 });

  if (latestPosts.length) {
    return { homePosts: latestPosts };
  }

  throw error(404, 'some error in main +page.ts');
};
