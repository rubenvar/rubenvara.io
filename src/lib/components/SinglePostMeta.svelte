<script lang="ts">
  // only used in single post top and bottom
  import type { Post } from '$lib/utils/types';
  import dayjs from 'dayjs';
  import 'dayjs/locale/es.js';

  export let date: Post['date'];
  export let updated: Post['updated'] = undefined;
  export let category: Post['category'];
  export let categoryCount = 0; // how many posts in category

  export let atBottom = false; // is it at single post bottom?

  const dateFormat = 'D [de] MMMM, YYYY';
</script>

<p class="post-meta" class:at-bottom={atBottom}>
  <span>
    {#if updated}
      actualizado el
      <time dateTime={updated}>
        {dayjs(updated).locale('es').format(dateFormat)}
      </time>
    {:else}
      <time dateTime={date}>
        {dayjs(date).locale('es').format(dateFormat)}
      </time>
    {/if}
    {#if updated && atBottom}
      <br />
      publicación inicial el
      <time dateTime={date}>
        {dayjs(date).locale('es').format(dateFormat)}
      </time>
    {/if}
  </span>
  <span>
    {#if categoryCount > 2}
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
    &.at-bottom {
      margin-top: var(--gap110);
    }
    a {
      color: var(--grey700);
      &:hover {
        color: var(--primary400);
      }
    }
  }
</style>
