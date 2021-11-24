<script>
  import dayjs from "dayjs";
  import "dayjs/locale/es";
  export let post;
</script>

<article>
  <h2>
    <a href={post.slug}>{post.title}</a>
  </h2>
  {#if post.description}
    <p class="description">{post.description}</p>
  {/if}
  <p class="post-meta">
    <span>
      <time dateTime={post.date}
        >{dayjs(post.date).locale("es").format("MMMM YYYY")}</time
      >
    </span>
    <span class="cats">
      {#each post.categories as cat}
        <span>#{cat.toLowerCase()}</span>
      {/each}
    </span>
  </p>
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
  .post-meta {
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--gap40);
    color: var(--grey500);
    font-size: var(--fontSize30);
    .cats {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      span {
        margin: 0 var(--gap20) 0 0;
        /* a {
          color: var(--grey500);
          text-decoration: none;
          &:hover {
            color: var(--primary500);
          }
        } */
      }
    }
  }
</style>
