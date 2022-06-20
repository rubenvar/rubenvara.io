export type Post = {
  // required on post create
  title: string;
  date: string;
  status: 'published' | 'draft';
  // from file system
  slug: string;
  category: string;
  content: string;
  // optional
  seoTitle?: string;
  updated?: string;
  description?: string;
}
