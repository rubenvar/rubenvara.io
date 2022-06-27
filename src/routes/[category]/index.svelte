<script context="module" lang="ts">
  export const load: Load = async ({ fetch, params }) => {
    const data = await fetch(`/${params.category}/__data.json`);
    const json = await data.json();
    const posts: Post[] = json.posts;

    if (posts.length) {
      return {
        status: data.status,
        props: {
          posts,
        },
        stuff: {
          title: `Todos los artículos sobre ${params.category}`,
          description: `Mira ${posts.length} artículos detallados sobre ${params.category}: quédate por aquí y seguro que aprendes algo`,
        },
      };
    }

    return {
      status: data.status,
    };
  };
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import type { Post } from '$lib/utils/types';
  import type { Load } from './__types';

  export let posts: Post[];

  const total = posts.length;
  const { category } = $page.params;
</script>

<header>
  <h1>{total} artículo{total !== 1 ? 's' : ''} en <span>`{category}`</span></h1>
</header>

{#each posts as post}
  <ListedPost inCategoryPage {post} />
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
