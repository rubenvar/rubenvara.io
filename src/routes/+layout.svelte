<script context="module" lang="ts">
  export const load: Load = ({ url }) => {
    return {
      props: {
        key: url.pathname,
      },
      stuff: {
        canonical: `${url.origin}${url.pathname}`,
        title:
          'Rubén Vara ~ Mi Blog sobre Javascript, Desarrollo Web, y Otras Historias',
        description:
          'Web Personal: Qué hago ahora, mi blog sobre desarrollo web y Javascript, mi estilo de vida, y mi primer gran viaje. Un poco de todo',
      },
    };
  };
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import type { Load } from './__types';
  import '@fontsource/mansalva';
  import '@fontsource/dm-sans';
  import '@fontsource/baloo-2';
  import '@fontsource/victor-mono';
  import 'normalize.css';
  import 'dracula-prism/dist/css/dracula-prism.css';

  import '../app.scss';
  import TopBar from '$lib/components/TopBar.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import PageTransition from '$lib/components/PageTransition.svelte';

  // for page transitions
  export let key: string;
</script>

<svelte:head>
  <!-- gets `stuff` from page.
    title and description are either defined here (above) by default, or on the specific route -->
  <title>{$page.stuff.title}</title>
  <meta name="description" content={$page.stuff.description} />
  <link rel="canonical" href={$page.stuff.canonical} />
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
