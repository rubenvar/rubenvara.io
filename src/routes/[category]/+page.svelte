<script lang="ts">
  import { page } from '$app/stores';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: posts = data.posts;

  const total = posts.length;
  const { category } = $page.params;
</script>

<header>
  <h1>{total} artículo{total !== 1 ? 's' : ''} en <span>`{category}`</span></h1>
</header>

{#each posts as post}
  <ListedPost {post} inCategoryPage />
{/each}

<style lang="scss">
  header {
    margin: 0 0 var(--gap100);
    @media only screen and (min-width: 480) {
      margin-bottom: var(--gap100);
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
