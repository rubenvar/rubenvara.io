<script context="module">
  /** @type {import('./__types/index').Load} */
  export async function load({ params, fetch }) {
    const { slug } = params;

    try {
      const res = await fetch(`/${slug}.json`);

      if (res.ok) {
        const data = await res.json();

        return {
          props: {
            post: data.post,
            page: (await import(`../../posts/${slug}/index.md`)).default,
          },
        };
      }

      console.error(`Something happened in /[slug].svelte with slug ${slug}`);
      return {
        status: 500,
        error: "something is wrong in load function",
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: err,
      };
    }
  }
</script>

<script>
  import { dev } from "$app/env";
  import PostMeta from "$lib/PostMeta.svelte";

  export let post;
  export let page;
  // const seoTitle = post.seoTitle || post.title;
  // const metaDescription = post.description || post.title;
</script>

{#if post}
  <header>
    <h1>
      {post.title}{#if dev && post.status === "draft"}{" "}(draft){/if}
    </h1>
    <PostMeta
      inFullPost={true}
      date={post.updated || post.date}
      categories={post.categories}
    />
  </header>

  <!-- {@html post.content} -->
  <svelte:component this={page} />

  <PostMeta
    inBottom={true}
    inFullPost={true}
    date={post.updated || post.date}
    categories={post.categories}
  />
{:else}
  <p>algo no va bien</p>
{/if}
<!-- <TwitterBox twitter={frontmatter.twitter} /> -->

<!-- <PostNav prev={prev} next={next} /> -->
<style lang="scss">
  header {
    margin-bottom: var(--gap70);
    h1 {
      color: var(--primary500);
    }
  }
</style>
