import { dev } from '$app/env';
import type { RequestHandler } from './__types';
import { getAllPosts } from '../_api';
import {categories} from '$lib/assets/categories';

export const get: RequestHandler = async ({ params }) => {
  const { category } = params;
  const posts = await getAllPosts(dev, category);
  const description = categories.find(cat => cat.name === category)?.description;

  if (posts.length) {
    return {
      body: { posts, description },
    };
  }

  return {
    status: 404,
  };
};
