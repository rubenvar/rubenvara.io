<script lang="ts">
  import { latestPosts } from '$lib/stores/latestPosts';
  import ListedPost from '$lib/components/ListedPost.svelte';
</script>

<h2 class="section-title">Posts más recientes</h2>
<p class="blog-intro">
  En mi blog escribo sobre JavaScript y otros inventos modernos. Mira los
  últimos artículos:
</p>
{#each $latestPosts as post}
  <ListedPost {post} />
{/each}
<p class="read-more"><a href="/blog">Ver todos ⟶</a></p>

<style lang="scss">
  .blog-intro {
    color: var(--grey600);
    margin: 0 0 var(--gap100);
    &:last-child {
      margin-bottom: 0;
    }
  }
  .read-more {
    text-align: right;
    a {
      text-decoration: none;
    }
  }
</style>
