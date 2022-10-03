<script lang="ts">
  import '@fontsource/mansalva';
  import '@fontsource/dm-sans';
  import '@fontsource/baloo-2';
  import '@fontsource/victor-mono';
  import 'normalize.css';
  import 'dracula-prism/dist/css/dracula-prism.min.css';

  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  import '../app.scss';
  import TopBar from '$lib/components/TopBar.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Analytics from '$lib/components/Analytics.svelte';
  import { browser, dev } from '$app/environment';

  export let data: LayoutData;

  // for page transitions
  $: key = data.key;

  // goatcounter analytics
  $: if (browser && window.goatcounter) {
    window.goatcounter.count({
      path: key,
      event: false,
    });
  }

  const config = '{"allow_local": true, "no_onload": true}';
</script>

<svelte:head>
  <!-- gets `stuff (deprecated, now "page.data")` from page.
    title and description are either defined here (in the load fn) by default, or on the specific route -->
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.description} />
  <link rel="canonical" href={$page.data.canonical} />
  <script
    data-goatcounter-settings={config}
    data-goatcounter="https://{dev ? 'rbn-dev' : 'rbn'}.goatcounter.com/count"
    async
    src="//gc.zgo.at/count.js"></script>
</svelte:head>

{#if !dev}
  <Analytics />
{/if}

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
