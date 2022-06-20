<script lang="ts">
  import { dev } from '$app/env';
  import PostMeta from './PostMeta.svelte';
  import type { Post } from '$lib/utils/types';

  export let post: Post;
</script>

<article>
  <h2>
    <a href="/{post.category}/{post.slug}">{post.title}</a>
  </h2>
  {#if post.description}
    <p class="description">{post.description}</p>
  {/if}
  {#if dev && post.status === 'draft'}
    <p class="description">(draft)</p>
  {/if}
  <PostMeta date={post.updated || post.date} category={post.category} />
</article>

<style lang="scss">
  article {
    margin-bottom: var(--gap110);
  }
  h2 {
    font-weight: 500;
    font-size: var(--fz60);
    margin-top: 0;
    margin-bottom: var(--gap30);
    a {
      text-decoration: none;
      color: var(--primary600);
      &:hover {
        color: var(--primary900);
      }
    }
  }
  .description {
    color: var(--grey700);
    font-size: var(--fz30);
    margin: 0;
    margin-bottom: var(--gap30);
    line-height: 1.35rem;
    /*
    maybe for a button or a 'mas info' link
    a {
      color: var(--grey800);
      text-decoration: none;
      &:hover {
        color: var(--primary600);
      }
    } */
  }
</style>
