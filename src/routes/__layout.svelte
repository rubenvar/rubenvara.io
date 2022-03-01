<script>
  import { page } from "$app/stores";
  import "@fontsource/mansalva";
  import "@fontsource/dm-sans";
  import "@fontsource/baloo-2";
  import "@fontsource/victor-mono";
  import "normalize.css";
  import "dracula-prism/dist/css/dracula-prism.css";

  import "../app.scss";
  import TopBar from "$lib/TopBar.svelte";
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
  // import Triangles from "$lib/Triangles.svelte";
</script>

<!-- <SkipLink /> -->
<TopBar />
<!-- <Triangles /> -->
{#if $page.url.pathname !== "/"}<Header />{/if}
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
    /* .full-bleed {
      width: 100%;
      grid-column: 1 / -1;
    } */
    margin-top: var(--gap60);
    /* .gatsby-highlight pre code {
    display: block;
    width: 100%;
    max-width: var(--maxCodeWidth);
    margin: 0 auto;
  } */
  }
</style>
