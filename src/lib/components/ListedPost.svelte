<script lang="ts">
  import { dev } from '$app/env';
  import PostMeta from './PostMeta.svelte';
  import type { Post } from '$lib/utils/types';

  export let post: Post;
  export let inCategoryPage = false;
</script>

<article>
  <a href="/{post.category}/{post.slug}">
    <div>
      <h2>
        {post.title}
      </h2>
      {#if post.description}
        <p class="description">{post.description}</p>
      {/if}
      {#if dev && post.status === 'draft'}
        <p class="description">(draft)</p>
      {/if}
      <PostMeta
        date={post.updated || post.date}
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
</style>
