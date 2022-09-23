<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import TechTag from './TechTag.svelte';

  export let id: string;
  export let title: string;
  export let techs: string[] = [];

  let showBig = false;

  const close = () => {
    showBig = false;
    goto(`#button-${id}`);
  };

  const handleClick = () => {
    showBig = !showBig;
    if (showBig) goto(`#card-${id}`);
  };

  let x = 50;
  let y = 50;

  const handleMousemove = (event: MouseEvent) => {
    x = event.clientX;
    y = event.clientY;
  };

  // --caa600
  // --tn500
  // --vpnf600
  const customColor = `${id}600`;
</script>

{#if showBig}
  <article
    style="--customColor: var(--{customColor});--x: {x}px;--y: {y}px;"
    id="card-{id}"
    transition:fade={{ duration: 200 }}
    on:mousemove={handleMousemove}
  >
    <button class="close" on:click={close}>&times;</button>
    <div class="main">
      <h3>{title}</h3>
      <div class="tech">
        {#each techs as tech}
          <TechTag {tech} />
        {/each}
      </div>
      <div class="text">
        <slot name="text" />
      </div>
      <div class="stats">
        <slot name="stats">some easy stats here</slot>
      </div>
    </div>
  </article>
{:else}
  <button
    style="--customColor: var(--{customColor})"
    class="toggle"
    id="button-{id}"
    on:click={handleClick}
    transition:fade={{ duration: 200 }}
  >
    <div class="text">
      <h3>{title}</h3>
      <slot name="short" />
    </div>
  </button>
{/if}

<style lang="scss">
  .toggle {
    border-radius: var(--radius30);
    padding: var(--gap20);
    background-color: var(--customColor);
    background: linear-gradient(
      25deg,
      var(--customColor),
      black,
      var(--customColor)
    );
    box-shadow: none;
    border: none;
    text-align: left;
    margin: var(--gap60) 0;
    .text {
      background-color: var(--white);
      background-color: #fffd;
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
    color: var(--white);
    border: none;
    border-radius: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: var(--gap60);
    right: var(--gap40);
  }
  article {
    padding: var(--gap80) var(--gap100);
    background-color: var(--customColor);
    background: radial-gradient(
      circle at var(--x) var(--y),
      black,
      var(--customColor) 300%
    );
    transition: all 0.3s;
    color: var(--white);
    width: 100%;
    /* min-height: 105vh; */
    min-height: 75vh;
    margin: 0;
    grid-column: 1 / -1;
    position: relative;
    .main {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 0 var(--gap40);
      h3 {
        margin-top: 0;
        margin-bottom: var(--gap80);
        grid-column: 2;
        font-size: var(--fz80);
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
      }
      .stats {
        grid-row: 2;
      }
    }
  }
</style>
