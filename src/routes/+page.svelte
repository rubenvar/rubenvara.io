<script lang="ts">
  import Header from '$lib/components/home/Header.svelte';
  import HomeSpanish from '$lib/components/home/HomeSpanish.svelte';
  import { latestPosts } from '$lib/stores/latestPosts';
  import type { PageData } from './$types';

  export let data: PageData;

  $: homePosts = data.homePosts;

  $: if (homePosts) {
    latestPosts.set(homePosts);
  }
</script>

<Header />
<HomeSpanish />
