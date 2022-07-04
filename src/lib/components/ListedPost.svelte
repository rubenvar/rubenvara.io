<script lang="ts">
  import { dev } from '$app/env';
  import ListedPostMeta from './ListedPostMeta.svelte';
  import type { Post } from '$lib/utils/types';

  export let post: Post;
  export let inCategoryPage = false;
  export let index: number | undefined = undefined;
</script>

<article>
  <a href="/{post.category}/{post.slug}">
    <div>
      <h2>
        {#if dev && post.status === 'draft'}
          DRAFT
        {/if}
        {post.title}
      </h2>
      {#if post.description}
        <p class="description">{post.description}</p>
      {/if}
      {#if dev && post.status === 'draft' && !post.description}
        <p class="description">(draft)</p>
      {/if}
      {#if index}
        <span class="index">{index < 10 ? `0${index}` : index}</span>
      {/if}
      <ListedPostMeta
        date={post.date}
        updated={post.updated}
        category={post.category}
        {inCategoryPage}
      />
    </div>
  </a>
</article>

<style lang="scss">
  a {
    display: block;
    text-decoration: none;
    h2 {
      transition: color 0.3s;
      color: var(--primary600);
    }
    &:hover {
      h2 {
        color: var(--primary900);
      }
    }
  }
  article {
    margin-bottom: var(--gap110);
    position: relative;
  }
  h2 {
    font-weight: 500;
    font-size: var(--fz60);
    margin-top: 0;
    margin-bottom: var(--gap30);
  }
  .description {
    color: var(--grey700);
    font-size: var(--fz30);
    margin: 0;
    margin-bottom: var(--gap30);
    line-height: 1.35rem;
  }
  .index {
    font-family: var(--codeFont);
    position: absolute;
    top: calc(50% - var(--fz20) / 2);
    left: -36px;
    font-size: var(--fz20);
  }
</style>
