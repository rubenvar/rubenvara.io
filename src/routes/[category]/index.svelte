<script lang="ts">
  import { page } from '$app/stores';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import type { Post } from '$lib/utils/types';

  export let posts: Post[];

  const { category } = $page.params;
</script>

<header>
  <h1>Todos los artículos en <span>`{category}`</span></h1>
</header>

{#each posts as post}
  <ListedPost {post} />
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
