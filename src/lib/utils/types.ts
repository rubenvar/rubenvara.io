export type Post = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  description: string;
  status: 'published' | 'draft';
  category: string;
  content: string;
}
