<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import TechTag from './TechTag.svelte';
  let showBig = false;

  const close = () => {
    showBig = false;
    goto('#button-caa');
  };

  const handleClick = () => {
    showBig = !showBig;
    if (showBig) goto('#card-caa');
  };
</script>

{#if showBig}
  <article id="card-caa" transition:fade={{ duration: 200 }}>
    <button class="close" on:click={close}>&times;</button>
    <div class="main">
      <h3>calendarioaguasabiertas.com</h3>
      <div class="tech">
        <TechTag tech="React" />
        <TechTag tech="Next.js 12" />
        <TechTag tech="Typescript" />
        <TechTag tech="GraphQL" />
        <TechTag tech="react-query" />
        <TechTag tech="graphql-codegen" />
        <TechTag tech="KeystoneJS 5" />
        <TechTag tech="node.js" />
        <TechTag tech="MongoDB" />
      </div>
      <div class="text">
        <p>
          Un mega-listado de todas las travesías de natación en el estado, y el
          proyecto del que más orgulloso estoy. Visitado por cientos de personas
          cada día.
        </p>
        <p>
          He añadido decenas de funciones desde su creación, hace más de 2 años.
          He aprendido muchísimo trabajando en ello, y sigo teniendo nuevos
          retos a diario.
        </p>
        <p>
          A partir de este he creado varias herramientas extra, como un <em
            >scraper</em
          > o una app de gestión de contactos, ambas con SvelteKit, con bases de
          datos y autenticación en Supabase.js.
        </p>
      </div>
      <div class="stats">some easy stats here</div>
    </div>
  </article>
{:else}
  <button
    class="toggle"
    id="button-caa"
    on:click={handleClick}
    transition:fade={{ duration: 200 }}
  >
    <div class="text">
      <h3>calendarioaguasabiertas.com</h3>
      <p>
        Un mega-listado de todas las travesías de natación en el estado, y el
        proyecto del que más orgulloso estoy. Visitado por cientos de personas
        cada día.
      </p>
    </div>
  </button>
{/if}

<style lang="scss">
  .toggle {
    border-radius: var(--radius30);
    padding: var(--gap20);
    background-color: var(--caa600);
    box-shadow: none;
    border: none;
    text-align: left;
    margin-bottom: var(--gap80);
    .text {
      background-color: var(--white);
      border-radius: var(--radius20);
      padding: var(--gap20);
    }
  }
  .close {
    background: none;
    line-height: 0;
    display: block;
    font-size: var(--fz110);
    box-shadow: none;
    border: none;
    border-radius: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: var(--gap60);
    right: var(--gap40);
  }
  article {
    padding: var(--gap60);
    background-color: var(--caa600);
    color: var(--white);
    width: 100%;
    min-height: 105vh;
    margin: var(--gap60) 0;
    grid-column: 1 / -1;
    position: relative;
    .main {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 0 var(--gap40);
      h3 {
        margin-top: 0;
        grid-column: 2;
      }
      .tech {
        grid-row: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .text {
        grid-row: 2;
        width: var(--maxWidth);
        p:last-child {
          margin-bottom: 0;
        }
      }
      .stats {
        grid-row: 2;
      }
    }
  }
</style>
