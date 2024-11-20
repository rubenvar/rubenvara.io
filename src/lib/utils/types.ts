import type { themes } from '$lib/config';
import type { Component } from 'svelte';

export interface MarkdownFileImport {
  default: Component;
  metadata: PostMeta;
};

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
  slug: string;
  category: string;
  content?: Component;
  postsInSeries?: Post[] | undefined;
};

export type PostWithRenderedContent = Omit<Post, 'content'> & {
  content?: string;
}

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
