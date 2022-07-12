<script context="module" lang="ts">
  export const load: Load = async ({ fetch }) => {
    const data = await fetch('/blog/__data.json');
    const json = await data.json();
    const posts: Post[] = json.posts;
    const counted: CountedLink[] = json.counted;
    const words: CountWords[] = json.words;
    const categories: Category[] = json.categories;

    if (posts.length) {
      return {
        status: data.status,
        props: {
          posts,
          counted,
          words,
          categories,
        },
        stuff: {
          title: `Mi blog sobre JavaScript y otras tecnologías: ${posts.length} artículos detallados`,
          description: `Dicen que no sabes lo que sabes hasta que intentas enseñarlo, así que en eso estamos: Escribo sobre JavaScript y desarrollo web en español`,
        },
      };
    }

    return {
      status: data.status,
    };
  };
</script>

<script lang="ts">
  import type { Load } from './__types';
  import type {
    Category,
    CountedLink,
    CountWords,
    Post,
  } from '$lib/utils/types';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import { dev } from '$app/env';
  import SEOData from '$lib/components/SEOData.svelte';

  export let posts: Post[];
  export let counted: CountedLink[];
  export let words: CountWords[];
  export let categories: Category[];
</script>

<header>
  <p>
    Dicen que no sabes lo que sabes hasta que intentas enseñarlo, así que en eso
    estamos:
  </p>
  <p>
    Escribo sobre desarrollo web en español pero me falta vocabulario, porque
    todo lo que sé lo he aprendido en inglés.
  </p>
  <p>
    Si te quedas por aquí seguro que aprendes algo nuevo sobre JavaScript. Sobre
    todo, <span class="emphasis emphasis-js">JavaScript</span>.
  </p>

  {#if dev}
    <ul class="stats">
      <li>total: {posts.length}</li>
      <li>
        draft: {posts.filter((post) => post.status !== 'published').length}
      </li>
      <li>-</li>
      {#each categories as cat}
        <li><a href="/{cat.category}">{cat.category}</a>: {cat.count}</li>
      {/each}
    </ul>
  {/if}
</header>

{#each posts as post, index}
  <ListedPost {post} index={posts.length - index} />
  {#if dev}
    <SEOData
      allLinks={counted}
      link={counted.find(
        (link) => link.slug === `/${post.category}/${post.slug}`
      )}
      allWords={words}
      words={words.find((obj) => obj.slug === `/${post.category}/${post.slug}`)}
    />
  {/if}
{/each}

<style lang="scss">
  header {
    margin: 0 0 var(--gap100);
    @media only screen and (min-width: 480) {
      margin-bottom: var(--gap100);
    }
    p {
      color: var(--grey600);
      margin: 0 0 var(--gap50);
      transition: color 0.5s;
      &:last-child {
        margin-bottom: 0;
      }
    }
    &:hover {
      p {
        color: var(--grey700);
      }
    }
    .stats {
      margin: 0;
      display: flex;
      list-style: none;
      justify-content: space-between;
      border: 1px solid var(--grey300);
      border-radius: var(--radius20);
      padding: var(--gap10) var(--gap20);
      font-size: var(--fz10);
      li {
        margin: 0;
        padding: 0;
        color: var(--grey600);
        a {
          color: var(--grey600);
          text-decoration: none;
          &:hover {
            color: var(--primary500);
          }
        }
      }
    }
  }
</style>
