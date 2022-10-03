<script lang="ts">
  import type { PageData } from './$types';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import { dev } from '$app/environment';
  import SEOData from '$lib/components/SEOData.svelte';
  import Emphasis from '$lib/components/Emphasis.svelte';
  import type { Post } from '$lib/utils/types';

  export let data: PageData;

  $: posts = data.posts;
  $: counted = data.counted;
  $: words = data.words;
  $: categories = data.categories;

  let showSEO = true;
  let filterStatus: Post['status'] | 'all' = 'all';

  $: if (dev) {
    if (filterStatus === 'draft') {
      posts = data.posts.filter((post) => post.status === 'draft');
    } else if (filterStatus === 'published') {
      posts = data.posts.filter((post) => post.status === 'published');
    } else {
      posts = data.posts;
    }
  }

  function handleStatusClick() {
    if (filterStatus === 'all') {
      filterStatus = 'published';
      return;
    } else if (filterStatus === 'draft') {
      filterStatus = 'all';
      return;
    } else if (filterStatus === 'published') {
      filterStatus = 'draft';
      return;
    }
  }
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
    todo, <Emphasis type="js">JavaScript</Emphasis>.
  </p>

  {#if dev && categories}
    <ul class="stats">
      <li>total: {posts.length}</li>
      <li>
        draft: {posts.filter((post) => post.status !== 'published').length}
      </li>
      {#if categories}
        <li>-</li>
        {#each categories as cat}
          <li><a href="/{cat.category}">{cat.category}</a>: {cat.count}</li>
        {/each}
      {/if}
    </ul>
    <button on:click={() => (showSEO = !showSEO)}>
      {showSEO ? 'Hide' : 'Show'} post SEO
    </button>
    <button on:click={handleStatusClick}>
      See {#if filterStatus === 'all'}published only{:else if filterStatus === 'published'}draft
        only{:else}all{/if}
    </button>
  {/if}
</header>

{#each posts as post, index}
  <ListedPost {post} index={posts.length - index} />
  {#if dev && showSEO && counted && words}
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
