<script>
  import { page } from '$app/stores';
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
</script>

<!-- <SkipLink /> -->

<TopBar />
{#if $page.url.pathname !== '/'}<Header />{/if}
<main>
  <slot />
</main>
<Footer />

<style lang="scss">
  main {
    position: relative;
    display: grid;
    grid-template-columns:
      1fr min(var(--maxWidth), calc(100% - 40px))
      1fr;
    grid-column-gap: var(--gap50);
    > * {
      grid-column: 2;
    }
    margin-top: var(--gap60);
  }
</style>
