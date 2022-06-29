// idea and help from:
// https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog
// https://www.aaronhubbard.dev/blogposts/text-from-module
// https://github.com/mattjennings/sveltekit-blog-template
import type { Post } from '$lib/utils/types';

interface Options {
  category?: string;
  take?: number;
}

export async function getAllPosts(isDev: boolean, options?: Options) {
  const category = options?.category;
  const take = options?.take;

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
    const dateA = a.updated || a.date;
    const dateB = b.updated || b.date;

    return new Date(dateB) < new Date(dateA) ? -1 : 1;
  });

  if (!isDev) {
    // in prod, only 'published' posts
    posts = posts.filter((post) => post.status === 'published');
  }

  // filter by category
  if (category) {
    posts = posts.filter((post) => post.category === category);
  }

  // return a number of posts
  if (take) {
    posts = posts.slice(0, take);
  }

  return posts;
}

// ? unused for now until there are more posts
// export const getAllCategories = async (isDev = false) => {
//   // start by getting all posts resolved
//   const allPostFiles = import.meta.globEager('../posts/**/*.md');

//   // return category from slug and metadata
//   let allPosts = Object.keys(allPostFiles).map((key) => {
//     return {
//       category: key.slice(9).split('/')[0],
//       ...allPostFiles[key].metadata,
//     };
//   });

//   // if prod, filter out draft posts
//   if (!isDev) {
//     // in prod, only 'published' posts
//     allPosts = allPosts.filter((post) => post.status === 'published');
//   }

//   // get list of all categories as array of strings
//   const allCategories = allPosts.map((post) => post.category);

//   // get post count per category
//   const categoriesCounted: { [key: string]: number } = {};
//   allCategories.forEach((cat) => {
//     categoriesCounted[cat] = (categoriesCounted[cat] || 0) + 1;
//   });

//   return categoriesCounted;
// };

export const getSinglePost = async (category: string, slug: string) => {
  const allPostFiles = import.meta.glob('../posts/**/*.md');

  // try to get the single post
  const postResolver = allPostFiles[`../posts/${category}/${slug}.md`];
  if (!postResolver) return;

  const resolvedPost = await postResolver();

  const { metadata } = resolvedPost;
  const { html: content } = resolvedPost.default.render();

  // ? default.render() also returns a `css: { code: '', map: '' }` object.
  // ? it's the css introduced by the components imported in the md file
  // ? could I get that css into the page?

  return { ...metadata, content, category, slug };
};
