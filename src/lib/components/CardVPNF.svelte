<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import TechTag from './TechTag.svelte';
  let showBig = false;

  const handleClick = () => {
    showBig = !showBig;
    if (showBig) goto('#card-vpnf');
  };
</script>

<button on:click={handleClick}>
  <div class="text">
    <h3>vpnfacil.com</h3>
    <p>
      Una herramienta para elegir VPN: un listado con decenas de servicios VPN,
      datos sobre cada uno, comparativas, opiniones, etc.
    </p>
  </div>
</button>

{#if showBig}
  <article id="card-vpnf" transition:fade={{ duration: 200 }}>
    <div class="main">
      <h3>vpnfacil.com</h3>
      <div class="tech" transition:fade={{ duration: 200 }}>
        <TechTag tech="React" />
        <TechTag tech="Gatsby 4" />
        <TechTag tech="Sapper" />
        <TechTag tech="GraphQL" />
        <TechTag tech="REST" />
        <TechTag tech="AWS Lambda" />
      </div>
      <div class="text">
        <p>
          Una herramienta para elegir VPN: un listado con decenas de servicios
          VPN, datos sobre cada uno, comparativas, opiniones, etc.
        </p>
        <p>
          Empezó como un <em>side-project</em> para aprender Sapper. Cuando lo terminé,
          lo reescribí completamente en Gatsby para aprender este también. Ahora
          funcionan ambas webs.
        </p>
        <p>
          El backend es una hoja de Google Sheets 😆 que sirve de API REST a
          través de una función Lambda de AWS.
        </p>
      </div>
      <div class="stats">some easy stats here</div>
    </div>
  </article>
{/if}

<style lang="scss">
  button {
    border-radius: var(--radius30);
    padding: var(--gap20);
    background-color: var(--vpnf600);
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
    background-color: var(--vpnf600);
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
