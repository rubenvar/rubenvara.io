import { getAllPosts } from './_api';

/** @type {import('./__types/index').RequestHandler} */
export async function get() {
  // get all post metadata using helper function, don't get the content
  const posts = await getAllPosts(false);

  if (posts?.length) {
    return {
      body: { posts },
    };
  }

  return {
    status: 500,
  };
}
