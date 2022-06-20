<script lang="ts">
  import { page } from '$app/stores';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import type { Post } from '$lib/utils/types';

  export let posts: Post[];

  const { category } = $page.params;
</script>

<h1>The <strong>{category}</strong> category page</h1>
<p>Here will list all posts in this category</p>

{#each posts as post}
  <ListedPost {post} />
{/each}
