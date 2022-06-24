// idea and help from:
// https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog
// https://www.aaronhubbard.dev/blogposts/text-from-module
// https://github.com/mattjennings/sveltekit-blog-template
import type { Post } from '$lib/utils/types';

export async function getAllPosts(isDev: boolean, category?: string) {
  const allPostFiles = import.meta.glob('../posts/**/*.md');

  const iterablePostFiles = Object.entries(allPostFiles);

  // shape each file’s data, so it’s easier to work with on the frontend
  const allPosts: Post[] = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      const { metadata } = await resolver();

      // try to get the category and slug from file structure (take out ../posts/ and /index.md)
      // TODO maybe make it more resilient with regex or something?
      const [cat, slug] = path.slice(9, -3).split('/');
      
      return { ...metadata, category: cat, slug };
    })
  );

  // sort by date here
  let posts = allPosts.sort((a, b) => {
    return new Date(b.date) < new Date(a.date) ? -1 : 1;
  });

  if (!isDev) {
    posts = posts.filter((post) => post.status === 'published');
  }

  // filter by category
  if (category) {
    posts = posts.filter((post) => post.category === category);
  }

  return posts;
}

export const getSinglePost = async (category: string, slug: string) => {
  const allPostFiles = import.meta.glob('../posts/**/*.md');

  // try to get the single post
  const postResolver = allPostFiles[`../posts/${category}/${slug}.md`];
  if (!postResolver) return;

  const resolvedPost = await postResolver();

  const { metadata } = resolvedPost;
  const { html: content } = resolvedPost.default.render();

  return { ...metadata, content, category, slug };
};
