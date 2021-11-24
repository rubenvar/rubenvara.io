<script>
  import "@fontsource/mansalva";
  import "@fontsource/dm-sans";
  import "@fontsource/baloo-2";
  import "@fontsource/victor-mono";
  import "normalize.css";
  import "../app.scss";

  import TopBar from "$lib/TopBar.svelte";
  import Footer from "$lib/Footer.svelte";
</script>

<!-- <SkipLink /> -->
<TopBar />
<!-- <Header /> -->
<main>
  <slot />
</main>
<Footer />

<style lang="scss">
  main {
    display: grid;
    grid-template-columns:
      1fr min(var(--maxWidth), calc(100% - 40px))
      1fr;
    grid-column-gap: var(--gap50);
    > * {
      grid-column: 2;
    }
    /* .gatsby-highlight, */
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
