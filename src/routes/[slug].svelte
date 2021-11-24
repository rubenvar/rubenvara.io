<script context="module">
  export async function load({ page, fetch }) {
    const res = await fetch(`/${page.params.slug}.json`);

    if (res.ok) {
      const data = await res.json();

      return {
        props: {
          post: data.post,
        },
      };
    }

    console.log("noooo");
    return {
      props: {
        post: { empty: true },
      },
    };
  }
</script>

<script>
  import dayjs from "dayjs";
  import "dayjs/locale/es";

  export let post;
</script>

<header>
  <h1>{post.title}</h1>
  <p class="post-meta">
    <span>
      <time dateTime={post.date}
        >{dayjs(post.date).locale("es").format("D [de] MMMM, YYYY")}</time
      >
    </span>
    <span class="cats">
      {#each post.categories as cat}
        <span>#{cat.toLowerCase()}</span>
      {/each}
    </span>
  </p>
</header>
{@html post.content}
<p class="post-meta in-bottom">
  <span>
    <time dateTime={post.date}
      >{dayjs(post.date).locale("es").format("D [de] MMMM, YYYY")}</time
    >
  </span>
  <span class="cats">
    {#each post.categories as cat}
      <span>#{cat.toLowerCase()}</span>
    {/each}
  </span>
</p>

<!-- <TwitterBox twitter={frontmatter.twitter} /> -->

<!-- <PostNav prev={prev} next={next} /> -->
<style lang="scss">
  header {
    margin-bottom: var(--gap70);
    h1 {
      color: var(--primary500);
    }
  }
  .post-meta {
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--gap40);
    color: var(--grey500);
    font-size: var(--fontSize30);
    &.in-bottom {
      margin-top: var(--gap90);
    }
    .cats {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      span {
        margin: 0 var(--gap20) 0 0;
      }
    }
  }
</style>
