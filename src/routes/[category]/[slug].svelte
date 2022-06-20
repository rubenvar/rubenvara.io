<script lang="ts">
  import type { Post } from '$lib/utils/types';
  import { dev } from '$app/env';
  import PostMeta from '$lib/components/PostMeta.svelte';
  import TwitterBox from '$lib/components/TwitterBox.svelte';

  export let post: Post;
</script>

<svelte:head>
  {#if post}
    <title>{post.seoTitle}</title>
    <meta name="description" content={post.description || post.title} />
  {/if}
</svelte:head>
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
    margin-bottom: var(--gap70);
    h1 {
      color: var(--primary500);
    }
  }
</style>
