import { getSinglePost } from './_api';

/** @type {import('./__types/index.json').RequestHandler} */
export async function get({ params }) {
  const { slug } = params;
  try {
    const post = await getSinglePost(slug, true);

    if (post) {
      return {
        status: 200,
        body: { post },
      };
    }

    console.log('no post 🤷‍♂️');
    return {
      status: 404,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      error: err,
    };
  }
}
