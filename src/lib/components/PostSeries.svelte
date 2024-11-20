<script lang="ts">
  import type { Post } from '$lib/utils/types';

  interface Props {
    currentPostIndex: number;
    seriesName: string;
    postsInSeries: Post['postsInSeries'];
  }

  let { currentPostIndex, seriesName, postsInSeries }: Props = $props();

  const allPosts = postsInSeries?.sort(
    (a, b) => (a.series?.index || 0) - (b.series?.index || 0)
  );
</script>

{#if allPosts?.length}
  <h2>La serie completa</h2>
  {#if seriesName === 'react-query-tkdodo'}
    <p>
      Este post es parte de la serie <span>React-Query por Tkdodo</span> que he traducido
      desde su blog. Mira todos los artículos:
    </p>
  {/if}
  <div class="series">
    <ol>
      {#each allPosts as post}
        {#if post.series?.index === currentPostIndex}
          <li>{post.title}</li>
        {:else}
          <li>
            <a href="/{post.category}/{post.slug}">
              {post.title}
            </a>
          </li>
        {/if}
      {/each}
    </ol>
  </div>
{/if}

<style>
  h2 {
    color: var(--grey700);
  }
  p {
    color: var(--grey700);

    span {
      color: var(--grey900);
    }
  }
</style>
