import { getAllPosts } from '$lib/utils/blog';

export async function get() {
  // get all post metadata, don't get the content
  const posts = await getAllPosts(false);
  
  return { 
    body: JSON.stringify({ posts }),
  };
}
