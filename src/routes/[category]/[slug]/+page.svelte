<script lang="ts">
  import { dev } from '$app/environment';
  import PostOriginal from '$lib/components/PostOriginal.svelte';
  import PostSeries from '$lib/components/PostSeries.svelte';
  import SinglePostMeta from '$lib/components/SinglePostMeta.svelte';
  import TwitterBox from '$lib/components/TwitterBox.svelte';

  let { data } = $props();

  let post = $derived(data.post);
  let categoryCount = $derived(data.categoryCount); // used in post meta to show link to category or only text
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${JSON.stringify(data.schema)}${'<'}/script>`}
</svelte:head>

{#if post}
  <hgroup>
    <h1>
      {post.title}{#if dev && post.status === 'draft'}{' '}(draft){/if}
    </h1>
    <SinglePostMeta
      date={post.date}
      updated={post.updated}
      category={post.category}
      {categoryCount}
    />
  </hgroup>

  {#if post.original}
    <PostOriginal original={post.original} seriesName={post.series?.name} />
  {/if}

  <post.content />

  {#if post.series}
    <PostSeries
      currentPostIndex={post.series.index}
      seriesName={post.series.name}
      postsInSeries={post.postsInSeries}
    />
  {/if}

  <SinglePostMeta
    atBottom={true}
    date={post.date}
    updated={post.updated}
    category={post.category}
    {categoryCount}
  />

  <TwitterBox twitter={post.twitter} />

  <!-- <PostNav prev={prev} next={next} /> -->
{:else}
  <p>algo no va bien</p>
{/if}

<style>
  hgroup {
    margin-top: var(--gap50);
    margin-bottom: var(--gap90);
  }
  h1 {
    color: var(--primary600);
  }
</style>
