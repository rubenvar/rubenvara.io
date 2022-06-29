<script context="module" lang="ts">
  export const load: Load = async ({ fetch, params }) => {
    const data = await fetch(`/${params.category}/${params.slug}/__data.json`);
    const json = await data.json();

    const post: Post = json.post;
    const categoryCount: number = json.categoryCount;

    if (post) {
      return {
        status: data.status,
        props: {
          post,
          categoryCount,
        },
        stuff: {
          title: post.seoTitle || post.title,
          description: post.description || post.title,
        },
      };
    }

    return {
      status: data.status,
    };
  };
</script>

<script lang="ts">
  import type { Post } from '$lib/utils/types';
  import { dev } from '$app/env';
  import PostMeta from '$lib/components/PostMeta.svelte';
  import TwitterBox from '$lib/components/TwitterBox.svelte';
  import type { Load } from './__types/[slug]';

  export let post: Post;
  export let categoryCount: number;
</script>

{#if post}
  <header>
    <h1>
      {post.title}{#if dev && post.status === 'draft'}{' '}(draft){/if}
    </h1>
    <PostMeta
      inFullPost={true}
      date={post.updated || post.date}
      category={post.category}
      {categoryCount}
    />
  </header>

  {@html post.content}

  <TwitterBox twitter={post.twitter} />

  <PostMeta
    inBottom={true}
    inFullPost={true}
    date={post.updated || post.date}
    category={post.category}
    {categoryCount}
  />
{:else}
  <p>algo no va bien</p>
{/if}

<!-- <PostNav prev={prev} next={next} /> -->
<style lang="scss">
  header {
    margin-top: var(--gap50);
    margin-bottom: var(--gap90);
    h1 {
      color: var(--primary600);
    }
  }
</style>
