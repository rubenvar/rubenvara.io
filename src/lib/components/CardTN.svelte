<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import TechTag from './TechTag.svelte';
  let showBig = false;

  const handleClick = () => {
    showBig = !showBig;
    if (showBig) goto('#card-tn');
  };
</script>

<button on:click={handleClick}>
  <div class="text">
    <h3>trajesneopreno.es</h3>
    <p>
      Empezó siendo una página nicho de afiliados, ahora es una guía
      completísima sobre aguas abiertas y natación con más de 30k visitas al mes
      y miles de lectores y suscriptores.
    </p>
  </div>
</button>

{#if showBig}
  <article id="card-tn" transition:fade={{ duration: 200 }}>
    <div class="main">
      <h3>trajesneopreno.es</h3>
      <div class="tech">
        <TechTag tech="WordPress" />
        <TechTag tech="PHP" />
        <TechTag tech="React" />
        <TechTag tech="Next.js 12" />
        <TechTag tech="GraphQL" />
        <TechTag tech="react-query" />
        <TechTag tech="node.js" />
        <TechTag tech="Prisma" />
        <TechTag tech="MongoDB" />
      </div>
      <div class="text">
        <p>
          Empezó siendo una página nicho de afiliados, ahora es una guía
          completísima sobre aguas abiertas y natación con más de 30k visitas al
          mes y miles de lectores y suscriptores.
        </p>
        <p>
          A partir de esta he creado otros proyectos distintos para la
          comunidad:
        </p>
        <ul>
          <li>
            Un comparador de ofertas con backend node.js (Prisma) y frontend
            Next.js.
          </li>
          <li>Un grupo de FB con más de 11k usuarios.</li>
          <li>Un programa online que también tengo a la venta.</li>
        </ul>
        <p>Acabo con algo curioso</p>
      </div>
      <div class="stats">some easy stats here</div>
    </div>
  </article>
{/if}

<style lang="scss">
  button {
    border-radius: var(--radius30);
    padding: var(--gap20);
    background-color: var(--tn500);
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
  article {
    padding: var(--gap60);
    background-color: var(--tn500);
    color: var(--white);
    width: 100%;
    min-height: 105vh;
    margin: var(--gap60) 0;
    grid-column: 1 / -1;
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
