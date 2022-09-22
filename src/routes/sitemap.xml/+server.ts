import { dev } from '$app/environment';
import { getAllCategories, getAllPosts } from '$lib/utils/postApi';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const domain = url.origin;

  // get metadata from now page md
  const lastmodObject = import.meta.glob('./now.md', { eager: true })[
    './now.md'
  ];

  const nowPage: {
    slug: string;
    lastmod: string;
  } = {
    slug: 'now',
    lastmod: lastmodObject.metadata.updated,
  };

  // get slugs and lastest post's date per category
  const categories = (await getAllCategories(dev)).map(
    ({ category, lastmod }) => ({ slug: category, lastmod })
  );
  // console.log(categories);

  // get category, slug, and last date for posts
  const posts = (await getAllPosts(dev)).map((post) => ({
    slug: `${post.category}/${post.slug}`,
    lastmod: post.updated || post.date,
  }));

  // 3 hardcoded pages. get latest post's date for /blog
  const hardcoded = [
    { slug: '' },
    nowPage,
    {
      slug: 'blog',
      lastmod: categories.reduce((acc, curr) => {
        if (curr.lastmod > acc) return curr.lastmod;
        return acc;
      }, ''),
    },
  ];

  // all routes together
  const routes: { slug: string; lastmod?: string }[] = hardcoded
    .concat(categories)
    .concat(posts);

  // build the content
  const content = routes
    .map(
      (route) => `<url>
        <loc>${domain}/${route.slug}/</loc>${
        route.lastmod ? `<lastmod>${route.lastmod.split('T')[0]}</lastmod>` : ''
      }
      </url>`
    )
    .join('');

  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  };

  // throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        ${content}
      </urlset>`.trim(),
    { headers: headers }
  );
  // return {
  //   headers,
  //   body: `<?xml version="1.0" encoding="UTF-8" ?>
  //     <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  //       ${content}
  //     </urlset>`.trim(),
  // };
};
