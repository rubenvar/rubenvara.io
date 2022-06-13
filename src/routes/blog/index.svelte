<script>
  import ListedPost from "$lib/ListedPost.svelte";

  export let posts;
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
    todo, <span class="emphasis js-emphasis">JavaScript</span>.
  </p>
</header>

{#each posts as post}
  <ListedPost {post} />
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
  }
  .emphasis {
    @include variables.emphasis;
  }
  .js-emphasis {
    @include variables.jsEmphasis;
  }
</style>
