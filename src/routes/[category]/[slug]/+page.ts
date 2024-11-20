import type { PageLoad } from './$types';
import { getCategoryCount, getSinglePost } from '$lib/utils/api';
import { countWords } from '$lib/utils/helpers';
import { siteUrl } from '$lib/config';

// cannot be a server page as we are directly returning a non-serializable function (the component)
export const load: PageLoad = async ({ params }) => {
  const post = await getSinglePost(params.category, params.slug);

  if (post) {
    const categoryCount = getCategoryCount(params.category);

    return {
      post,
      categoryCount,
      // for SEO tags:
      title: post.seoTitle || post.title,
      description: post.description || post.title,
      // JSON-LD schema:
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        name: post.title,
        description: post.description,
        author: {
          '@id': `${siteUrl}/#/schema/person/Person`,
        },
        datePublished: post.date,
        dateModified: post.updated,
        url: `https://rubenvara.io/${post.category}/${post.slug}`,
        keywords: [post.category, 'Rubén Vara'],
        isPartOf: {
          '@type': 'Blog',
          name: 'rubenvara.io',
          publisher: { '@type': 'Person', name: 'Rubén Vara' },
        },
        wordCount: countWords([post])[0].wordCount.toString(),
      },
    };
  }
};
