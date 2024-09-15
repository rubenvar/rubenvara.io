import type { themes } from '$lib/config';

export type PostMeta = {
  // required on md file creation
  title: string;
  date: string;
  status: 'published' | 'draft';
  // optional
  seoTitle?: string;
  updated?: string;
  description?: string;
  twitter?: string;
  series?: {
    name: string;
    index: number;
  };
  original?: {
    title: string;
    url: string;
  };
};

export type Post = PostMeta & {
  // from file system
  slug: string;
  category: string;
  content?: string;
  postsInSeries?: Post[] | undefined;
};

export type CountedLink = {
  slug: string;
  total: number;
  internal: string[];
  internalTotal: number;
  external: string[];
  externalTotal: number;
};

export type CountWords = {
  slug: string;
  wordCount: number;
  minutes: number;
};

export type Category = {
  category: string;
  count: number;
  lastmod: string;
};

export type Theme = (typeof themes)[number];
