<script lang="ts">
  import type { PageData } from './$types';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import { dev } from '$app/env';
  import SEOData from '$lib/components/SEOData.svelte';

  export let data: PageData;

  $: posts = data.posts;
  $: counted = data.counted;
  $: words = data.words;
  $: categories = data.categories;

  let showSEO = true;
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
    <button on:click={() => (showSEO = !showSEO)}
      >{showSEO ? 'Hide' : 'Show'} post SEO</button
    >
  {/if}
</header>

{#each posts as post, index}
  <ListedPost {post} index={posts.length - index} />
  {#if dev && showSEO}
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
    button {
      margin-top: var(--gap40);
      box-shadow: none;
      border-radius: var(--radius20);
      border: 1px solid var(--primary400);
      background: var(--grey100);
      padding: var(--gap10) var(--gap30);
      font-size: var(--fz20);
    }
  }
</style>
