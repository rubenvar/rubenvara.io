<script lang="ts">
  // import HomeEnglish from '$lib/components/home/HomeEnglish.svelte';
  import Header from '$lib/components/home/Header.svelte';
  import HomeSpanish from '$lib/components/home/HomeSpanish.svelte';
  import type { Post } from '$lib/utils/types';
  import { latestPosts } from '$lib/stores/latestPosts';

  export let homePosts: Post[];
  $: if (homePosts) {
    latestPosts.set(homePosts);
  }
</script>

<Header />
<HomeSpanish />
