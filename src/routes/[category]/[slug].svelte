<script context="module" lang="ts">
  export const load: Load = async ({ fetch, params }) => {
    const data = await fetch(`/${params.category}/${params.slug}/__data.json`);
    const json = await data.json();
    const post: Post = json.post;

    if (post) {
      return {
        status: data.status,
        props: {
          post,
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
</script>

<!-- <svelte:head>
  {#if post}
    <title>{post.seoTitle || post.title}</title>
    <meta name="description" content={post.description || post.title} />
  {/if}
</svelte:head> -->

{#if post}
  <header>
    <h1>
      {post.title}{#if dev && post.status === 'draft'}{' '}(draft){/if}
    </h1>
    <PostMeta
      inFullPost={true}
      date={post.updated || post.date}
      category={post.category}
    />
  </header>

  {@html post.content}

  <TwitterBox twitter={post.twitter} />

  <PostMeta
    inBottom={true}
    inFullPost={true}
    date={post.updated || post.date}
    category={post.category}
  />
{:else}
  <p>algo no va bien</p>
{/if}
<!-- <TwitterBox twitter={frontmatter.twitter} /> -->

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
