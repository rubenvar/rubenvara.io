<script lang="ts">
  import { dev } from '$app/environment';
  import SinglePostMeta from '$lib/components/SinglePostMeta.svelte';
  import TwitterBox from '$lib/components/TwitterBox.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: post = data.post;
  $: categoryCount = data.categoryCount; // used in post meta to show link to category or only text
</script>

{#if post}
  <header>
    <h1>
      {post.title}{#if dev && post.status === 'draft'}{' '}(draft){/if}
    </h1>
    <SinglePostMeta
      date={post.date}
      updated={post.updated}
      category={post.category}
      {categoryCount}
    />
  </header>

  {@html post.content}

  <TwitterBox twitter={post.twitter} />

  <SinglePostMeta
    atBottom={true}
    date={post.date}
    updated={post.updated}
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
