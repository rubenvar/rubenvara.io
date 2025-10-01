import { getAllCategories, getAllPosts } from '$lib/utils/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const domain = url.origin;

    // get metadata from now page md
    const lastmodObject = Object.values(
        import.meta.glob<{ updated: string }>('../now/*.md', {
            import: 'metadata',
            eager: true,
        })
    )[0];

    const nowPage = {
        slug: 'now',
        lastmod: lastmodObject.updated,
    };

    // get slugs and lastest post's date per category
    const categories = (await getAllCategories()).map(({ category, lastmod }) => ({ slug: category, lastmod }));

    // get category, slug, and last date for posts
    const posts = (await getAllPosts()).map((post) => ({
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
    const routes: { slug: string; lastmod?: string }[] = hardcoded.concat(categories).concat(posts);

    // build the content
    const content = routes
        .map(
            (route) => `<url>
        <loc>${domain}/${route.slug}/</loc>${route.lastmod ? `<lastmod>${route.lastmod.split('T')[0]}</lastmod>` : ''}
      </url>`
        )
        .join('');

    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml',
    };

    return new Response(
        `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        ${content}
      </urlset>`.trim(),
        { headers: headers }
    );
};
