<script>
  import PostMeta from "./PostMeta.svelte";

  export let post;
</script>

<article>
  <h2>
    <a href={post.slug}>{post.title}</a>
  </h2>
  {#if post.description}
    <p class="description">{post.description}</p>
  {/if}
  <PostMeta date={post.updated || post.date} categories={post.categories} />
</article>

<style lang="scss">
  article {
    margin-bottom: var(--gap110);
  }
  h2 {
    font-weight: 500;
    font-size: var(--fontSize60);
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
    font-size: var(--fontSize30);
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
