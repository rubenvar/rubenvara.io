<script lang="ts">
  import { dev } from '$app/env';

  // only used in listed post
  // listed posts appear in home, /blog, and /[category]
  import type { Post } from '$lib/utils/types';
  import dayjs from 'dayjs';
  import 'dayjs/locale/es.js';

  export let date: Post['date'];
  export let updated: Post['updated'] = undefined;
  export let category: Post['category'];
  export let inCategoryPage: boolean = false; // is the listsed post it in category page?

  const dateFormat = dev ? 'D MMM YYYY' : 'MMMM YYYY';
</script>

<p class="post-meta">
  <span>
    <time dateTime={updated || date}>
      {dayjs(updated || date)
        .locale('es')
        .format(dateFormat)}
    </time>
    {#if updated}
      (actualizado)
    {/if}
  </span>
  <span>
    {#if !inCategoryPage}
      #{category.toLowerCase()}
    {/if}
  </span>
</p>

<style lang="scss">
  .post-meta {
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--gap40);
    color: var(--grey500);
    font-size: var(--fz30);
  }
</style>
