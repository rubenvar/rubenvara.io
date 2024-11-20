<script lang="ts">
  import { page } from '$app/stores';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import categoriesMeta from '$lib/assets/categories.json';

  let { data } = $props();

  let total = $derived(data.posts.length);

  const { category } = $page.params;
  const categoryMeta = categoriesMeta.find((c) => c.slug === category);
</script>

<header>
  <h1>{total} artículo{total !== 1 ? 's' : ''} en <span>`{category}`</span></h1>
  {#if categoryMeta}<div class="intro">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html categoryMeta.content}
    </div>{/if}
</header>

{#each data.posts as post}
  <ListedPost {post} inCategoryPage />
{/each}

<style>
  header {
    margin: 0 0 var(--gap100);

    .intro {
      color: var(--grey600);
      margin: 0 0 var(--gap50);
      transition: color 0.5s;
      &:last-child {
        margin-bottom: 0;
      }
    }
    &:hover {
      .intro {
        color: var(--grey700);
      }
    }
  }

  h1 {
    font-size: var(--fz80);
    span {
      display: inline-block;
      background: var(--grey100);
      border-radius: 6px;
      padding: 2px var(--gap10);
    }
  }
</style>
