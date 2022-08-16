<script lang="ts">
  import '@fontsource/mansalva';
  import '@fontsource/dm-sans';
  import '@fontsource/baloo-2';
  import '@fontsource/victor-mono';
  import 'normalize.css';
  import 'dracula-prism/dist/css/dracula-prism.css';

  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  import '../app.scss';
  import TopBar from '$lib/components/TopBar.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import PageTransition from '$lib/components/PageTransition.svelte';

  export let data: LayoutData;

  // for page transitions
  $: key = data.key;
</script>

<svelte:head>
  <!-- gets `stuff (deprecated, now "page.data")` from page.
    title and description are either defined here (above) by default, or on the specific route -->
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.description} />
  <link rel="canonical" href={$page.data.canonical} />
</svelte:head>

<PageTransition refresh={key}>
  <!-- <SkipLink /> -->
  <TopBar />

  {#if $page.url.pathname !== '/'}
    <Header />
  {/if}

  <main>
    <slot />
  </main>

  <Footer />
</PageTransition>

<style lang="scss">
  main {
    position: relative;
    display: grid;
    grid-template-columns:
      1fr min(var(--maxWidth), calc(100% - var(--gap50) * 2))
      1fr;
    grid-column-gap: var(--gap50);
    > * {
      grid-column: 2;
    }
    margin-top: var(--gap60);
  }
</style>
