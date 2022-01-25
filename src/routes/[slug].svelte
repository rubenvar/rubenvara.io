<script context="module">
  export async function load({ params, fetch }) {
    const res = await fetch(`/${params.slug}.json`);

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
  import PostMeta from "$lib/PostMeta.svelte";

  export let post;

  // const seoTitle = post.seoTitle || post.title;
  // const metaDescription = post.description || post.title;
</script>

<header>
  <h1>{post.title}</h1>
  <PostMeta
    inFullPost={true}
    date={post.updated || post.date}
    categories={post.categories}
  />
</header>

{@html post.content}

<PostMeta
  inBottom={true}
  inFullPost={true}
  date={post.updated || post.date}
  categories={post.categories}
/>

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
