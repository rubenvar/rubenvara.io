<script lang="ts">
  import type { Post } from '$lib/utils/types';

  import dayjs from 'dayjs';
  import 'dayjs/locale/es.js';

  export let inBottom = false;
  export let inFullPost = false;
  export let date: Post['date'];
  export let category: Post['category'];

  const dateFormat = inFullPost ? 'D [de] MMMM, YYYY' : 'MMMM YYYY';
</script>

<p class="post-meta" class:in-bottom={inBottom}>
  <span>
    <time dateTime={date}>
      {dayjs(date).locale('es').format(dateFormat)}
    </time>
  </span>
  <span>
    {#if inFullPost}
      <a href="/{category}">
        #{category.toLowerCase()}
      </a>
    {:else}
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
    &.in-bottom {
      margin-top: var(--gap90);
    }
  }
</style>
