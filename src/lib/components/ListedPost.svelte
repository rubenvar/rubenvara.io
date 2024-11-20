<script lang="ts">
  import { dev } from '$app/environment';
  import ListedPostMeta from './ListedPostMeta.svelte';
  import type { Post } from '$lib/utils/types';

  interface Props {
    post: Post;
    inCategoryPage?: boolean;
    index?: number | undefined;
  }

  let { post, inCategoryPage = false, index = undefined }: Props = $props();
</script>

<article>
  <a href="/{post.category}/{post.slug}">
    <div>
      <h2>
        {#if dev && post.status === 'draft'}Draft:
        {/if}
        {post.title}
      </h2>
      {#if post.description}
        <p class="description">{post.description}</p>
      {/if}
      {#if dev && post.status === 'draft' && !post.description}
        <p class="description">
          Draft: Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Aspernatur facilis, doloremque repellendus culpa, illum enim aliquid,
          maxime fugit amet
        </p>
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

<style>
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
    font-weight: 430;
    font-size: var(--fz70);
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
