// idea and help from:
// https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog
// https://www.aaronhubbard.dev/blogposts/text-from-module
// https://github.com/mattjennings/sveltekit-blog-template
import { dev } from '$app/environment';
import type { Category, Post, PostMeta } from '$lib/utils/types';

// type generic for the response of import.meta.glob
type GlobResp = {
  default: {
    render: () => { html: string; css: { code: string }; head: string };
  };
  metadata: PostMeta;
};

interface Options {
  category?: string;
  take?: number;
}

export async function getAllPosts(options?: Options) {
  const category = options?.category;
  const take = options?.take;

  const allPostFiles = import.meta.glob<GlobResp>('../../posts/**/*.md');

  const iterablePostFiles = Object.entries(allPostFiles);

  // shape each file’s data, so it’s easier to work with on the frontend
  const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      // try to get the category and slug from file structure (take out ../posts/ and .md)
      // TODO maybe make it more resilient with regex or something?
      const [cat, slug] = path.slice(12, -3).split('/');

      const resolvedPost = await resolver();
      const { metadata } = resolvedPost;

      if (dev) {
        // if dev, get content for link counter
        const { html: content } = resolvedPost.default.render();
        // if dev, return post with content
        return { ...metadata, content, category: cat, slug };
      }

      return { ...metadata, category: cat, slug };
    })
  );

  let posts = [...allPosts];

  if (!dev) {
    // in prod, only 'published' posts
    posts = posts.filter((post) => post.status === 'published');
  }

  // filter by category if there is one
  if (category) {
    posts = posts.filter((post) => post.category === category);
  }

  // sort by date here
  posts = posts.sort((a, b) => {
    const dateA = a.updated || a.date;
    const dateB = b.updated || b.date;

    return new Date(dateB) < new Date(dateA) ? -1 : 1;
  });

  // return a number of posts
  if (take) {
    posts = posts.slice(0, take);
  }

  return posts;
}

// ? returns an array of objs: category, count, lastmod
// used in sitemap?
export async function getAllCategories(): Promise<Category[]> {
  // start by getting all posts resolved, only the metadata field
  const allPostFiles = import.meta.glob<PostMeta>('../../posts/**/*.md', {
    import: 'metadata',
    eager: true,
  });

  // return category from slug and metadata
  let allPosts = Object.keys(allPostFiles).map((key) => {
    return {
      category: key.slice(12).split('/')[0],
      ...allPostFiles[key],
    };
  });

  // if prod, filter out draft posts
  if (!dev) {
    // in prod, only 'published' posts
    allPosts = allPosts.filter((post) => post.status === 'published');
  }

  // get list of all categories as array of strings
  const allCategories = allPosts.map((post) => ({ category: post.category }));

  // get post count per category
  const categoriesCounted: { [key: string]: number } = {};
  allCategories.forEach((obj) => {
    categoriesCounted[obj.category] =
      (categoriesCounted[obj.category] || 0) + 1;
  });

  // build an object per category: name, count, lastmod date from its posts
  const categoriesArray = Object.keys(categoriesCounted).map(async (key) => {
    // get all posts for category
    const posts = await getAllPosts({ category: key });
    // try to get latest date from all posts
    const latestDate = posts.reduce((acc: string, curr) => {
      const date = curr.updated || curr.date;
      if (date > acc) return date;
      return acc;
    }, '');

    return {
      category: key,
      count: categoriesCounted[key],
      lastmod: latestDate,
    };
  });

  return await Promise.all(categoriesArray);
}

// ? returns number of posts in a category
export function getCategoryCount(category: string) {
  // start by getting all posts resolved, but only import the metadata field
  const allPostFiles = import.meta.glob<PostMeta>('../../posts/**/*.md', {
    import: 'metadata',
    eager: true,
  });

  // return category from slug + status from metadata, and filter by category
  let allPostsInCategory = Object.keys(allPostFiles)
    .map((key) => {
      return {
        category: key.slice(12).split('/')[0],
        status: allPostFiles[key].status,
      };
    })
    .filter((post) => post.category === category);

  // if prod, filter out draft posts
  if (!dev) {
    // in prod, only 'published' posts
    allPostsInCategory = allPostsInCategory.filter(
      (post) => post.status === 'published'
    );
  }

  return allPostsInCategory.length;
}

// gets all posts that have a series name in their metadata
function getPostsInSeries(seriesName: string): Post[] {
  const allPostFiles = import.meta.glob<GlobResp>('../../posts/**/*.md', {
    eager: true,
  });

  let postArray = Object.keys(allPostFiles).map((key) => {
    const [category, slug] = key.slice(12, -3).split('/');
    return {
      category,
      slug,
      ...allPostFiles[key].metadata,
    };
  });

  if (!dev) {
    // in prod, only 'published' posts
    postArray = postArray.filter((post) => post.status === 'published');
  }

  return postArray.filter((p) => p.series?.name === seriesName);
}

export async function getSinglePost(
  category: string,
  slug: string
): Promise<Post | undefined> {
  const allPostFiles = import.meta.glob<GlobResp>('../../posts/**/*.md');

  // try to get the single post
  const postResolver = allPostFiles[`../../posts/${category}/${slug}.md`];
  if (!postResolver) return;

  const resolvedPost = await postResolver();

  const { metadata } = resolvedPost;
  const { html: content } = resolvedPost.default.render();

  // metadata of posts in a series
  let postsInSeries: Post[] | undefined;

  // if post is in a series:
  if (metadata.series?.index) {
    postsInSeries = getPostsInSeries(metadata.series.name);
  }

  return { ...metadata, content, category, slug, postsInSeries };
}
