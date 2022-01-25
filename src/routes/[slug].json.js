import { getSinglePost } from '$lib/utils/blog';

export async function get({ params }) {
  const { slug } = params;

  const post = await getSinglePost(slug, true);

  return {
    body: JSON.stringify({ post }),
  };
}
