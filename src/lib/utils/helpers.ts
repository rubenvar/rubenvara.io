import wordCounter from 'word-counting';
import type { CountedLink, CountWords, PostWithRenderedContent } from './types';

const linkRegex = /href="([^"]+)"/g;

// TODO improve this function, maybe a regex, it's not really that resilient... 😅
const isExternal = (l: string) =>
  l.includes('https://') || l.includes('http://');

// helpers used only in /blog +page.server.ts (for now)
// to show data about each post, only in dev (for now)

export function countWords(posts: PostWithRenderedContent[]): CountWords[] {
  return posts.map((post) => {
    const { wordsCount: wordCount } = wordCounter(post.content || '', {
      isHtml: true,
    });
    // harcoded words per minute:
    // https://clbe.wordpress.com/2019/07/09/cuantas-palabras-por-minuto-lee-un-adulto/
    const minutes = wordCount / 200;

    return { slug: `/${post.category}/${post.slug}`, wordCount, minutes };
  });
}

// count links per post
export function countLinks(posts: PostWithRenderedContent[]): CountedLink[] {
  return posts
    .map((post) => {
      // find links in html
      const matches = [...(post.content || '').matchAll(linkRegex)];
      const links = matches.map((match) => match[1]);

      // return links data to build table in /blog, in dev
      return {
        slug: `/${post.category}/${post.slug}`,
        total: links.length,
        internal: links.filter((l) => !isExternal(l)),
        internalTotal: links.filter((l) => !isExternal(l)).length,
        external: links.filter((l) => isExternal(l)),
        externalTotal: links.filter((l) => isExternal(l)).length,
      };
    })
    .sort((a, b) => b.internalTotal - a.internalTotal);
}
