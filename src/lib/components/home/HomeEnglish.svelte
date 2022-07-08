<script lang="ts">
  import HomeText from '$lib/components/home/HomeText.svelte';
  import rvImage from '$lib/assets/images/rv.webp';
  import LatestPosts from './LatestPosts.svelte';
</script>

<h2>I create fast, natural, modern web apps</h2>
<p>
  I also love rock climbing, reading, drawing, and working on (even) more online
  projects.
</p>
<img src={rvImage} alt="Rubén Vara" width={300} height={300} />

<h2 class="section-title">Durante la década pasada...</h2>
<HomeText />

<LatestPosts />

<style lang="scss">
  h2 {
    margin-top: var(--gap50);
    font-weight: 400;
    &.section-title {
      margin-top: var(--gap100);
      font-style: italic;
      font-family: var(--specialFont);
      font-weight: 700;
      font-size: var(--fz70);
    }
  }
  img {
    border: 5px solid var(--grey700);
    border-radius: 50%;
  }
</style>
